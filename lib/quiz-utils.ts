export function decodeHtml(input: string): string {
  if (typeof window === "undefined") return input
  const parser = new DOMParser()
  const doc = parser.parseFromString(input, "text/html")
  return doc.documentElement.textContent || input
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
