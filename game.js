kaboom({
  global: true,
  fullscreen: true,
  clearColor: [1, 0, 0, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("coin", "coin.png");
loadSprite("e_m", "evil_mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("cloud", "cloud.png");
loadSprite("mushroom", "mushroom.png");

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
scene("over", () => {
  add([
    text("GO HOME KID!\n dont' try agin\n press r to restart", 35),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("r", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  play("gameSound");

  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    "=": [sprite("block"), solid()],
    c: [sprite("cloud"), scale(2)],
    "@": [sprite("pipe"), solid()],
    "?": [sprite("surprise"), solid(), "surprise-coin"],
    "!": [sprite("surprise"), solid(), "surprise-mushroom"],
    "^": [sprite("evil_mushroom"), solid(), body(), "goomba"],
    x: [sprite("unboxed"), solid()],
    m: [sprite("mushroom"), body(), "mushroom"],
  };

  const map = [
    "                          c                         ",
    "       c                                     c      ",
    "                                     c              ",
    "                       $                            ",
    "                $              ==                   ",
    "                                                    ",
    "               ===                $                 ",
    "                                                    ",
    "                                ===                 ",
    "          =!=                                       ",
    "                                     ?              ",
    "                                                    ",
    "              ^                                     ",
    "========================  ==========================",
    "========================  ==========================",
    "========================  ==========================",
  ];
  const gameLevel = addLevel(map, key);
  let isjumping = false;
  const jupmForce = 700;
  const player = add([
    sprite("mario"),
    solid(),
    pos(48, 0),
    body(),
    origin("bot"),
    scale(1),
    big(jupmForce),
  ]);
  const speed = 120;
  const jump = -3360;
  keyDown("d", () => {
    player.move(speed, 0);
  });

  keyDown("a", () => {
    player.move(-speed, 0);
  });

  keyPress("w", () => {
    if (player.grounded()) {
      player.jump(jupmForce);
      play("jumpSound");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("surprise-mushroom")) {
      console.log("We are here");
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  action("mushroom", (mush) => {
    mush.move(-20, 0);
  });

  action("goomba", (gege) => {
    gege.move(-20, 0);
  });

  player.collides("coin", (x) => {
    destroy(x);
  });
  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(20);
  });

  player.collides("goomba", (x) => {
    if (isjumping) {
      destroy(x);
    } else {
      destroy(player);
      go("over");
    }
  });

  player.collides("z", (z) => {
    destroy(player);
    go("over");
  });

  player.action(() => {
    camPos(player.pos.x, 150);
    if (player.grounded()) {
      isjumping = false;
    } else {
      isjumping = true;
    }
    if (player.pos.y >= height() + 200) {
      go("over");
    }
  });
});

start("game");
