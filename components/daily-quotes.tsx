"use client";

import React, { useEffect, useState } from "react";
import { getDailyQuote } from "@/lib/daily-motivations";

export default function DailyQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );

  useEffect(() => {
    async function fetchQuote() {
      const q = await getDailyQuote();
      setQuote(q);
    }
    fetchQuote();
  }, []);

  if (!quote) return <p>Loading motivation...</p>;

  return (
    <div className="rounded-xl bg-[#fdfaf6] border border-[#e6ddd2] p-6 shadow-sm">
      <p className="text-lg text-[#4b4033] leading-relaxed font-serif">
        “{quote.text}”
      </p>
      <p className="text-sm text-right mt-4 text-[#a1907e] italic">
        — {quote.author || "Unknown"}
      </p>
    </div>
  );
}
