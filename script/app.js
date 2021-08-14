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

app.renderer.resize(window.innerWidth * 0.99, window.innerHeight * 0.99);
app.renderer.view.style.position = "absolute";

document.body.appendChild(app.view);
document.body.style.backgroundColor = stringColour(backgroundColour);

let spaceship = PIXI.Sprite.from("images/spaceship.png");
app.stage.addChild(spaceship);

spaceship.width = Math.min(window.innerHeight, window.innerWidth) * 0.08;
spaceship.height = Math.min(window.innerHeight, window.innerWidth) * 0.08;

spaceship.y = window.innerHeight / 2 - spaceship.height / 2;
spaceship.x = window.innerWidth * 0.02;
spaceship.velocity = {};
spaceship.velocity.y = 0;

const scoreText = new PIXI.Text(
    "Score: 0",
    new PIXI.TextStyle({
        fontFamily: ["Noto Sans JP", "sans-serif"],
        fontSize: Math.min(window.innerWidth, window.innerHeight) * 0.05,
        fill: stringColour(backgroundColour),
        fontWeight: 900,
        align: "center",
        stroke: stringColour(scoreBoardColour),
        strokeThickness: 10,
        trim: true,
    })
);
scoreText.anchor.x = 0.5;
scoreText.x = window.innerWidth / 2;
scoreText.y = window.innerHeight * 0.02;
app.stage.addChild(scoreText);

// document.cookie = "highscore=10";
// document.cookie = "highscore=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

function getCookieHighScore() {
    try {
        return document.cookie
            .split(";")
            .find((x) => x.startsWith("highscore="))
            .split("=")[1];
    } catch (error) {
        return 0;
    }
}
function setCookieHighScore(score) {
    document.cookie = "highscore="+score;
}


const instructions = new PIXI.Text(
    "Arrows up/down to move, spacebar to shoot",
    new PIXI.TextStyle({
        fontFamily: ["Noto Sans JP", "sans-serif"],
        fontSize: Math.min(window.innerWidth, window.innerHeight) * 0.02,
        fill: stringColour(spaceshipColour),
        fontWeight: 500,
        align: "center",
        trim: true,
    })
);
instructions.anchor.x = 0.5;
instructions.anchor.y = 1;
instructions.x = window.innerWidth / 2;
instructions.y = window.innerHeight * 0.98;
app.stage.addChild(instructions);

const shots = [];
const enemies = [];

let score = 0;

let gameOver = false;

let newGameButton = null;
let newGameButtonText = null;

endGame();

function endGame() {
    if (!gameOver) {
        gameOver = true;

        let highScore = parseInt(getCookieHighScore());
        if(score > highScore)
            setCookieHighScore(score);

        newGameButton = new PIXI.Graphics()
            .beginFill(scoreBoardColour)
            .drawRoundedRect(
                (window.innerWidth - window.innerWidth * 0.2) / 2,
                (window.innerHeight - window.innerHeight * 0.15) / 2,
                window.innerWidth * 0.2,
                window.innerHeight * 0.15,
                30
            )
            .endFill();
        newGameButton.interactive = true;
        newGameButton.click = () => {
            if (gameOver) {
                gameOver = false;
                console.log(getCookieHighScore());


                newGameButton.destroy();
                newGameButton = null;

                newGameButtonText.destroy();
                newGameButtonText = null;

                score = 0;

                while (shots.length > 0) {
                    const shot = shots.pop();
                    shot.destroy();
                }

                while (enemies.length > 0) {
                    const enemy = enemies.pop();
                    enemy.destroy();
                }
            }
        };

        newGameButtonText = new PIXI.Text(
            "New Game",
            new PIXI.TextStyle({
                fontFamily: ["Noto Sans JP", "sans-serif"],
                fontSize:
                    Math.min(window.innerWidth, window.innerHeight) * 0.06,
                fill: stringColour(backgroundColour),
                fontWeight: 700,
                align: "center",
                trim: true,
            })
        );
        newGameButtonText.anchor.x = 0.5;
        newGameButtonText.anchor.y = 0.5;
        newGameButtonText.x = window.innerWidth / 2;
        newGameButtonText.y = window.innerHeight / 2;

        app.stage.addChild(newGameButton);
        app.stage.addChild(newGameButtonText);
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") spaceship.velocity.y = -1;
    if (event.key === "ArrowDown") spaceship.velocity.y = 1;

    if (event.key === " " && !gameOver) {
        let shoot = PIXI.Sprite.from("images/fire-tail.png");
        app.stage.addChild(shoot);
        shoot.width = spaceship.width * 0.5;
        shoot.height = spaceship.height * 0.7;
        shoot.x = spaceship.x + spaceship.width;
        shoot.y = spaceship.y + spaceship.height * 0.5;
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

function stringColour(colour) {
    return "#" + ("000000" + colour.toString(16)).slice(-6);
}

app.ticker.add((delta) => {
    if (!gameOver) {
        /* Rendering score in canvas */
        scoreText.text = "Score: " + score + "\nHigh Score: " + getCookieHighScore();

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
                    enemies[enemy].life -= 1;
                    removeSpriteFromList(shots, shot);
                    if (enemies[enemy].life <= 0) {
                        score += enemies[enemy].score;
                        removeSpriteFromList(enemies, enemy);
                    }
                }
            }
        }

        /* Creating new enemies */
        if (Math.random() < 0.015) {
            let enemy = PIXI.Sprite.from("images/starfighter.png");
            enemy.width = spaceship.width;
            enemy.height = spaceship.height;
            enemy.x = window.innerWidth;
            enemy.y = Math.random() * (window.innerHeight - enemy.height);
            enemy.score = 2;
            enemy.speed = 1;
            enemy.life = 2;

            /* Variation of sizes in enemy */
            let enemySizeChance = Math.random();
            if (enemySizeChance < 0.1) {
                /* Large enemy */
                enemy.width *= 2;
                enemy.height *= 2;
                enemy.speed /= 2;
                enemy.life *= 3;
                enemy.score = 5;
            } else if (enemySizeChance < 0.3) {
                /* small enemy */
                enemy.width /= 1.5;
                enemy.height /= 1.5;
                enemy.speed *= 1.5;
                enemy.life /= 2;
                enemy.score = 1;
            }

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
            let factor = 0.004 + score * 0.00001;
            enemies[enemy].x -=
                window.innerWidth * factor * enemies[enemy].speed * delta;
            if (enemies[enemy].x <= 0 || collided(enemies[enemy], spaceship)) {
                endGame();
            }
        }
    }
});
