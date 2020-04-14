/**
 * 効果音を再生するための簡易的なクラス
 */
export default class Sound {
  ctx: AudioContext;

  source: AudioBuffer;

  constructor() {
    this.ctx = new AudioContext();
    this.source = null;
  }

  // オーディオファイルをロードする
  load(audioPath: string, callback: (err?: string) => void): void {
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.ctx.decodeAudioData(buffer))
      .then((decodeAudio) => {
        this.source = decodeAudio;
        callback();
      })
      .catch(() => {
        callback('error!');
      });
  }

  //  AudioBuffer から AudioBufferSourceNode を生成し再生する
  play(): void {
    let node = new AudioBufferSourceNode(this.ctx, { buffer: this.source });
    node.connect(this.ctx.destination);
    node.addEventListener('ended', () => {
      node.stop();
      node.disconnect();
      node = null;
    });
    node.start();
  }
}
