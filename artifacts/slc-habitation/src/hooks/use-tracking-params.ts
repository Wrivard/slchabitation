import { useEffect } from 'react';

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

type TrackingParam = (typeof trackingParams)[number];
type AttributionRecord = {
  params: Partial<Record<TrackingParam, string>>;
  capturedAt: number;
  landingPage: string;
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

    if (Object.keys(capturedParams).length > 0) {
      const record: AttributionRecord = {
        params: capturedParams,
        capturedAt: Date.now(),
        landingPage: window.location.pathname,
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
    trackingParams.forEach((param) => {
      const value = record.params[param];
      if (value) data[param] = value;
    });
    return data;
  };
}
