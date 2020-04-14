import Character from './Character';
import Position from './Position';
import Shot from './Shot';

/**
 * enemy クラス
 */
export default class Enemy extends Character {
  type: string;

  frame: number;

  speed: number;

  shotArray: Shot[];

  attackTarget: Character;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.type = 'default';
    this.frame = 0;
    this.speed = 3;
    this.shotArray = null;
    this.attackTarget = null;
  }

  // 敵を配置する
  set(x: number, y: number, life = 1, type = 'default'): void {
    this.position.set(x, y);
    this.life = life;
    this.type = type;
    this.frame = 0;
  }

  // ショットを設定する
  setShotArray(shotArray: Shot[]): void {
    this.shotArray = shotArray;
  }

  // 攻撃対象を設定する
  setAttackTarget(target: Character): void {
    this.attackTarget = target;
  }

  // キャラクターの状態を更新し描画を行う
  update(): void {
    if (this.life <= 0) return;
    switch (this.type) {
      case 'wave':
        if (this.frame % 60 === 0) {
          const tx = this.attackTarget.position.x - this.position.x;
          const ty = this.attackTarget.position.y - this.position.y;
          const tv = Position.calcNormal(tx, ty);
          this.fire(tv.x, tv.y, 4.0);
        }
        this.position.x += Math.sin(this.frame / 10);
        this.position.y += 2.0;
        if (this.position.y - this.height > this.ctx.canvas.height)
          this.life = 0;
        break;
      case 'large':
        if (this.frame % 50 === 0) {
          for (let i = 0; i < 360; i += 45) {
            const r = (i * Math.PI) / 180;
            const s = Math.sin(r);
            const c = Math.cos(r);
            this.fire(c, s, 3.0);
          }
        }
        this.position.x += Math.sin((this.frame + 90) / 50) * 2.0;
        this.position.y += 1.0;
        if (this.position.y - this.height > this.ctx.canvas.height)
          this.life = 0;
        break;
      case 'default':
      default: {
        if (this.frame === 50) this.fire();
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;
        if (this.position.y - this.height > this.ctx.canvas.height)
          this.life = 0;
        break;
      }
    }
    this.draw();
    ++this.frame;
  }

  // 自身から指定された方向にショットを放つ
  fire(x = 0.0, y = 1.0, speed = 5.0): void {
    this.shotArray.some((shot) => {
      if (shot.life <= 0) {
        shot.set(this.position.x, this.position.y);
        shot.setSpeed(speed);
        shot.setVector(x, y);
        return true;
      }
      return false;
    });
  }
}
