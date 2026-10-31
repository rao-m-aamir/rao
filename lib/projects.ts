import { projects } from "../content/projects.ts";
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
export function projectParams(records: readonly { slug: string }[] = projects) {
  return records.map(({ slug }) => ({ slug }));
}
