let spaceshipColour = 0x1b71f2;
let backgroundColour = 0x001028;
let scoreBoardColour = 0xc2131f;
let bulletColour = 0xc90411;
let enemyColour = 0x2ef262;

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
let enemies = [];

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

let nTicks = 0;

app.ticker.add((delta) => {
    nTicks += 1;
    
    /* Moving spaceship */
    spaceship.y += spaceship.velocity.y * window.innerHeight * 0.01;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.y > window.innerHeight - spaceship.height)
        spaceship.y = window.innerHeight - spaceship.height;

    /* Updating shoots */
    for (const shoot in shoots) {
        shoots[shoot].x += window.innerWidth * 0.015;
        shoots[shoot].rotation += 0.15;
        if (shoots[shoot].x > window.innerWidth) {
            shoots[shoot].destroy();
            shoots.splice(shoot, 1);
        }
    }

    /* Creating new enemies */
    if(nTicks % 80 == 0)
    {
        let enemy = PIXI.Sprite.from("../images/starfighter.png");
        app.stage.addChild(enemy);
        enemies.push(enemy);
        enemy.width = spaceship.width;
        enemy.height = spaceship.height;
        enemy.x = window.innerWidth;
        enemy.y = Math.random()*window.innerHeight;
    }

    /* Moving enemies */
    for(const enemy in enemies) {
        enemies[enemy].x -= window.innerWidth*0.005;
        if(enemies[enemy].x <= 0) {
            /* TODO: make game over */
            enemies[enemy].destroy();
            enemies.splice(enemy, 1);
        }
    }
});
