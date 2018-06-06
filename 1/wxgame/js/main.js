import Phaser from 'libs/phaser-wx.js'
import Scene from 'scene/index.js'

const game = new Phaser.Game({
  // 渲染类型
  renderer: Phaser.CANVAS,
  canvas: canvas,
  // type: Phaser.CANVAS,
  // 界面宽度，单位像素
  width: 750,
  // 界面高度
  height: 1334,
  // 背景色
  backgroundColor: 0x444444,
});

game.state.add('game', new Scene(game));
game.state.start('game');