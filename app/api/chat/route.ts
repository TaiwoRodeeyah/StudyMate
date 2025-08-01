import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response("Missing GROQ API key", { status: 500 });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful academic assistant called StudyMate AI." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content;
    return new Response(JSON.stringify({ reply: reply || "No valid response from AI." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Groq error:", error);
    return new Response("Error communicating with Groq", { status: 500 });
  }
}
