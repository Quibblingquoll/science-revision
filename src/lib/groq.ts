// topics + their content pages (your schema names)
export const TOPICS_WITH_PAGES = /* groq */ `
*[_type == "topic"] | order(year asc, term asc, title asc){
  title,
  "slug": slug.current,
  year,            // number or string (Year 7..10)
  term,
  "pages": *[_type=="contentPage" && references(^._id)]
    | order(coalesce(order, 999), title asc){
      title,
      "slug": slug.current
    }
}
`;
