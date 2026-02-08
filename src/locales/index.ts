import type { LocaleCode } from "../types";
import { enGradeLabels } from "./en";
import { trGradeLabels } from "./tr";

const gradeLabels: Record<LocaleCode, Record<string, string>> = {
  en: enGradeLabels,
  tr: trGradeLabels
};

export function getGradeLabel(locale: LocaleCode, grade: string): string {
  const key = grade.charAt(0) as "A" | "B" | "C" | "D" | "F";
  return gradeLabels[locale][key] ?? grade;
}
