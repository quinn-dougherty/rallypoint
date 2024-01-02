import slugify from "slugify";

function createSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export default createSlug;
