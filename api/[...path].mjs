/**
 * Vercel serverless entry point for the whole API.
 *
 * The published site is a static build with no server of its own, so every
 * /api/* request lands here and is handed to the same Express app the Replit
 * service runs. One implementation of the quote form, its Turnstile check and
 * its email delivery serves both hosts.
 *
 * This imports the app already bundled by the api-server build rather than its
 * TypeScript source: Vercel compiles TypeScript in this directory with its own
 * module settings, which do not match the workspace's. Staying with plain
 * JavaScript keeps that difference out of the deployment.
 *
 * That bundle only exists if the whole workspace is built, which is why
 * vercel.json pins the build command instead of leaving it to the host: a build
 * of the site alone would leave this import pointing at nothing.
 *
 * Keep this file a thin adapter. Anything with behaviour belongs in the app.
 */
import app from "../artifacts/api-server/dist/app.mjs";

export const config = {
  api: {
    // The quote form posts multipart/form-data with photo attachments, which
    // formidable reads straight from the request stream. Parsing it here first
    // would consume that stream and break the upload.
    bodyParser: false,
  },
};

export default app;
