/**
 * 座標を管理するためのクラス
 */
export default class Position {
  x: number;

  y: number;

  // ベクトルの長さを返す静的メソッド
  static calcLength(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  // ベクトルを単位化した結果を返す静的メソッド
  static calcNormal(x: number, y: number): Position {
    const len = Position.calcLength(x, y);
    return new Position(x / len, y / len);
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  // 対象の Position クラスのインスタンスとの距離を返す
  distance(target: Position): number {
    const x = this.x - target.x;
    const y = this.y - target.y;
    return Math.sqrt(x * x + y * y);
  }

  // 対象の Position クラスのインスタンスとの外積を計算する
  cross(target: Position): number {
    return this.x * target.y - this.y * target.x;
  }

  // 自身を単位化したベクトルを計算して返す
  normalize(): Position {
    const l = Math.sqrt(this.x * this.x + this.y * this.y);
    if (l === 0) return new Position(0, 0);

    const x = this.x / l;
    const y = this.y / l;
    return new Position(x, y);
  }

  // 指定されたラジアン分だけ自身を回転させる
  rotate(radian: number): void {
    const s = Math.sin(radian);
    const c = Math.cos(radian);
    this.x = this.x * c + this.y * -s;
    this.y = this.x * s + this.y * c;
  }
}
