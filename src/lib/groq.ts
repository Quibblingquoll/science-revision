// /src/lib/groq.ts

// Topics + their content pages (with optional crossword blocks + cloze/answers PDFs)
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
      summary,

      // ✅ Exercises: cloze + word bank + PDFs
      exercises{
        cloze,
        wordBank,
        clozePdf{asset->{url, originalFilename, size, mimeType}},
        answersPdf{asset->{url, originalFilename, size, mimeType}}
      },

      // ✅ Optional crossword blocks (if present in content array)
      content[] {
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
