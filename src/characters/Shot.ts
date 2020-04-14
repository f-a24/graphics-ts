import Character from './Character';
import Enemy from './Enemy';
import Explosion from './Explosion';
import Viper from './Viper';

/**
 * shot クラス
 */
export default class Shot extends Character {
  speed: number;

  power: number;

  targetArray: Character[];

  explosionArray: Explosion[];

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 20;
    this.power = 1;
    this.targetArray = [];
    this.explosionArray = [];
  }

  // ショットを配置する
  set(x: number, y: number): void {
    this.position.set(x, y);
    this.life = 1;
  }

  // ショットのスピードを設定する
  setSpeed(speed: number): void {
    if (speed && speed > 0) this.speed = speed;
  }

  // ショットの攻撃力を設定する
  setPower(power: number): void {
    if (power) this.power = power;
  }

  // ショットが衝突判定を行う対象を設定する
  setTargets(targets: Character[]): void {
    if (targets && Array.isArray(targets) && targets.length > 0)
      this.targetArray = targets;
  }

  // ショットが爆発エフェクトを発生できるよう設定する
  setExplosions(targets: Explosion[]): void {
    if (targets && Array.isArray(targets) && targets.length > 0)
      this.explosionArray = targets;
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
    this.position.x += this.vector.x * this.speed;
    this.position.y += this.vector.y * this.speed;
    this.targetArray.forEach((target) => {
      if (this.life <= 0 || target.life <= 0) return;
      const dist = this.position.distance(target.position);
      if (dist <= (this.width + target.width) / 4) {
        if (target instanceof Viper && target.isComing) return;
        if (target.life - this.power <= 0) {
          this.explosionArray.some((explosion) => {
            if (!explosion.life) {
              explosion.set(target.position.x, target.position.y);
              return true;
            }
            return false;
          });
          if (target instanceof Enemy) {
            const score = (target as Enemy).type === 'large' ? 1000 : 100;
            window.gameScore = Math.min(window.gameScore + score, 99999);
          }
        }
        this.life = 0;
      }
    });
    this.rotationDraw();
  }
}
