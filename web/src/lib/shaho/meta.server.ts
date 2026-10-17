import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MotionMeta } from "./motion";

export const MOTION_DATA_URL = "/data/shaho/miyako.json";

/** Read only the meta block of the motion file at build time (for video links). */
export function readMotionMeta(): MotionMeta {
  const raw = readFileSync(join(process.cwd(), "public", MOTION_DATA_URL), "utf8");
  return (JSON.parse(raw) as { meta: MotionMeta }).meta;
}
