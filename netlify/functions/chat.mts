import type { Context } from "@netlify/functions"

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  const apiKey = Netlify.env.get("ANTHROPIC_API_KEY")
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const body = await req.json()
  const { system, messages } = body

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages,
    }),
  })

  const data = await res.text()
  return new Response(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  })
}
