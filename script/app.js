let spaceshipColour = 0x1b71f2;
let backgroundColour = 0x001028;
let scoreBoardColour = 0xc2131f;
let bulletColour = 0xc90411;

let app = new PIXI.Application({
    width: 100,
    height: 100,
    transparent: false,
    antialias: true,
});

app.renderer.backgroundColor = backgroundColour;

app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";

document.body.appendChild(app.view);

let spaceship = PIXI.Sprite.from("../images/spaceship.png");
app.stage.addChild(spaceship);

spaceship.width = Math.min(window.innerHeight, window.innerWidth) * 0.08;
spaceship.height = Math.min(window.innerHeight, window.innerWidth) * 0.08;

spaceship.y = window.innerHeight / 2 - spaceship.height / 2;
spaceship.x = window.innerWidth * 0.02;
spaceship.velocity = {};
spaceship.velocity.y = 0;

let shoots = [];

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") spaceship.velocity.y = -1;
    if (event.key === "ArrowDown") spaceship.velocity.y = 1;

    if (event.key === " ") {
        let shoot = PIXI.Sprite.from("../images/fire-tail.png");
        app.stage.addChild(shoot);
        shoot.width = spaceship.width * 0.5;
        shoot.height = spaceship.height * 0.7;
        shoot.x = spaceship.x + spaceship.height;
        shoot.y = spaceship.y;
        shoot.anchor.set(0.5);
        shoots.push(shoot);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp" && spaceship.velocity.y == -1)
        spaceship.velocity.y = 0;
    if (event.key === "ArrowDown" && spaceship.velocity.y == 1)
        spaceship.velocity.y = 0;
});

app.ticker.add((delta) => {
    spaceship.y += spaceship.velocity.y * window.innerHeight * 0.01;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.y > window.innerHeight - spaceship.height)
        spaceship.y = window.innerHeight - spaceship.height;

    for (const shoot in shoots) {
        shoots[shoot].x += window.innerWidth * 0.015;
        shoots[shoot].rotation += 0.15;
        if (shoots[shoot].x > window.innerWidth) {
            shoots[shoot].destroy();
            shoots.splice(shoot, 1);
        }
    }
});
