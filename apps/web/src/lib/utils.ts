import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RiotErrorPayload = {
  status?: { status_code?: number; message?: string };
};

export async function riotFetchJson<T>(
  url: string,
  cache = false,
): Promise<
  { ok: true; data: T; cacheHit: boolean } | { ok: false; errorText: string }
> {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return { ok: false, errorText: "Missing RIOT_API_KEY." };
  }
  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": apiKey,
    },
    cache: cache ? "force-cache" : "no-store",
  });
  const date = new Date(res.headers.get("date") ?? "");
  const cacheHit = Date.now() - date.getTime() > 10000;
  if (!res.ok) {
    let errorText = `${res.status} ${res.statusText}`;
    try {
      const json = (await res.json()) as RiotErrorPayload;
      const msg = json?.status?.message;
      if (msg) errorText = msg;
    } catch {
      // ignore
    }
    return { ok: false, errorText };
  }
  const data = (await res.json()) as T;
  return { ok: true, data, cacheHit };
}
