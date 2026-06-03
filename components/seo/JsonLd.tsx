/**
 * Renders a JSON-LD structured-data block. Server-safe (no client JS). The
 * payload is our own trusted, code-generated schema object (never user input).
 * We still escape `<` to `<` so a stray "</script>" inside any string can
 * never break out of the script tag (the recommended safe JSON-LD pattern).
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
