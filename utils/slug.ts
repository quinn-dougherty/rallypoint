import slugify from "slugify";

function createSlug(title: string, id: string): string {
  return `${slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  })}_${id}`;
}

export default createSlug;
