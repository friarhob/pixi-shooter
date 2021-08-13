let spaceshipColour = 0x1b71f2;
let backgroundColour = 0x2f187a;
let scoreBoardColour = 0xc2131f;

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
spaceship.x = window.innerWidth*0.02;
spaceship.velocity = {};
spaceship.velocity.y = 0;

document.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowUp')
        spaceship.velocity.y = -1;
    if(event.key === 'ArrowDown')
        spaceship.velocity.y = 1;
});

document.addEventListener('keyup', (event) => {
    if(event.key === 'ArrowUp' && spaceship.velocity.y == -1)
        spaceship.velocity.y = 0;
    if(event.key === 'ArrowDown' && spaceship.velocity.y == 1)
        spaceship.velocity.y = 0;
});


app.ticker.add((delta) => {
    spaceship.y += spaceship.velocity.y*window.innerHeight*0.01;
});