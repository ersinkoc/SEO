export type EntityMention = {
  type: "person" | "organization" | "place" | "date" | "number";
  value: string;
};

export function extractEntities(text: string): EntityMention[] {
  const entities: EntityMention[] = [];

  const dates = text.match(/\b\d{4}-\d{2}-\d{2}\b/g) ?? [];
  for (const date of dates) entities.push({ type: "date", value: date });

  const numbers = text.match(/\b\d+(?:\.\d+)?\b/g) ?? [];
  for (const number of numbers) entities.push({ type: "number", value: number });

  const capitalized = text.match(/\b[A-Z][a-z]{2,}\b/g) ?? [];
  for (const token of capitalized) {
    const type = token.endsWith("Inc") || token.endsWith("Corp") ? "organization" : "person";
    entities.push({ type, value: token });
  }

  return entities;
}

