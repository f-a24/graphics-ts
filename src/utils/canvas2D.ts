/**
 * Canvas2D API をラップしたユーティリティクラス
 */
export default class Canvas2DUtility {
  canvasElement: HTMLCanvasElement;

  context2d: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvasElement = canvas;
    this.context2d = canvas.getContext('2d');
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.context2d;
  }

  /**
   * 矩形を描画する
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color?: string
  ): void {
    if (color) this.context2d.fillStyle = color;
    this.context2d.fillRect(x, y, width, height);
  }

  /**
   * 線分を描画する
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color?: string,
    width = 1
  ): void {
    if (color) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = width;
    this.context2d.beginPath();
    this.context2d.moveTo(x1, y1);
    this.context2d.lineTo(x2, y2);
    this.context2d.closePath();
    this.context2d.stroke();
  }

  /**
   * 多角形を描画する
   */
  drawPolygon(points: number[], color?: string): void {
    if (!Array.isArray(points) || points.length < 6) return;
    if (color) this.context2d.fillStyle = color;
    this.context2d.beginPath();
    this.context2d.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      this.context2d.lineTo(points[i], points[i + 1]);
    }
    this.context2d.closePath();
    this.context2d.fill();
  }

  /**
   * 円を描画する
   */
  drawCircle(x: number, y: number, radius: number, color?: string): void {
    if (color) this.context2d.fillStyle = color;
    this.context2d.beginPath();
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    this.context2d.closePath();
    this.context2d.fill();
  }

  /**
   * 扇形を描画する
   */
  drawFan(
    x: number,
    y: number,
    radius: number,
    startRadian: number,
    endRadian: number,
    color?: string
  ): void {
    if (color) this.context2d.fillStyle = color;
    this.context2d.beginPath();
    this.context2d.moveTo(x, y);
    this.context2d.arc(x, y, radius, startRadian, endRadian);
    this.context2d.closePath();
    this.context2d.fill();
  }

  /**
   * 線分を二次ベジェ曲線で描画する
   */
  drawQuadraticBezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cx: number,
    cy: number,
    color?: string,
    width = 1
  ): void {
    if (color) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = width;
    this.context2d.beginPath();
    this.context2d.moveTo(x1, y1);
    this.context2d.quadraticCurveTo(cx, cy, x2, y2);
    this.context2d.closePath();
    this.context2d.stroke();
  }

  /**
   * 線分を三次ベジェ曲線で描画する
   */
  drawCubicBezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cx1: number,
    cy1: number,
    cx2: number,
    cy2: number,
    color?: string,
    width = 1
  ): void {
    if (color) this.context2d.strokeStyle = color;
    this.context2d.lineWidth = width;
    this.context2d.beginPath();
    this.context2d.moveTo(x1, y1);
    this.context2d.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
    this.context2d.closePath();
    this.context2d.stroke();
  }

  /**
   * テキストを描画する
   */
  drawText(
    text: string,
    x: number,
    y: number,
    color?: string,
    width?: number
  ): void {
    if (color) this.context2d.fillStyle = color;
    this.context2d.fillText(text, x, y, width);
  }

  /**
   * 画像をロードしてコールバック関数にロードした画像を与え呼び出す
   */
  static imageLoader(
    path: string,
    callback: (image: HTMLImageElement) => void
  ): void {
    const target = new Image();
    target.addEventListener('load', () => {
      if (callback) callback(target);
    });
    target.src = path;
  }
}
