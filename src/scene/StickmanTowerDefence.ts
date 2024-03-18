import Phaser from "phaser";
import assets, { asset } from "../assets/index.ts";

class Actor {
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  type: "healer" | "archer" | "mage" | "swordsman" | "king";
  actionTimeOut: number = 0;
  animationTimeOut: number = 0;
  health: number = 100;

  constructor(
    character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    type: "healer" | "archer" | "mage" | "swordsman" | "king"
  ) {
    this.character = character;
    this.type = type;
  }
}

class Cast {
  actors: Actor[] = [];
  limit: number = 0;

  constructor(limit: number) {
    this.limit = limit;
  }
}
class AssetManager {
  assets: asset[] = [];

  constructor(assets: asset[]) {
    this.assets = assets;
  }

  add(asset: asset) {
    this.assets.push(asset);
  }

  remove(asset: asset) {
    this.assets = this.assets.filter((a) => a.name !== asset.name);
  }

  clear() {
    this.assets = [];
  }

  getAssets() {
    return this.assets;
  }
}

const assetManager = new AssetManager(assets);
let platforms: Phaser.Physics.Arcade.StaticGroup;
let castleWalls: Phaser.Physics.Arcade.StaticGroup;
let cast: Cast;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
let enemyHealth: number = 100;
let enemyHealthText: Phaser.GameObjects.Text;
let gold: number = 0;
let goldText: Phaser.GameObjects.Text;
let bloodEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

class StickmanTowerDefence extends Phaser.Scene {
  preload() {
    assetManager
      .getAssets()
      .filter((asset) => asset.type === "image")
      .forEach((asset) => {
        this.load[asset.type]?.(asset.name, asset.url);
      });

    assetManager
      .getAssets()
      .filter((asset) => asset.type === "spritesheet")
      .forEach((asset) => {
        this.load[asset.type]?.(asset.name, asset.url, asset.options);
      });
  }

  create() {
    assetManager
      .getAssets()
      .filter((asset) => asset.type === "image" && asset.isCreatable !== false)
      .forEach((asset) => {
        this.add[asset.type as unknown as "image"]?.(
          asset.width || 640,
          asset?.height || 360,
          asset.name
        );
      });

    platforms = this.physics.add.staticGroup();

    platforms.create(500, 550, "ground").setScale(2).refreshBody();
    platforms.create(180, 0, "wall").setScale(2).refreshBody();

    castleWalls = this.physics.add.staticGroup();

    castleWalls.create(1100, 0, "wall").setScale(2).refreshBody();
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("sm_char", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "sm_char", frame: 11 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "atk",
      frames: this.anims.generateFrameNumbers("sm_char", { start: 6, end: 10 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("sm_char", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    //blood emitter for sm
    bloodEmitter = this.add.particles(0, 0, "blood", {
      lifespan: 4000,
      quantity: 20,
      speed: { min: 200, max: 300 },
      scale: { start: 0.01, end: 0 },
      gravityY: 500,
      blendMode: Phaser.BlendModes.NORMAL,
      emitting: false,
    });

    //  Input Events
    cursors = this.input.keyboard?.createCursorKeys();

    // cast
    cast = new Cast(1);

    //health
    enemyHealthText = this.add.text(900, 16, "Health: " + enemyHealth, {
      fontSize: "32px",
      color: "#0000ff",
      backgroundColor: "black",
    });

    //gold text
    goldText = this.add.text(16, 16, "Gold: " + gold, {
      fontSize: "32px",
      color: "gold",
      backgroundColor: "black",
    });

    // button for increasing cast limit
    // this.add
    //   .image(100, 540, "button")
    //   .setScale(0.1, 1);

    this.add
      .text(100, 540, "Spawn Soldier", {
        fontSize: "24px",
        color: "white",
        backgroundColor: "black",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        if (gold >= 100) {
          cast.limit++;
          gold -= 100;
          goldText.setText("Gold: " + gold);
        }
      })
      .setDepth(10);
  }

  update(time: number, delta: number): void {
    if (enemyHealth <= 0) {
      this.add.text(640, 360, "GAME OVER", {
        fontSize: "64px",
        shadow: {
          color: "red",
          stroke: true,
          offsetX: 5,
          offsetY: 5,
        },
        color: "#ff00ff",
      });
      return;
    }

    if (cast.limit > cast.actors.length) {
      cast.actors.push({
        character: this.physics.add.sprite(300, 400, "sm_char").setScale(1.3),
        type: "swordsman",
        actionTimeOut: 0,
        animationTimeOut: 0,
        health: 100,
      });
    }

    cast.actors.forEach((actor) => {
      actor.character.setCollideWorldBounds(true);
      actor.character.setBounce(0.2);

      this.physics.add.collider(actor.character, platforms);

      this.physics.add.collider(actor.character, castleWalls);

      if (actor.health <= 0) {
        cast.actors = cast.actors.filter((a) => a !== actor);
        actor.character.destroy();
        cast.limit--;
        return;
      }

      if (actor.character.body.velocity.x < 160) {
        actor.character.setAccelerationX(160);
      } else {
        actor.character.setAccelerationX(0);
      }

      if (actor.actionTimeOut === 0 && actor.character.body.touching.right) {
        actor.character.anims.play("atk", true);
        actor.actionTimeOut = 50;
        actor.animationTimeOut = 20;
        enemyHealth -= 1;
        actor.character.setVelocityX(-160);
        actor.character.setVelocityY(-200);
        actor.health -= 30;
        bloodEmitter.emitParticleAt(actor.character.x, actor.character.y);
        gold += 50;
      } else {
        //actor.character.setVelocityX(0);
        if (actor.animationTimeOut === 0) {
          if (actor.character.body.velocity.x > 0) {
            actor.character.anims.play("right", true);
          } else actor.character.anims.play("turn");
        }
      }
      enemyHealthText.setText("Health: " + enemyHealth);
      goldText.setText("Gold: " + gold);
      if (actor.actionTimeOut > 0) {
        actor.actionTimeOut--;
      }
      if (actor.animationTimeOut > 0) {
        actor.animationTimeOut--;
      }

      if (cursors?.up.isDown && actor.character.body.touching.down) {
        actor.character.setVelocityY(-330);
      }
    });
  }
}

export default StickmanTowerDefence;
