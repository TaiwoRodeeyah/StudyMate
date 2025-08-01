// app/api/quote/route.ts
export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");

    if (!res.ok) {
      return new Response(
        JSON.stringify({ text: "Fallback quote", author: "Unknown" }),
        { status: 200 }
      );
    }

    const data = await res.json();
    const quote = {
      text: data[0].q,
      author: data[0].a,
    };

    return new Response(JSON.stringify(quote), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        text: "Stay focused and never give up.",
        author: "Leo",
      }),
      { status: 200 }
    );
  }
}
