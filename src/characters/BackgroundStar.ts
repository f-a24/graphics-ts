import Position from './Position';

/**
 * 背景を流れる星クラス
 */
export default class BackgroundStar {
  ctx: CanvasRenderingContext2D;

  size: number;

  speed: number;

  color: string;

  position: Position;

  constructor(
    ctx: CanvasRenderingContext2D,
    size: number,
    speed: number,
    color = '#ffffff'
  ) {
    this.ctx = ctx;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.position = null;
  }

  // 星を設定する
  set(x: number, y: number): void {
    this.position = new Position(x, y);
  }

  // 星を更新する
  update(): void {
    this.ctx.fillStyle = this.color;
    this.position.y += this.speed;
    this.ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
    if (this.position.y + this.size > this.ctx.canvas.height) {
      this.position.y = -this.size;
    }
  }
}
