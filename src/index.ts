import Phaser from "phaser";
import StickmanTowerDefence from "./scene/StickmanTowerDefence.ts";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280, //window?.visualViewport?.width || 800,
  height: 720, //window?.visualViewport?.height || 600,
  scene: StickmanTowerDefence,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 400 },
    },
  },
};
const game = new Phaser.Game(config);
