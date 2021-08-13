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

let shots = [];
let enemies = [];

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") spaceship.velocity.y = -1;
    if (event.key === "ArrowDown") spaceship.velocity.y = 1;

    if (event.key === " ") {
        let shoot = PIXI.Sprite.from("../images/fire-tail.png");
        app.stage.addChild(shoot);
        shoot.width = spaceship.width * 0.5;
        shoot.height = spaceship.height * 0.7;
        shoot.x = spaceship.x + spaceship.width; 
        shoot.y = spaceship.y + spaceship.height*0.5;
        shoot.anchor.set(0.5, 0.4);
        shots.push(shoot);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp" && spaceship.velocity.y == -1)
        spaceship.velocity.y = 0;
    if (event.key === "ArrowDown" && spaceship.velocity.y == 1)
        spaceship.velocity.y = 0;
});

function collided(sprite1, sprite2) {
    try {
        return (
            sprite1.x + sprite1.width > sprite2.x &&
            sprite1.x < sprite2.x + sprite2.width &&
            sprite1.y + sprite1.height > sprite2.y &&
            sprite1.y < sprite2.y + sprite2.height
        );
    } catch (error) {
        if (error instanceof TypeError) return false;
        throw error;
    }
}

function removeSpriteFromList(list, index) {
    list[index].destroy();
    list.splice(index, 1);
}

app.ticker.add((delta) => {
    /* Moving spaceship */
    spaceship.y += spaceship.velocity.y * window.innerHeight * 0.01 * delta;
    if (spaceship.y < 0) spaceship.y = 0;
    if (spaceship.y > window.innerHeight - spaceship.height)
        spaceship.y = window.innerHeight - spaceship.height;

    /* Moving shots */
    for (const shot in shots) {
        shots[shot].x += window.innerWidth * 0.015 * delta;
        shots[shot].rotation += 0.15;
        if (shots[shot].x > window.innerWidth) {
            removeSpriteFromList(shots, shot);
        }

        /* Checking collision - shot hitting enemy */
        for (const enemy in enemies) {
            if (collided(shots[shot], enemies[enemy])) {
                removeSpriteFromList(shots, shot);
                removeSpriteFromList(enemies, enemy);
            }
        }
    }

    /* Creating new enemies */
    if (Math.random() < 0.015) {
        let enemy = PIXI.Sprite.from("../images/starfighter.png");
        enemy.width = spaceship.width;
        enemy.height = spaceship.height;
        enemy.x = window.innerWidth;
        enemy.y = Math.random() * (window.innerHeight - enemy.height);

        /* Checking collision with other enemies */
        let valid = true;
        for (const otherEnemy in enemies) {
            if (collided(enemy, enemies[otherEnemy])) {
                console.log(
                    "collided on creation: ",
                    enemy,
                    enemies[otherEnemy]
                );
                valid = false;
                break;
            }
        }

        if (valid) {
            app.stage.addChild(enemy);
            enemies.push(enemy);
        } else {
            enemy.destroy();
        }
    }

    /* Moving enemies */
    for (const enemy in enemies) {
        enemies[enemy].x -= window.innerWidth * 0.005 * delta;
        if (enemies[enemy].x <= 0 || collided(enemies[enemy], spaceship)) {
            /* TODO: make game over */
            enemies[enemy].destroy();
            enemies.splice(enemy, 1);
        }
    }
});
