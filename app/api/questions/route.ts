export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const amount = Number(searchParams.get("amount") ?? "15")

  const upstream = `https://opentdb.com/api.php?amount=${Number.isFinite(amount) && amount > 0 ? amount : 15}`

  try {
    const res = await fetch(upstream, { cache: "no-store" })
    if (!res.ok) {
      return Response.json({ error: "Failed to fetch questions" }, { status: 502 })
    }
    const data = await res.json()

    // Validate shape and contents
    if (!data || data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) {
      return Response.json({ error: "No results from provider" }, { status: 502 })
    }

    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  } catch (e) {
    return Response.json({ error: "Unexpected error fetching questions" }, { status: 500 })
  }
}
