// /src/lib/groq.ts

// Topics + their content pages (with optional crossword blocks)
export const TOPICS_WITH_PAGES = /* groq */ `
*[_type == "topic"] | order(year asc, term asc, title asc) {
  title,
  "slug": slug.current,
  year,
  term,

  // Nested pages belonging to this topic
  "pages": *[_type == "contentPage" && references(^._id)]
    | order(coalesce(order, 999), title asc) {
      title,
      "slug": slug.current,
      order,
      // optional: short preview for topic menus
      summary,

      // ✅ Fetch crossword blocks (optional, only if present)
      content[]{
        ...,
        _type == "crosswordIpuz" => {
          _type,
          title,
          "slug": slug.current,
          ipuz
        }
      }
    }
}
`;
