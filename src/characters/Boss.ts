import Character from './Character';
import Shot from './Shot';
import Homing from './Homing';
import Position from './Position';

/**
 * ボスキャラクタークラス
 */
export default class Boss extends Character {
  mode: string;

  frame: number;

  speed: number;

  shotArray: Shot[];

  homingArray: Homing[];

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
    this.mode = '';
    this.frame = 0;
    this.speed = 3;
    this.shotArray = null;
    this.homingArray = null;
    this.attackTarget = null;
  }

  // ボスを配置する
  set(x: number, y: number, life = 1): void {
    this.position.set(x, y);
    this.life = life;
    this.frame = 0;
  }

  // ショットを設定する
  setShotArray(shotArray: Shot[]): void {
    this.shotArray = shotArray;
  }

  // ホーミングショットを設定する
  setHomingArray(homingArray: Homing[]): void {
    this.homingArray = homingArray;
  }

  // 攻撃対象を設定する
  setAttackTarget(target: Character): void {
    this.attackTarget = target;
  }

  // モードを設定する
  setMode(mode: string): void {
    this.mode = mode;
  }

  // ボスキャラクターの状態を更新し描画を行う
  update(): void {
    if (this.life <= 0) return;

    switch (this.mode) {
      // 出現演出時
      case 'invade':
        this.position.y += this.speed;
        if (this.position.y > 100) {
          this.position.y = 100;
          this.mode = 'floating';
          this.frame = 0;
        }
        break;
      // 退避する演出時
      case 'escape':
        this.position.y -= this.speed;
        if (this.position.y < -this.height) {
          this.life = 0;
        }
        break;
      case 'floating':
        if (this.frame % 1000 < 500) {
          if (this.frame % 200 > 140 && this.frame % 10 === 0) {
            const tx = this.attackTarget.position.x - this.position.x;
            const ty = this.attackTarget.position.y - this.position.y;
            const tv = Position.calcNormal(tx, ty);
            this.fire(tv.x, tv.y, 3.0);
          }
        } else if (this.frame % 50 === 0) this.homingFire(0, 1, 3.5);
        this.position.x += Math.cos(this.frame / 100) * 2.0;
        break;
      default:
        break;
    }
    this.draw();
    ++this.frame;
  }

  // 自身から指定された方向にショットを放つ
  fire(x = 0.0, y = 1.0, speed = 5.0): void {
    for (let i = 0; i < this.shotArray.length; ++i) {
      if (this.shotArray[i].life <= 0) {
        this.shotArray[i].set(this.position.x, this.position.y);
        this.shotArray[i].setSpeed(speed);
        this.shotArray[i].setVector(x, y);
        break;
      }
    }
  }

  // 自身から指定された方向にホーミングショットを放つ
  homingFire(x = 0.0, y = 1.0, speed = 3.0): void {
    for (let i = 0; i < this.homingArray.length; ++i) {
      if (this.homingArray[i].life <= 0) {
        this.homingArray[i].set(this.position.x, this.position.y);
        this.homingArray[i].setSpeed(speed);
        this.homingArray[i].setVector(x, y);
        break;
      }
    }
  }
}
