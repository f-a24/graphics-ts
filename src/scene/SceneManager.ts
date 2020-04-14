/**
 * シーンを管理するためのクラス
 */
export default class SceneManager {
  scene: {};

  activeScene: Function;

  startTime: number;

  frame: number;

  constructor() {
    this.scene = {};
    this.activeScene = null;
    this.startTime = 0;
    this.frame = 0;
  }

  // シーンを追加する
  add(name: string, updateFunction: Function): void {
    this.scene[name] = updateFunction;
  }

  // アクティブなシーンを設定する
  use(name: string): void {
    if (Object.prototype.hasOwnProperty.call(this.scene, name) !== true) return;
    this.activeScene = this.scene[name];
    this.startTime = Date.now();
    this.frame = -1;
  }

  // シーンを更新する
  update(): void {
    const activeTime = (Date.now() - this.startTime) / 1000;
    this.activeScene(activeTime);
    ++this.frame;
  }
}
