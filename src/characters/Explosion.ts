import Position from './Position';
import Sound from '../sound/Sound';

/**
 * 爆発エフェクトクラス
 */
export default class Explosion {
  ctx: CanvasRenderingContext2D;

  life: boolean;

  color: string;

  position: Position;

  radius: number;

  count: number;

  startTime: number;

  timeRange: number;

  fireBaseSize: number;

  fireSize: number[];

  firePosition: Position[];

  fireVector: Position[];

  sound: Sound;

  constructor(
    ctx: CanvasRenderingContext2D,
    radius: number,
    count: number,
    size: number,
    timeRange: number,
    color = '#ff1166'
  ) {
    this.ctx = ctx;
    this.life = false;
    this.color = color;
    this.position = null;
    this.radius = radius;
    this.count = count;
    this.startTime = 0;
    this.timeRange = timeRange;
    this.fireBaseSize = size;
    this.fireSize = [];
    this.firePosition = [];
    this.fireVector = [];
    this.sound = null;
  }

  // 爆発エフェクトを設定する
  set(x: number, y: number): void {
    this.firePosition = [];
    this.fireVector = [];
    [...Array(this.count)].forEach(() => {
      this.firePosition.push(new Position(x, y));
      const vr = Math.random() * Math.PI * 2.0;
      const s = Math.sin(vr);
      const c = Math.cos(vr);
      const mr = Math.random();
      this.fireVector.push(new Position(c * mr, s * mr));
      this.fireSize.push((Math.random() * 0.5 + 0.5) * this.fireBaseSize);
    });
    this.life = true;
    this.startTime = Date.now();
    if (this.sound) this.sound.play();
  }

  static simpleEaseIn(t: number): number {
    return t * t * t * t;
  }

  setSound(sound: Sound): void {
    this.sound = sound;
  }

  // 爆発エフェクトを更新する
  update(): void {
    if (!this.life) return;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = 0.5;
    const time = (Date.now() - this.startTime) / 1000;
    const ease = Explosion.simpleEaseIn(
      1.0 - Math.min(time / this.timeRange, 1.0)
    );
    const progress = 1.0 - ease;
    this.firePosition.forEach((fire, i) => {
      const d = this.radius * progress;
      const x = fire.x + this.fireVector[i].x * d;
      const y = fire.y + this.fireVector[i].y * d;
      const s = 1.0 - progress;
      this.ctx.fillRect(
        x - (this.fireSize[i] * s) / 2,
        y - (this.fireSize[i] * s) / 2,
        this.fireSize[i] * s,
        this.fireSize[i] * s
      );
    });
    if (progress >= 1.0) this.life = false;
  }
}
