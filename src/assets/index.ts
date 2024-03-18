export class asset {
  name: string;
  type: "image" | "spritesheet" | "audio";
  url: string;
  isCreatable?: boolean;
  width?: number;
  height?: number;
  options?: object;

  constructor(
    name: string,
    type: "image" | "spritesheet" | "audio",
    url: string,
    isCreatable?: boolean,
    width?: number,
    height?: number
  ) {
    this.name = name;
    this.type = type;
    this.url = url;
    this.isCreatable = isCreatable || true;
    this.width = width;
    this.height = height;
  }
}

const assets: asset[] = [
  {
    name: "donkey",
    type: "image",
    url: "images/639657.jpg",
    width: 400,
    height: 300,
  },
  {
    name: "blood",
    type: "image",
    url: "images/blood.png",
    isCreatable: false,
  },
  {
    name: "bg_img",
    type: "image",
    url: "images/bg_img.jpg",
  },
  {
    name: "ground",
    type: "image",
    url: "images/ground_inv.png",
    isCreatable: false,
  },
  {
    name: "button",
    type: "image",
    url: "images/ground.png",
    isCreatable: false,
  },
  {
    name: "wall",
    type: "image",
    url: "images/wall_inv.png",
    isCreatable: false,
  },
  {
    name: "sm_char",
    type: "spritesheet",
    url: "images/swordman_sprite_55_84.png",
    isCreatable: false,
    options: { frameWidth: 55, frameHeight: 84 },
  },
];

export default assets;
