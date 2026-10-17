import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MotionMeta } from "./motion";

const MOTION_DATA_PATH = "/data/shaho/miyako.json";
/** URL the browser fetches; carries the base path when the site is served under a prefix. */
export const MOTION_DATA_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${MOTION_DATA_PATH}`;

/** Read only the meta block of the motion file at build time (for video links). */
export function readMotionMeta(): MotionMeta {
  const raw = readFileSync(join(process.cwd(), "public", MOTION_DATA_PATH), "utf8");
  return (JSON.parse(raw) as { meta: MotionMeta }).meta;
}
