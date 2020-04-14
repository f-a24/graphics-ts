import Character from './Character';
import Position from './Position';
import Shot from './Shot';

/**
 * viper クラス
 */
export default class Viper extends Character {
  speed: number;

  shotCheckCounter: number;

  shotInterval: number;

  isComing: boolean;

  comingStart: number;

  comingStartPosition: Position;

  comingEndPosition: Position;

  shotArray: Shot[];

  singleShotArray: Shot[];

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    imagePath: string
  ) {
    super(ctx, x, y, w, h, 1, imagePath);
    this.speed = 10;
    this.shotCheckCounter = 0;
    this.shotInterval = 5;
    this.isComing = false;
    this.comingStart = null;
    this.comingStartPosition = null;
    this.comingEndPosition = null;
    this.shotArray = null;
    this.singleShotArray = null;
  }

  // 登場演出に関する設定を行う
  setComing(startX: number, startY: number, endX: number, endY: number): void {
    this.life = 1;
    this.isComing = true;
    this.comingStart = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Position(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }

  // ショットを設定する
  setShotArray(shotArray: Shot[], singleShotArray: Shot[]): void {
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
  }

  // キャラクターの状態を更新し描画を行う
  update(): void {
    if (this.life <= 0) return;
    const justTime = Date.now();
    if (this.isComing === true) {
      const comingTime = (justTime - this.comingStart) / 1000;
      let y = this.comingStartPosition.y - comingTime * 200;
      if (y <= this.comingEndPosition.y) {
        this.isComing = false;
        y = this.comingEndPosition.y;
      }
      this.position.set(this.position.x, y);
      if (justTime % 100 < 50) {
        this.ctx.globalAlpha = 0.5;
      }
    } else {
      if (window.isKeyDown.key_ArrowLeft) this.position.x -= this.speed;
      if (window.isKeyDown.key_ArrowRight) this.position.x += this.speed;
      if (window.isKeyDown.key_ArrowUp === true) this.position.y -= this.speed;
      if (window.isKeyDown.key_ArrowDown === true)
        this.position.y += this.speed;

      const tx = Math.min(Math.max(this.position.x, 0), this.ctx.canvas.width);
      const ty = Math.min(Math.max(this.position.y, 0), this.ctx.canvas.height);
      this.position.set(tx, ty);

      if (window.isKeyDown['key_ '] && this.shotCheckCounter >= 0) {
        this.shotArray.some((shot) => {
          // ↑ breakしたいのでforEach代替
          if (shot.life <= 0) {
            shot.set(this.position.x, this.position.y);
            shot.setPower(2);
            this.shotCheckCounter = -this.shotInterval;
            // ひとつ生成したらループを抜ける
            return true;
          }
          return false;
        });

        for (let i = 0; i < this.singleShotArray.length; i += 2) {
          if (
            this.singleShotArray[i].life <= 0 &&
            this.singleShotArray[i + 1].life <= 0
          ) {
            const radCW = (280 * Math.PI) / 180;
            const radCCW = (260 * Math.PI) / 180;
            this.singleShotArray[i].set(this.position.x, this.position.y);
            this.singleShotArray[i].setVectorFromAngle(radCW);
            this.singleShotArray[i + 1].set(this.position.x, this.position.y);
            this.singleShotArray[i + 1].setVectorFromAngle(radCCW);
            this.shotCheckCounter = -this.shotInterval;
            break;
          }
        }
      }
      ++this.shotCheckCounter;
    }
    this.draw();
    this.ctx.globalAlpha = 1.0;
  }
}
