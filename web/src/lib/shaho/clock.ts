// Playback clock that stands in for a <video> element (the site never shows the video).

export class PlaybackClock {
  private t0 = 0;
  private startedAt: number | null = null;
  private rate = 1;
  private listeners = new Set<() => void>();

  constructor(private readonly end: number) {}

  private now(): number {
    if (this.startedAt == null) return this.t0;
    return Math.min(this.end, this.t0 + ((performance.now() - this.startedAt) / 1000) * this.rate);
  }

  get time(): number {
    return this.now();
  }
  set time(v: number) {
    this.t0 = Math.max(0, Math.min(this.end, v));
    if (this.startedAt != null) this.startedAt = performance.now();
    this.emit();
  }

  get paused(): boolean {
    return this.startedAt == null;
  }

  get playbackRate(): number {
    return this.rate;
  }
  set playbackRate(v: number) {
    this.t0 = this.now();
    if (this.startedAt != null) this.startedAt = performance.now();
    this.rate = v;
    this.emit();
  }

  play() {
    if (this.startedAt != null) return;
    if (this.now() >= this.end) this.t0 = 0;
    this.startedAt = performance.now();
    this.emit();
  }

  pause() {
    if (this.startedAt == null) return;
    this.t0 = this.now();
    this.startedAt = null;
    this.emit();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }
}
