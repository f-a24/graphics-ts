import Position from './Position';

/**
 * キャラクター管理のための基幹クラス
 */
export default class Character {
  ctx: CanvasRenderingContext2D;

  position: Position;

  vector: Position;

  angle: number;

  width: number;

  height: number;

  life: number;

  ready: boolean;

  image: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    life: number,
    imagePath: string
  ) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.vector = new Position(0.0, -1.0);
    this.angle = (270 * Math.PI) / 180;
    this.width = w;
    this.height = h;
    this.life = life;
    this.ready = false;
    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.ready = true;
    });
    this.image.src = imagePath;
  }

  // 進行方向を設定する
  setVector(x: number, y: number): void {
    this.vector.set(x, y);
  }

  // 進行方向を角度を元に設定する
  setVectorFromAngle(angle: number): void {
    this.angle = angle;
    this.vector.set(Math.cos(angle), Math.sin(angle));
  }

  // キャラクターを描画する
  draw(): void {
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }

  // 自身の回転量を元に座標系を回転させる
  rotationDraw(): void {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    this.ctx.drawImage(this.image, -offsetX, -offsetY, this.width, this.height);

    this.ctx.restore();
  }
}
