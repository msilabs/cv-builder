import { bn } from "./bn";
import { en } from "./en";

export type { Lang } from "./detect";
import type { Lang } from "./detect";
export type Dict = typeof bn;
export const dict: Record<Lang, Dict> = { bn, en };
