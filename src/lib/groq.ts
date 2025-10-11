// topics + their content pages (your schema names)
export const TOPICS_WITH_PAGES = /* groq */ `
*[_type == "topic" && !(_id in path("drafts.**"))]
  | order(year asc, term asc, title asc){
  title,
  "slug": slug.current,
  year,            // number or string (Year 7..10)
  term,
  "pages": *[
      _type=="contentPage" && references(^._id) && !(_id in path("drafts.**"))
    ] | order(coalesce(order, 999), title asc){
      title,
      "slug": slug.current,
      order,
      // flag so the UI can indicate pages that contain cloze content
      "hasCloze": count(content[_type in ["clozeBlock","clozePasteBlock"]]) > 0
    }
}
`;
