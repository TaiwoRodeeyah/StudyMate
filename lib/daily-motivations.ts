// lib/daily-motivations.ts
export async function getDailyQuote() {
  const res = await fetch("/api/quote");

  if (!res.ok) {
    throw new Error("Failed to fetch quote");
  }

  return await res.json();
}
