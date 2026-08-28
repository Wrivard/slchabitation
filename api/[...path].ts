/**
 * Vercel serverless entry point for the whole API.
 *
 * The published site is a static build, so it has no server of its own. This
 * catch-all function gives it one: every /api/* request is handed to the same
 * Express app the Replit service runs, so there is a single implementation of
 * the quote form, its Turnstile check and its email delivery.
 *
 * Keep this file a thin adapter. Anything with behaviour belongs in the app so
 * both hosts stay identical.
 */
import app from "../artifacts/api-server/src/app";

export const config = {
  api: {
    // The quote form posts multipart/form-data with photo attachments, which
    // formidable reads straight from the request stream. Parsing it here first
    // would consume that stream and break the upload.
    bodyParser: false,
  },
};

export default app;
