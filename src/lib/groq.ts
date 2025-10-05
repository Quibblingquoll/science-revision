export const MENU_QUERY = /* groq */ `
*[_type == "year"]|order(title asc){
  title, "slug": slug.current,
  "topics": *[_type=="topic" && references(^._id)]|order(term asc, title asc){
    title, term, "slug": slug.current,
    "pages": *[_type=="revisionPage" && references(^._id)]|order(coalesce(order, 999), title asc){
      title, "slug": slug.current
    }
  }
}
`;
