/**
 * Exercise the real multipart route and email rendering without contacting
 * Resend, Cloudflare or Google. All configuration below is synthetic and
 * compiled into a test-only bundle; no workspace secrets are read or changed.
 * Run: node artifacts/api-server/scripts/check-optional-budget.mjs
 */
import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import express from "express";

const sent = [];
const routeFile = fileURLToPath(new URL("../src/routes/submit-form.ts", import.meta.url));
const compiled = await build({
  entryPoints: [routeFile],
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  external: ["express"],
  define: {
    "process.env.RESEND_API_KEY": '"test-not-a-real-key"',
    "process.env.RECIPIENT_EMAIL": '"owner@example.com"',
    "process.env.FROM_EMAIL": '"sender@example.com"',
    "process.env.CC_EMAIL": '""',
    "process.env.TURNSTILE_SECRET_KEY": '""',
    "process.env.NODE_ENV": '"development"',
  },
  plugins: [{
    name: "no-external-delivery",
    setup(builder) {
      builder.onResolve({ filter: /^resend$/ }, () => ({ path: "resend", namespace: "test" }));
      builder.onLoad({ filter: /.*/, namespace: "test" }, () => ({
        contents: "export class Resend { emails = { send: async (message) => { globalThis.__budgetTestMail.push(message); return {data:{id:'test'},error:null}; } }; }",
        loader: "js",
      }));
      builder.onResolve({ filter: /conversion-dispatch$/ }, () => ({
        path: "conversion", namespace: "test-conversion",
      }));
      builder.onLoad({ filter: /.*/, namespace: "test-conversion" }, () => ({
        contents: "export async function dispatchConversion(){ throw new Error('Unexpected conversion'); }",
        loader: "js",
      }));
    },
  }],
});

globalThis.__budgetTestMail = sent;
const testCode = compiled.outputFiles[0].text.replace(
  'req.log.error({ code }, "Quote form submission failed")',
  'req.log.error({ code, error }, "Quote form submission failed")',
);
const module = new Module(routeFile);
module.filename = routeFile;
module.paths = createRequire(routeFile).resolve.paths("express");
module._compile(testCode, routeFile);
const app = express();
app.use((req, _res, next) => {
  req.log = { info() {}, warn() {}, error: console.error };
  next();
});
let router = module.exports.default;
app.use((req, res, next) => router(req, res, next));
const server = app.listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));

try {
  for (const [budget, expectedStatus, expectedLabel, expectedError = "invalid_budget", overrides = {}] of [
    [undefined, 200, "Non précisé"],
    ["", 200, "Non précisé"],
    ["Contact 6 Radio 2", 200, "25 000 $ – 50 000 $"],
    ["not-a-budget", 400],
    ["toString", 400],
    [undefined, 400, undefined, "consent_required", { consent_contact: "false" }],
    [undefined, 400, undefined, "honeypot", { company_website: "spam" }],
  ]) {
    // Load a fresh router for every case so intentional rate limits do not
    // obscure budget validation. The actual route and templates are unchanged.
    module._compile(testCode, routeFile);
    router = module.exports.default;
    const form = new FormData();
    for (const [key, value] of Object.entries({
      "Contact-6-First-Name": "Test",
      "Contact-6-Last-Name": "Budget",
      "Contact-6-Email": "visitor@example.com",
      "Contact-6-Phone": "5145550123",
      "Contact-6-Select": "Rénovation de cuisine",
      "Contact-6-Message": "Projet de rénovation de cuisine pour une vérification.",
      startedAt: String(Date.now() - 10_000),
      consent_contact: "true",
      consent_text: "Je consens à être contacté pour ma demande.",
      consent_version: "test",
      ...overrides,
    })) form.append(key, value);
    if (budget !== undefined) form.append("Contact-6-Radio", budget);
    const before = sent.length;
    const response = await fetch(`http://127.0.0.1:${server.address().port}/submit-form`, {
      method: "POST", body: form,
      headers: { "x-forwarded-for": `192.0.2.${before + (budget?.length ?? 1)}` },
    });
    const result = await response.json();
    assert.equal(response.status, expectedStatus, JSON.stringify(result));
    if (expectedStatus === 200) {
      assert.equal(result.success, true);
      assert.equal(sent.length - before, 2, "Owner and visitor messages rendered");
      for (const message of sent.slice(before)) {
        assert.ok(message.text.includes(expectedLabel), "Readable budget in text email");
        assert.ok(message.html.includes(expectedLabel), "Readable budget in HTML email");
      }
    } else {
      assert.equal(result.error.code, expectedError);
      assert.equal(sent.length, before, "Invalid requests never reach email");
    }
    console.log(`PASS budget=${JSON.stringify(budget) ?? "absent"} (${expectedStatus === 200 ? "accepted" : expectedError})`);
  }
} finally {
  server.close();
  delete globalThis.__budgetTestMail;
}
