export type ConversionStatus =
  | "unavailable"
  | "pending"
  | "consent_denied"
  | "dispatched"
  | "failed"
  | "duplicate";

export type ConversionDispatchInput = {
  submissionId: string;
  marketingConsentVersion: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  gadSource?: string;
  gadCampaignId?: string;
};

const dispatched = new Map<string, number>();
const inFlight = new Map<string, Promise<ConversionStatus>>();
const DEDUP_TTL_MS = 24 * 60 * 60 * 1000;

function prune(now: number) {
  for (const [key, sentAt] of dispatched) {
    if (sentAt + DEDUP_TTL_MS <= now) dispatched.delete(key);
  }
}

/**
 * Optional server-to-server conversion delivery.
 *
 * Set CONVERSION_DISPATCH_ENABLED=true and CONVERSION_WEBHOOK_URL to enable it.
 * The receiving service must be the configured Google Ads/Data Manager adapter
 * and must honour the Idempotency-Key header. No Google Ads credentials or IDs
 * are assumed by this application.
 */
export async function dispatchConversion(
  input: ConversionDispatchInput,
): Promise<ConversionStatus> {
  if (process.env.CONVERSION_DISPATCH_ENABLED !== "true" || !process.env.CONVERSION_WEBHOOK_URL) {
    return "unavailable";
  }

  const now = Date.now();
  prune(now);
  if (dispatched.has(input.submissionId)) return "duplicate";
  const existingRequest = inFlight.get(input.submissionId);
  if (existingRequest) return existingRequest;

  const request = (async (): Promise<ConversionStatus> => {
    try {
      const response = await fetch(process.env.CONVERSION_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": input.submissionId,
          ...(process.env.CONVERSION_WEBHOOK_BEARER_TOKEN
            ? { authorization: `Bearer ${process.env.CONVERSION_WEBHOOK_BEARER_TOKEN}` }
            : {}),
        },
        body: JSON.stringify({
          submissionId: input.submissionId,
          event: "lead_submitted",
          occurredAt: new Date(now).toISOString(),
          consent: {
            marketing: "granted",
            version: input.marketingConsentVersion,
          },
          attribution: {
            gclid: input.gclid,
            gbraid: input.gbraid,
            wbraid: input.wbraid,
            gad_source: input.gadSource,
            gad_campaignid: input.gadCampaignId,
          },
        }),
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) return "failed";
      dispatched.set(input.submissionId, now);
      return "dispatched";
    } catch {
      return "failed";
    } finally {
      inFlight.delete(input.submissionId);
    }
  })();

  inFlight.set(input.submissionId, request);
  return request;
}