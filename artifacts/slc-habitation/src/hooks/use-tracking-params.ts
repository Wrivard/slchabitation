import { useEffect } from 'react';
import { isPaidPageSlug } from '@/lib/paid-pages';

const trackingParams = [
  'utm_source', 
  'utm_medium', 
  'utm_campaign', 
  'utm_term', 
  'utm_content', 
  'gclid', 
  'gbraid', 
  'wbraid', 
  'gad_source', 
  'gad_campaignid'
] as const;

const STORAGE_KEY = 'google_ads_attribution_v1';
const ATTRIBUTION_TTL_MS = 30 * 60 * 1000;

/* Page publicitaire d'où vient le clic, ajoutée par les boutons du tunnel :
   le formulaire est commun à tout le site, ce paramètre dit quelle page l'a
   amené. Seules les pages connues sont retenues. */
const PAID_PAGE_PARAM = 'pub';

type TrackingParam = (typeof trackingParams)[number];
type AttributionRecord = {
  params: Partial<Record<TrackingParam, string>>;
  capturedAt: number;
  landingPage: string;
  paidPage?: string;
};

function readAttribution(): AttributionRecord | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionRecord;
    if (
      typeof parsed.capturedAt !== 'number' ||
      !parsed.params ||
      Date.now() - parsed.capturedAt > ATTRIBUTION_TTL_MS
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function useTrackingParams() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const capturedParams: Partial<Record<TrackingParam, string>> = {};

    trackingParams.forEach((param) => {
      const value = searchParams.get(param)?.trim();
      if (value) capturedParams[param] = value;
    });

    const paidPageSlug = searchParams.get(PAID_PAGE_PARAM)?.trim() ?? '';
    const paidPage = isPaidPageSlug(paidPageSlug) ? `/pub/${paidPageSlug}` : undefined;

    if (Object.keys(capturedParams).length > 0 || paidPage) {
      const previous = readAttribution();
      const record: AttributionRecord = {
        params: Object.keys(capturedParams).length > 0 ? capturedParams : (previous?.params ?? {}),
        capturedAt: Date.now(),
        landingPage: previous?.landingPage ?? window.location.pathname,
        paidPage: paidPage ?? previous?.paidPage,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } else {
      readAttribution();
    }
  }, []);

  return (): Record<string, string> => {
    const record = readAttribution();
    if (!record) return {};

    const data: Record<string, string> = {
      attribution_captured_at: new Date(record.capturedAt).toISOString(),
      attribution_landing_page: record.landingPage,
    };
    if (record.paidPage) data.paid_page = record.paidPage;
    trackingParams.forEach((param) => {
      const value = record.params[param];
      if (value) data[param] = value;
    });
    return data;
  };
}
