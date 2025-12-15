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
): Promise<{ ok: true; data: T } | { ok: false; errorText: string }> {
  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return { ok: false, errorText: "Missing RIOT_API_KEY." };
  }
  const res = await fetch(url, {
    headers: {
      "X-Riot-Token": apiKey,
    },
    cache: "no-store",
  });
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
  return { ok: true, data };
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIdx = 0;
  async function worker() {
    while (true) {
      const current = nextIdx;
      nextIdx += 1;
      if (current >= items.length) return;
      results[current] = await mapper(items[current]);
    }
  }
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}
