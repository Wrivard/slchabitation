import { Router, type IRouter } from "express";

const router: IRouter = Router();

/**
 * The site key is intentionally public and is needed by the static frontend at
 * runtime. Never include the server secret in this response.
 */
router.get("/turnstile-config", (_req, res) => {
  const siteKey = process.env.VITE_TURNSTILE_SITE_KEY?.trim();

  res.setHeader("Cache-Control", "no-store");

  if (!siteKey) {
    res.status(503).json({
      enabled: false,
      error: {
        code: "security_unavailable",
        message: "La vérification de sécurité est temporairement indisponible.",
      },
    });
    return;
  }

  res.json({ enabled: true, siteKey });
});

export default router;