// A public demonstration video the 射法八節 page links to (link only — the site shows
// none of its footage). Start times are where each 節 begins, read from the video's captions.

export const SHAHO_VIDEO = {
  title: "Miyako's Kyudo〈弓道入門：射法八節的連貫動作〉",
  url: "https://www.youtube.com/watch?v=_3V4mznQLIs",
  starts: {
    torimi: 3,
    ashibumi: 8,
    dozukuri: 16,
    yugamae: 37,
    uchiokoshi: 63,
    daisan: 67,
    hikiwake: 71,
    kai: 82,
    hanare: 86,
    zanshin: 89,
    yudaoshi: 94,
  } as Record<string, number>,
};

/** Link to the video at a given second. */
export function videoAt(url: string, seconds: number): string {
  return `${url}${url.includes("?") ? "&" : "?"}t=${Math.floor(seconds)}s`;
}
