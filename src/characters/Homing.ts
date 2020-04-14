import Position from './Position';
import Shot from './Shot';
import Viper from './Viper';
import Enemy from './Enemy';

/**
 * homing shot クラス
 */
export default class Homing extends Shot {
  frame: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, imagePath);
    this.frame = 0;
  }

  // ホーミングショットを配置する
  set(x: number, y: number, speed?: number, power?: number): void {
    this.position.set(x, y);
    this.life = 1;
    this.setSpeed(speed);
    this.setPower(power);
    this.frame = 0;
  }

  // キャラクターの状態を更新し描画を行う
  update(): void {
    if (this.life <= 0) return;
    if (
      this.position.x + this.width < 0 ||
      this.position.x - this.width > this.ctx.canvas.width ||
      this.position.y + this.height < 0 ||
      this.position.y - this.height > this.ctx.canvas.height
    )
      this.life = 0;

    const target = this.targetArray[0];
    if (this.frame < 100) {
      const vector = new Position(
        target.position.x - this.position.x,
        target.position.y - this.position.y
      );
      const normalizedVector = vector.normalize();
      this.vector = this.vector.normalize();
      const cross = this.vector.cross(normalizedVector);
      const rad = Math.PI / 180.0;
      if (cross > 0.0) {
        // 右側にターゲットいるので時計回りに回転させる
        this.vector.rotate(rad);
      } else if (cross < 0.0) {
        // 左側にターゲットいるので反時計回りに回転させる
        this.vector.rotate(-rad);
      }
    }
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.angle = Math.atan2(this.vector.y, this.vector.x);

    // ショットと対象との衝突判定を行う
    // ※以下は Shot クラスの衝突判定とまったく同じロジック
    this.targetArray.forEach((character) => {
      if (this.life <= 0 || character.life <= 0) return;
      const dist = this.position.distance(character.position);
      if (dist <= (this.width + character.width) / 4) {
        if (character instanceof Viper && (character as Viper).isComing) return;
        character.life -= this.power;
        if (character.life <= 0) {
          for (let i = 0; i < this.explosionArray.length; ++i) {
            if (this.explosionArray[i].life !== true) {
              this.explosionArray[i].set(
                character.position.x,
                character.position.y
              );
              break;
            }
          }
          if (character instanceof Enemy) {
            let score = 100;
            if ((character as Enemy).type === 'large') {
              score = 1000;
            }
            window.gameScore = Math.min(window.gameScore + score, 99999);
          }
        }
        this.life = 0;
      }
    });
    this.rotationDraw();
    ++this.frame;
  }
}
