import { bn } from "./bn";
import { en } from "./en";

export type Lang = "bn" | "en";
export type Dict = typeof bn;
export const dict: Record<Lang, Dict> = { bn, en };
