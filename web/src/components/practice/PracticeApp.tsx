// 練習場: counts the question banks at build time and hands them to the client hub, so the hub bundle carries no
// bank. Each mode and its bank are loaded on demand inside PracticeHub.

import { MYTH_COUNT } from "@/content/practice/myths";
import { SCENARIO_COUNT } from "@/content/practice/scenarios";
import { CUE_ITEMS } from "@/content/practice/shaho";
import PracticeHub from "./PracticeHub";

export default function PracticeApp() {
  return <PracticeHub counts={{ cues: CUE_ITEMS.length, myths: MYTH_COUNT, scenarios: SCENARIO_COUNT }} />;
}
