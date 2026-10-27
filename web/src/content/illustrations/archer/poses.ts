// Canonical poses for the 射法八節 illustrations (src/components/illustrations/archer).
// Each pose is plain data: segment directions for both arms, the bow's orientation and draw,
// the head turn and the stance. The renderer computes everything else by forward kinematics.
//
// Directions are { az, el } in degrees, in the archer's own frame:
//   az 0 = the archer's left (toward the target), 90 = forward, 180 = right, −90 = back;
//   el +90 = straight up, −90 = straight down.
// Positions these angles produce (cm, archer ~170 cm) are noted next to each pose; they follow
// src/content/shaho.ts and docs/research/03 §1.4 / §6.9. Where the sources give no number
// (fist height in 弓構え, elbow angles…) the values are plausible, not prescribed.

export interface Dir {
  az: number;
  el: number;
}

export interface ArmPose {
  upper: Dir;
  fore: Dir;
}

export type PoseId =
  | "torimi"
  | "ashibumi"
  | "dozukuri"
  | "yugamae"
  | "uchiokoshi"
  | "daisan"
  | "hikiwake"
  | "kai"
  | "hanare"
  | "zanshin"
  | "yudaoshi";

export interface ArcherPose {
  id: PoseId;
  /** Japanese name, for the accessible label */
  term: string;
  /** Short Chinese description used as the SVG title / aria-label */
  alt: string;
  stance: "together" | "ashibumi";
  /** 0 = facing the viewer, 90 = turned fully toward the target (物見) */
  headYaw: number;
  left: ArmPose;
  right: ArmPose;
  bow: {
    /** along the bow, 本弭 → 末弭 */
    up: Dir;
    /** horizontal direction the bow's back faces; the arrow flies this way. 0 = toward the target */
    face: number;
    /** grip → string distance at the nock (cm). 15 = braced, ≈ 85 = full draw (矢束) */
    draw: number;
  };
  /** nocked arrow, the pair of arrows held in the right hand (執弓), or none (after the shot) */
  arrow: "nocked" | "held" | "none";
  /** faint sight line from the eye to the target */
  gaze?: boolean;
  motion?: "descend" | "release";
}

// Shared arm sets -------------------------------------------------------------------------

/** Fists on the hip bones, elbows a little out to the sides (not behind the body line). */
const HIPS_L: ArmPose = { upper: { az: 20.6, el: -39.8 }, fore: { az: -174.8, el: -48.4 } };
const HIPS_R: ArmPose = { upper: { az: 159.4, el: -39.8 }, fore: { az: -5.2, el: -48.4 } };

/** 執弓: the 末弭 in front of the body centre about 10 cm above the floor. */
const TORIMI_BOW = { up: { az: 106.5, el: -36.5 }, face: 180, draw: 15 } as const;

export const POSES: Record<PoseId, ArcherPose> = {
  // Feet together, fists on the hip bones (≈ ±19, 99), bow slanting forward-down so the 末弭 is in front
  // of the body centre ≈ 10 cm above the floor (≈ 120 cm ahead); two arrows pointing at the 末弭.
  torimi: {
    id: "torimi",
    term: "執弓の姿勢",
    alt: "執弓の姿勢：雙腳靠攏（男子約 3 公分、女子併攏），兩拳在腰；左手的弓往前下方斜，末弭在身體正前方、離地約 10 公分；右手的箭尖指向末弭。",
    stance: "together",
    headYaw: 0,
    left: HIPS_L,
    right: HIPS_R,
    bow: TORIMI_BOW,
    arrow: "held",
  },
  // Same hands, feet opened to about one 矢束, looking at the target.
  ashibumi: {
    id: "ashibumi",
    term: "足踏み",
    alt: "足踏み：先看靶，雙腳向外踏開約一個矢束、成約 60 度，弓與箭仍是執弓的持法。",
    stance: "ashibumi",
    headYaw: 88,
    left: HIPS_L,
    right: HIPS_R,
    bow: TORIMI_BOW,
    arrow: "held",
    gaze: true,
  },
  // 本弭 on the left knee (≈ 20, 48), so the grip sits ≈ 72 cm above it: left fist ≈ (36, 112, 34),
  // bow leaning a little forward; right fist on the right hip; arrow nocked, pointing at the target.
  dozukuri: {
    id: "dozukuri",
    term: "胴造り",
    alt: "胴造り：弓的本弭放在左膝上、箭已搭在弦上，右手放在右腰；上半身直立、穩穩坐在腰上。",
    stance: "ashibumi",
    headYaw: 0,
    left: { upper: { az: 14.1, el: -47.9 }, fore: { az: 91.7, el: -12.5 } },
    right: HIPS_R,
    bow: { up: { az: 87.5, el: 67 }, face: 0, draw: 15 },
    arrow: "nocked",
  },
  // Hands in front of the body ≈ y 120, 40 cm forward; arms rounded (円相); head turned to the target (物見).
  yugamae: {
    id: "yugamae",
    term: "弓構え",
    alt: "弓構え：右手扣弦（取懸け）、左手握弓（手の內），兩臂在身體前方撐成圓形，臉轉向靶（物見）。",
    stance: "ashibumi",
    headYaw: 88,
    left: { upper: { az: 56.1, el: -28.7 }, fore: { az: 139.6, el: -13.6 } },
    right: { upper: { az: 121.1, el: -27 }, fore: { az: 34.7, el: -9.3 } },
    bow: { up: { az: 90, el: 90 }, face: 0, draw: 15 },
    arrow: "nocked",
    gaze: true,
  },
  // Both fists raised together to slightly above the forehead (fists ≈ y 175, arrow ≈ 181), arrow level.
  uchiokoshi: {
    id: "uchiokoshi",
    term: "打起し",
    alt: "打起し（正面打起し）：兩拳同時舉到比額頭稍高的位置，兩臂保持圓形，弓與箭保持水平。",
    stance: "ashibumi",
    headYaw: 88,
    left: { upper: { az: 16.5, el: 43.8 }, fore: { az: 152.4, el: 29.8 } },
    right: { upper: { az: 160, el: 52 }, fore: { az: 22.3, el: 23.5 } },
    bow: { up: { az: 90, el: 90 }, face: 0, draw: 15 },
    arrow: "nocked",
  },
  // Left fist pushed toward the target ≈ (47, 173); right hand in front of the forehead; draw ≈ half the arrow.
  daisan: {
    id: "daisan",
    term: "大三",
    alt: "大三：左手往靶的方向推出，右手跟著來到額頭前方，弦拉開約箭長的一半，箭保持水平。",
    stance: "ashibumi",
    headYaw: 88,
    left: { upper: { az: 21.3, el: 37.3 }, fore: { az: 73, el: 31 } },
    right: { upper: { az: 122.1, el: 58.6 }, fore: { az: 40.9, el: 22 } },
    bow: { up: { az: 90, el: 90 }, face: 0, draw: 52 },
    arrow: "nocked",
  },
  // Drawing down evenly: arrow ≈ y 164 (eyebrow level) on its way to the mouth.
  hikiwake: {
    id: "hikiwake",
    term: "引分け",
    alt: "引分け：兩手左右均等地拉開，箭一邊保持水平、一邊慢慢降到嘴唇的高度。",
    stance: "ashibumi",
    headYaw: 90,
    left: { upper: { az: -7.5, el: 12.1 }, fore: { az: 29.8, el: 23.4 } },
    right: { upper: { az: -149, el: 65.5 }, fore: { az: 31, el: -10.4 } },
    bow: { up: { az: 90, el: 90 }, face: 0, draw: 70 },
    arrow: "nocked",
    motion: "descend",
  },
  // Full draw (矢束 ≈ 86 cm): arrow at the mouth (≈ y 152) along the cheek, string across the chest,
  // left arm extended toward the target, right elbow ≈ 18 cm behind the shoulder line.
  kai: {
    id: "kai",
    term: "会",
    alt: "会：拉滿，箭在嘴唇的高度貼著臉頰，弦貼在胸前；左臂伸向靶，右肘在兩肩連線的後方。",
    stance: "ashibumi",
    headYaw: 90,
    left: { upper: { az: 4, el: 5.5 }, fore: { az: 6, el: 6.5 } },
    right: { upper: { az: -132.9, el: 34.1 }, fore: { az: 50.9, el: -14 } },
    bow: { up: { az: 90, el: 90 }, face: 0, draw: 86 },
    arrow: "nocked",
  },
  // Release: arms open along one line, the right hand flies back; the bow has turned in the hand
  // (弓返り, face 160°) so the string lies on the far side of the bow, toward the target.
  hanare: {
    id: "hanare",
    term: "離れ",
    alt: "離れ：箭離弦的瞬間，兩臂沿一直線向左右展開；弓在左手中轉動（弓返り），弦轉到左手的外側。",
    stance: "ashibumi",
    headYaw: 90,
    left: { upper: { az: 5, el: 2 }, fore: { az: 6, el: 1 } },
    right: { upper: { az: -130.9, el: 4.8 }, fore: { az: 154.7, el: -22.3 } },
    bow: { up: { az: 90, el: 88 }, face: 160, draw: 15 },
    arrow: "none",
    motion: "release",
  },
  // Held open after the release; gaze stays on the 矢所 (where the arrow landed).
  zanshin: {
    id: "zanshin",
    term: "残心",
    alt: "残心：保持離れ之後的姿勢，兩臂展開成一直線，視線停在矢所。",
    stance: "ashibumi",
    headYaw: 90,
    left: { upper: { az: 5, el: 1 }, fore: { az: 6, el: 0 } },
    right: { upper: { az: -149.8, el: -16.5 }, fore: { az: -167, el: -27.3 } },
    bow: { up: { az: 90, el: 88 }, face: 160, draw: 15 },
    arrow: "none",
    gaze: true,
  },
  // Fists back to the hips, bow back to the 執弓 angle, face back to the front; feet still open.
  yudaoshi: {
    id: "yudaoshi",
    term: "弓倒し",
    alt: "弓倒し：兩拳回到腰，弓回到執弓的角度，臉轉回正面；雙腳仍然張開，之後才合腳。",
    stance: "ashibumi",
    headYaw: 0,
    left: HIPS_L,
    right: HIPS_R,
    bow: TORIMI_BOW,
    arrow: "none",
  },
};

/** Section id (src/content/shaho.ts) → the pose that stands for it in thumbnails. */
export const THUMB_POSE: Record<string, PoseId> = {
  torimi: "torimi",
  ashibumi: "ashibumi",
  dozukuri: "dozukuri",
  yugamae: "yugamae",
  uchiokoshi: "uchiokoshi",
  hikiwake: "hikiwake",
  kai: "kai",
  hanare: "hanare",
  zanshin: "zanshin",
  yudaoshi: "yudaoshi",
};

/** Section id → what its card shows: front-view poses, an optional side view, the 足踏み footprints. */
export interface SectionFigureSpec {
  poses: PoseId[];
  /** also draw the first pose from the target's side, or from above */
  extra?: "side" | "top";
  footprints?: boolean;
  caption: string;
}

export const SECTION_FIGURES: Record<string, SectionFigureSpec> = {
  torimi: {
    poses: ["torimi"],
    extra: "side",
    caption: "左：正面，弓與箭的延長線（紅色虛線）成二等邊三角形。右：側面，末弭在身體正前方、離地約 10 公分。",
  },
  ashibumi: {
    poses: ["ashibumi"],
    footprints: true,
    caption: "先看靶再踏開。下圖從上方看：兩拇趾尖與靶心連成一直線，寬度約一個矢束，兩腳約成 60 度。",
  },
  dozukuri: { poses: ["dozukuri"], caption: "本弭放在左膝上、箭已搭好，右手在右腰；上半身直立。" },
  yugamae: { poses: ["yugamae"], caption: "取懸け、手の内之後轉頭看靶（物見）；兩臂像抱著大樹般撐圓。" },
  uchiokoshi: { poses: ["uchiokoshi"], caption: "正面打起し：兩拳同時舉到比額頭稍高的位置，箭保持水平。" },
  hikiwake: {
    poses: ["daisan", "hikiwake"],
    caption: "左：大三，左手推向靶、拉開約箭長的一半。右：左右均等地拉開，箭慢慢降到嘴的高度。",
  },
  kai: {
    poses: ["kai"],
    extra: "top",
    caption: "箭在嘴的高度貼著臉頰，弦貼在胸前。下圖從上方看：箭與兩肩的線（紅色虛線）平行，右肘在肩線後方。",
  },
  hanare: { poses: ["hanare"], caption: "兩臂沿一直線向左右展開；弓在手中轉動（弓返り），弦轉到左手外側。" },
  zanshin: { poses: ["zanshin"], caption: "保持離れ的姿勢，視線停在矢所。" },
  yudaoshi: { poses: ["yudaoshi"], caption: "兩拳回到腰，弓回到執弓的角度，臉轉回正面；之後才合腳。" },
};
