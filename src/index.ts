import Boss from './characters/Boss';
import BackgroundStar from './characters/BackgroundStar';
import Enemy from './characters/Enemy';
import Explosion from './characters/Explosion';
import Homing from './characters/Homing';
import Shot from './characters/Shot';
import Viper from './characters/Viper';
import SceneManager from './scene/SceneManager';
import UtilClass from './utils/canvas2D';
import * as def from './utils/defs';
import 'reset-css';
import Sound from './sound/Sound';

const util = new UtilClass(document.body.querySelector('#main_canvas'));
const viper = new Viper(util.context, 0, 0, 64, 64, './image/viper.png');
const boss = new Boss(util.context, 0, 0, 128, 128, './image/boss.png');
const shotArray: Shot[] = [];
const singleShotArray: Shot[] = [];
const enemyArray: Array<Enemy | Boss> = [];
const scene = new SceneManager();
const enemyShotArray: Shot[] = [];
const homingArray = [];
const explosionArray: Explosion[] = [];
const backgroundStarArray = [];
let restart = false;
let sound: Sound = null;

window.isKeyDown = {};
window.gameScore = 0;

util.canvas.width = def.CANVAS_WIDTH;
util.canvas.height = def.CANVAS_HEIGHT;

const TEXT = 'Press the enter key to start the game';
util.context.font = 'bold 72px sans-serif';
const TEXT_WIDTH = util.context.measureText(TEXT).width;
util.drawText(
  TEXT,
  (def.CANVAS_WIDTH - TEXT_WIDTH) / 2,
  def.CANVAS_HEIGHT / 2,
  '#000'
);

/**
 * 数値の不足した桁数をゼロで埋めた文字列を返す
 */
const zeroPadding = (number: number, count: number): string => {
  const zeroArray = new Array(count);
  const zeroString = zeroArray.join('0') + number;
  return zeroString.slice(-count);
};

/**
 * 度数法の角度からラジアンを生成する
 */
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * canvas やコンテキストを初期化
 */
const initialize = (): void => {
  viper.setComing(
    def.CANVAS_WIDTH / 2,
    def.CANVAS_HEIGHT,
    def.CANVAS_WIDTH / 2,
    def.CANVAS_HEIGHT - 200
  );

  // 爆発エフェクトを初期化する
  for (let i = 0; i < def.EXPLOSION_MAX_COUNT; ++i) {
    explosionArray[i] = new Explosion(util.context, 100.0, 15, 40.0, 1.0);
    explosionArray[i].setSound(sound);
  }

  // 敵キャラクターのショットを初期化する
  for (let i = 0; i < def.ENEMY_SHOT_MAX_COUNT; ++i) {
    enemyShotArray[i] = new Shot(
      util.context,
      0,
      0,
      32,
      32,
      './image/enemy_shot.png'
    );
    enemyShotArray[i].setTargets([viper]); // 引数は配列なので注意
    enemyShotArray[i].setExplosions(explosionArray);
  }

  // ボスキャラクターのホーミングショットを初期化する
  for (let i = 0; i < def.HOMING_MAX_COUNT; ++i) {
    homingArray[i] = new Homing(
      util.context,
      0,
      0,
      32,
      32,
      './image/homing_shot.png'
    );
    homingArray[i].setTargets([viper]);
    homingArray[i].setExplosions(explosionArray);
  }

  // ボスキャラクターを初期設定する
  boss.setShotArray(enemyShotArray);
  boss.setHomingArray(homingArray);
  boss.setAttackTarget(viper);

  // 敵キャラクター（小）を初期化する
  for (let i = 0; i < def.ENEMY_SMALL_MAX_COUNT; ++i) {
    enemyArray[i] = new Enemy(
      util.context,
      0,
      0,
      48,
      48,
      './image/enemy_small.png'
    );
    enemyArray[i].setShotArray(enemyShotArray);
    enemyArray[i].setAttackTarget(viper);
  }

  // 敵キャラクター（大）を初期化する
  for (let i = 0; i < def.ENEMY_LARGE_MAX_COUNT; ++i) {
    enemyArray[def.ENEMY_SMALL_MAX_COUNT + i] = new Enemy(
      util.context,
      0,
      0,
      64,
      64,
      './image/enemy_large.png'
    );
    enemyArray[def.ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
    enemyArray[def.ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
  }
  enemyArray.push(boss);

  // 衝突判定を行うために対象を設定する
  // 爆発エフェクトを行うためにショットに設定する
  [...Array(def.SHOT_MAX_COUNT)].forEach(() => {
    const shot = new Shot(util.context, 0, 0, 32, 32, './image/viper_shot.png');
    shot.setTargets(enemyArray);
    shot.setExplosions(explosionArray);
    shotArray.push(shot);

    const singleShot1 = new Shot(
      util.context,
      0,
      0,
      32,
      32,
      './image/viper_single_shot.png'
    );
    const singleShot2 = new Shot(
      util.context,
      0,
      0,
      32,
      32,
      './image/viper_single_shot.png'
    );
    singleShot1.setTargets(enemyArray);
    singleShot2.setTargets(enemyArray);
    singleShot1.setExplosions(explosionArray);
    singleShot2.setExplosions(explosionArray);
    singleShotArray.push(singleShot1, singleShot2);
  });

  viper.setShotArray(shotArray, singleShotArray);

  // 流れる星を初期化する
  for (let i = 0; i < def.BACKGROUND_STAR_MAX_COUNT; ++i) {
    const size = 1 + Math.random() * (def.BACKGROUND_STAR_MAX_SIZE - 1);
    const speed = 1 + Math.random() * (def.BACKGROUND_STAR_MAX_SPEED - 1);
    backgroundStarArray[i] = new BackgroundStar(util.context, size, speed);

    const x = Math.random() * def.CANVAS_WIDTH;
    const y = Math.random() * def.CANVAS_HEIGHT;
    backgroundStarArray[i].set(x, y);
  }
};

/**
 * インスタンスの準備が完了しているか確認する
 */
const loadCheck = (): void => {
  let ready = true;
  ready = ready && viper.ready;

  enemyArray.forEach((v) => {
    ready = ready && v.ready;
  });

  enemyShotArray.forEach((v) => {
    ready = ready && v.ready;
  });

  shotArray.forEach((v) => {
    ready = ready && v.ready;
  });

  singleShotArray.forEach((v) => {
    ready = ready && v.ready;
  });

  homingArray.forEach((v) => {
    ready = ready && v.ready;
  });

  if (ready) {
    eventSetting();
    sceneSetting();
    render();
  } else {
    setTimeout(loadCheck, 100);
  }
};

/**
 * イベントを設定する
 */
const eventSetting = (): void => {
  window.addEventListener('keydown', (e) => {
    window.isKeyDown[`key_${e.key}`] = true;
    if (e.key === 'Enter' && viper.life <= 0) restart = true;
  });
  window.addEventListener('keyup', (e) => {
    window.isKeyDown[`key_${e.key}`] = false;
  });
};

/**
 * シーンを設定する
 */
const sceneSetting = (): void => {
  // イントロシーン
  scene.add('intro', (time: number) => {
    if (time > 2.0) scene.use('invade_default_type');
  });

  // invade シーン（default type の敵キャラクターを生成）
  scene.add('invade_default_type', () => {
    if (scene.frame % 30 === 0) {
      for (let i = 0; i < def.ENEMY_SMALL_MAX_COUNT; ++i) {
        if (enemyArray[i].life <= 0) {
          const e = enemyArray[i];
          if (scene.frame % 60 === 0) {
            // 左側面から出てくる
            e.set(-e.width, 30, 2, 'default');
            e.setVectorFromAngle(degreesToRadians(30));
          } else {
            // 右側面から出てくる
            e.set(def.CANVAS_WIDTH + e.width, 30, 2, 'default');
            e.setVectorFromAngle(degreesToRadians(150));
          }
          break;
        }
      }
    }
    if (scene.frame === 270) scene.use('blank');
    if (viper.life <= 0) scene.use('gameover');
  });

  // 間隔調整のための空白のシーン
  scene.add('blank', () => {
    if (scene.frame === 150) scene.use('invade_wave_move_type');
    if (viper.life <= 0) scene.use('gameover');
  });

  // invade シーン（wave move type の敵キャラクターを生成）
  scene.add('invade_wave_move_type', () => {
    if (scene.frame % 50 === 0) {
      for (let i = 0; i < def.ENEMY_SMALL_MAX_COUNT; ++i) {
        if (enemyArray[i].life <= 0) {
          const e = enemyArray[i];
          if (scene.frame <= 200) {
            // 左側を進む
            e.set(def.CANVAS_WIDTH * 0.2, -e.height, 2, 'wave');
          } else {
            // 右側を進む
            e.set(def.CANVAS_WIDTH * 0.8, -e.height, 2, 'wave');
          }
          break;
        }
      }
    }
    if (scene.frame === 450) scene.use('invade_large_type');
    if (viper.life <= 0) scene.use('gameover');
  });

  // invade シーン（large type の敵キャラクターを生成）
  scene.add('invade_large_type', () => {
    if (scene.frame === 100) {
      const i = def.ENEMY_SMALL_MAX_COUNT + def.ENEMY_LARGE_MAX_COUNT;
      for (let j = def.ENEMY_SMALL_MAX_COUNT; j < i; ++j) {
        if (enemyArray[j].life <= 0) {
          const e = enemyArray[j];
          e.set(def.CANVAS_WIDTH / 2, -e.height, 50, 'large');
          break;
        }
      }
    }
    if (scene.frame === 500) scene.use('invade_boss');
    if (viper.life <= 0) scene.use('gameover');
  });

  // invade シーン（ボスキャラクターを生成）
  scene.add('invade_boss', () => {
    if (scene.frame === 0) {
      boss.set(def.CANVAS_WIDTH / 2, -boss.height, 250);
      boss.setMode('invade');
    }
    if (viper.life <= 0) {
      scene.use('gameover');
      boss.setMode('escape');
    }
    if (boss.life <= 0) scene.use('intro');
  });

  // ゲームオーバーシーン
  scene.add('gameover', () => {
    const textWidth = def.CANVAS_WIDTH / 2;
    const loopWidth = def.CANVAS_WIDTH + textWidth;
    const x = def.CANVAS_WIDTH - ((scene.frame * 10) % loopWidth);
    util.context.font = 'bold 72px sans-serif';
    util.drawText('GAME OVER', x, def.CANVAS_HEIGHT / 2, '#ff0000', textWidth);
    if (restart) {
      restart = false;
      window.gameScore = 0;
      viper.setComing(
        def.CANVAS_WIDTH / 2,
        def.CANVAS_HEIGHT + 50,
        def.CANVAS_WIDTH / 2,
        def.CANVAS_HEIGHT - 100
      );
      scene.use('intro');
    }
  });
  scene.use('intro');
};

/**
 * 描画処理
 */
const render = (): void => {
  util.context.globalAlpha = 1.0;
  util.drawRect(0, 0, util.canvas.width, util.canvas.height, '#111122');

  util.context.font = 'bold 24px monospace';
  util.drawText(zeroPadding(window.gameScore, 5), 30, 50, '#fff');

  scene.update();

  // 流れる星の状態を更新する
  backgroundStarArray.forEach((star) => {
    star.update();
  });

  viper.update();

  enemyArray.forEach((enemy) => {
    enemy.update();
  });

  enemyShotArray.forEach((shot) => {
    shot.update();
  });

  shotArray.forEach((shot) => {
    shot.update();
  });

  singleShotArray.forEach((shot) => {
    shot.update();
  });

  homingArray.forEach((homing) => {
    homing.update();
  });

  explosionArray.forEach((explosion) => {
    explosion.update();
  });

  requestAnimationFrame(render);
};

window.addEventListener('load', () => {
  window.addEventListener('keydown', (e) => {
    if (
      e.key === 'Enter' &&
      typeof window.isKeyDown.key_Enter === 'undefined'
    ) {
      window.isKeyDown.key_Enter = false;
      sound = new Sound();
      sound.load('./sound/explosion.mp3', (error) => {
        if (error) {
          alert('ファイルの読み込みエラーです');
          return;
        }
        initialize();
        loadCheck();
      });
    }
  });
});
