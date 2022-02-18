'use strict';

const app = {
    canvas: null,
    context: null,
    // Setarile navei:
    shipWidth: 50,
    shipHeight: 75,
    shipX: null,
    shipY: null,
    speedShip: 7,
    angle: null,
    // Setarile asteroizilor:
    asteroidRadius: 8,
    asteroidCount: 5,
    dxDefault: 0.25,
    dyDefault: -0.25,
    dx: [],
    dy: [],
    x: [],
    y: [],
    size: [],
    status: [],
    exists: [],
    // Setarile rachetelor:
    rocketWidth: 50,
    rocketWidth1: 50,
    rocketWidth2: 50,
    rocketHeight: 50,
    rocketX: null,
    rocketX1: null,
    rocketX2: null,
    rocketY: null,
    rocketRadius: 5,
    rocketNumber: 3,
    // Tastatura:
    rightKeyPressed: false,
    leftKeyPressed: false,
    upKeyPressed: false,
    downKeyPressed: false,
    zKeyPressed: false,
    cKeyPressed: false,
    xKeyPressed: false,
    pressCount: 0,
    // Datele jocului:
    score: 0,
    lives: 3,
    numberOfHighScores: 5,
    HIGH_SCORES: 'highScores'
}

app.load = function () {
    app.canvas = document.getElementById('gameCanvas');
    app.context = app.canvas.getContext('2d');

    app.resize();

    // Coordonatele navei
    app.shipX = 75;
    app.shipY = 50;

    // Coordonatele asteroizilor 
    for (let i = 0; i < app.asteroidCount; i++) {
        app.x[i] = (app.canvas.width / 200) * (i + 50);
        app.y[i] = app.canvas.height - 100 * i;
        app.dx[i] = app.dxDefault;
        app.dy[i] = app.dyDefault;
        // Generam aleator marimea fiecarui asteroid, cu un numar de la 1 la 4
        app.size[i] = Math.floor((Math.random() * 4) + 1);
        app.status[i] = 1;
        app.exists[i] = 1;
    }

    // Atasarea evenimentelor
    document.addEventListener('keydown', app.keyDownHandler, false);
    document.addEventListener('keyup', app.keyUpHandler, false);

    app.draw();

}

app.resize = function () {
    const width = app.canvas.clientWidth;
    const height = app.canvas.clientHeight;
    if (app.canvas.width != width ||
        app.canvas.height != height) {
        app.canvas.width = width;
        app.canvas.height = height;
    }
}

app.keyDownHandler = function (e) {
    if (e.keyCode == 39) {
        app.rightKeyPressed = true;
    }
    else if (e.keyCode == 37) {
        app.leftKeyPressed = true;
    }
    else if (e.keyCode == 38) {
        app.upKeyPressed = true;
    }
    else if (e.keyCode == 40) {
        app.downKeyPressed = true;
    }
    else if (e.keyCode == 90) {
        app.zKeyPressed = true;
    }
    else if (e.keyCode == 67) {
        app.cKeyPressed = true;
    }
    else if (e.keyCode == 88) {
        app.xKeyPressed = true;
        app.pressCount++;
    }
}

app.keyUpHandler = function (e) {
    if (e.keyCode == 39) {
        app.rightKeyPressed = false;
    }
    else if (e.keyCode == 37) {
        app.leftKeyPressed = false;
    }
    else if (e.keyCode == 38) {
        app.upKeyPressed = false;
    }
    else if (e.keyCode == 40) {
        app.downKeyPressed = false;
    }
    else if (e.keyCode == 90) {
        app.zKeyPressed = false;
    }
    else if (e.keyCode == 67) {
        app.cKeyPressed = false;
    }
}

// Functii pentru desenarea elementelor jocului

// Functie pentru desenarea asteroizilor
app.drawAsteroids = function () {
    for (let i = 0; i < app.asteroidCount; i++) {
        // Daca asteroidul a fost distrus, acesta nu mai exista, atributul exists primind valoarea 0
        if (app.size[i] === 0) {
            app.exists[i] = 0;
        }
        if (app.status[i] == 1 && app.size[i] > 0) {

            app.context.beginPath();
            app.context.arc(app.x[i], app.y[i], app.asteroidRadius * app.size[i], 0, Math.PI * 2);
            app.exists[i] = 1;
            // Coloram fundalul asteroidului cu o culoare in functie de marimea acestuia
            switch (app.size[i]) {
                case 1:
                    app.context.fillStyle = '#FFFFFF';
                    break;
                case 2:
                    app.context.fillStyle = "yellow";
                    break;
                case 3:
                    app.context.fillStyle = "orange";
                    break;
                case 4:
                    app.context.fillStyle = '#FF0000';
                    break;
            }
            app.context.fill();
            app.context.closePath();

            // Setam atributele pentru numarul de rachete necesar distrugerii asteroidului
            app.context.fillStyle = "#000000";
            app.context.font = '13px Arial';
            app.context.textAlign = "center";
            app.context.fillText(app.size[i], app.x[i], app.y[i]);

            // Realizam miscarea asteroizilor
            app.moveAsteroids();
            app.x[i] += app.dx[i];
            app.y[i] += app.dy[i];
        }

        // Daca asteroidul respectiv a fost atins de o racheta are statusul 0 
        else if (app.status[i] == 0) {
            app.context.beginPath();
            app.context.arc(app.x[i], app.y[i], app.asteroidRadius * (app.size[i] - 1), 0, Math.PI * 2);

            // Coloram fundalul asteroidului cu o culoare, care corespunde marimii cu o unitate mai mica, in urma coliziunii
            switch (app.size[i] - 1) {
                case 1:
                    app.context.fillStyle = '#FFFFFF';
                    break;
                case 2:
                    app.context.fillStyle = "yellow";
                    break;
                case 3:
                    app.context.fillStyle = "orange";
                    break;
                case 4:
                    app.context.fillStyle = '#FF0000';
                    break;
            }
            app.context.fill();

            // Setam atributele pentru nr de rachete necesar distrugerii asteroidului, cu o marime mai mica cu o unitate
            app.context.fillStyle = "#000000";
            app.context.font = '13px Arial';
            app.context.textAlign = "center";
            app.context.fillText(app.size[i] - 1, app.x[i], app.y[i]);

            app.moveAsteroids();
            app.x[i] += app.dx[i];
            app.y[i] += app.dy[i];

            app.status[i] = 1;
        }
    }
}

// Functie pentru miscarea asteroizilor
app.moveAsteroids = function () {
    app.context.save();
    for (let i = 0; i < app.asteroidCount; i++) {
        app.context.translate(app.x[i], app.y[i]);
        if (app.y[i] < app.canvas.height && app.x[i] < app.canvas.width && app.y[i] > 0 && app.x[i] > 0) {
            app.x[i] += app.dx[i];
            app.y[i] += app.dy[i];
        }
        // Daca asteroizii depasesc dimensiunile canvas-ului, vor aparea din nou in partea de jos a canvas-ului
        else {
            app.x[i] = (app.canvas.width / 200) * (i + 50);
            app.y[i] = app.canvas.height;
            app.x[i] += app.dx[i];
            app.y[i] += app.dy[i];
        }
    }
    app.context.restore();
}

// Functie pentru desenarea navei
app.drawShip = function () {

    app.context.save();
    app.context.translate(app.shipX, app.shipY)
    app.context.beginPath();
    app.context.rotate(app.angle);
    app.context.moveTo(app.shipWidth - 25, app.shipHeight - 50);
    app.context.lineTo(app.shipWidth - 25, app.shipHeight);
    app.context.lineTo(app.shipWidth, app.shipHeight - 25);
    app.context.closePath();
    app.context.stroke();
    app.context.restore();

    // Conturul navei
    app.context.lineWidth = 5;
    app.context.strokeStyle = '#000000';
    app.context.stroke();

    // Culoarea navei
    app.context.fillStyle = "#FFDD00";
    app.context.fill();

}

// Functie pentru desenarea primei rachete
app.drawRocket = function () {

    app.xKeyPressed = true;
    app.context.beginPath();
    app.context.save();
    app.rocketX = app.shipX;
    app.rocketY = app.shipY;
    app.context.translate(app.rocketX, app.rocketY);
    app.context.rotate(app.angle);
    app.context.arc(app.rocketWidth, app.rocketHeight, app.rocketRadius, 0, Math.PI * 2);

    // Culoarea rachetei
    app.context.fillStyle = '#FF0000';
    app.context.fill();

    // Miscarea rachetei
    app.moveRocket();
    app.context.restore();
    app.context.closePath();
}

// Functie pentru desenarea celei de a doua rachete
app.drawRocket2 = function () {
    app.xKeyPressed = true;
    app.context.beginPath();
    app.context.save();
    app.rocketX1 = app.shipX;
    app.rocketY = app.shipY;
    app.context.translate(app.rocketX1, app.rocketY);
    app.context.rotate(app.angle);
    app.context.arc(app.rocketWidth1, app.rocketHeight, app.rocketRadius, 0, Math.PI * 2);

    // Culoarea rachetei
    app.context.fillStyle = '#FF0000';
    app.context.fill();

    // Miscarea rachetei
    app.moveRocket2();
    app.context.restore();
    app.context.closePath();
}

// Functie pentru desenarea celei de a treia rachete
app.drawRocket3 = function () {
    app.xKeyPressed = true;
    app.rocketX2 = app.shipX;
    app.rocketY = app.shipY;
    app.context.beginPath();
    app.context.save();
    app.context.translate(app.rocketX2, app.rocketY);
    app.context.rotate(app.angle);
    app.context.arc(app.rocketWidth2, app.rocketHeight, app.rocketRadius, 0, Math.PI * 2);

    // Culoarea rachetei
    app.context.fillStyle = '#FF0000';
    app.context.fill();

    // Miscarea rachetei
    app.moveRocket3();
    app.context.restore();
    app.context.closePath();
}

// Functie pentru miscarea primei rachete
app.moveRocket = function () {
    app.rocketWidth += 1;
    if (app.rocketWidth >= app.canvas.width || app.rocketWidth <= 0) {
        app.pressCount--;
        app.rocketWidth = 50;

    }
}

// Functie pentru desenarea celei de a doua rachete
app.moveRocket2 = function () {
    app.rocketWidth1 += 4;
    if (app.rocketWidth1 >= app.canvas.width || app.rocketWidth1 <= 0) {
        app.pressCount--;
        app.rocketWidth1 = 50;
    }
}

// Functie pentru desenarea celei de a treia rachete
app.moveRocket3 = function () {
    app.rocketWidth2 += 7;
    if (app.rocketWidth2 >= app.canvas.width || app.rocketWidth2 <= 0) {
        app.pressCount--;
        app.rocketWidth2 = 50;
    }
}

// Functie pentru detectarea coliziunii intre o racheta si un asteroid
app.rocketCollisionDetection = function () {
    var distx = 0;
    var disty = 0;
    var rad = 0;
    var dist1x = 0;
    var dist1y = 0;
    var rad1 = 0;
    var dist2x = 0;
    var dist2y = 0;
    var rad2 = 0;
    var points = 0;
    for (let i = 0; i < app.asteroidCount; i++) {
        distx = (app.rocketWidth + app.rocketRadius) - (app.x[i] + app.asteroidRadius * app.size[i]);
        disty = (app.rocketY + app.rocketRadius) - (app.y[i] + app.asteroidRadius * app.size[i]);
        rad = Math.sqrt(distx * distx + disty * disty);
        if (rad <= app.rocketRadius + app.asteroidRadius * app.size[i]) {
            app.size[i] = app.size[i] - 1;
            app.drawAsteroids();
            app.rocketWidth = 50;
            app.rocketHeight = 50;
            points++;
            app.score += Math.round(points);
            app.drawScore();
        }

        dist1x = (app.rocketWidth1 + app.rocketRadius) - (app.x[i] + app.asteroidRadius * app.size[i]);
        dist1y = (app.rocketY + app.rocketRadius) - (app.y[i] + app.asteroidRadius * app.size[i]);
        rad1 = Math.sqrt(dist1x * dist1x + dist1y * dist1y);

        if (rad1 <= app.rocketRadius + app.asteroidRadius * app.size[i]) {
            app.size[i] = app.size[i] - 1;
            app.drawAsteroids();
            app.rocketWidth1 = 50;
            app.rocketHeight = 50;
            points++;
            app.score += Math.round(points);
            app.drawScore();
        }

        dist2x = (app.rocketWidth2 + app.rocketRadius) - (app.x[i] + app.asteroidRadius * i);
        dist2y = (app.rocketY + app.rocketRadius) - (app.y[i] + app.asteroidRadius * i);

        rad2 = Math.sqrt(dist2x * dist2x + dist2y * dist2y);

        if (rad2 <= app.rocketRadius + app.asteroidRadius * app.size[i]) {
            app.size[i] = app.size[i] - 1;
            app.drawAsteroids();
            app.rocketWidth2 = 50;
            app.rocketHeight = 50;
            points++;
            app.score += Math.round(points);
            app.drawScore();

        }
    }
    if (app.score % 3 == 0 && app.score > 0) {
        app.lives += points;
    }
}


// Functie pentru desenarea scorului
app.drawScore = function () {
    app.context.font = '16px Arial';
    app.context.fillStyle = 'red';
    app.context.fillText('Score: ' + app.score, 50, 20);
}

// Functie pentru desenarea vietilor
app.drawLives = function () {
    app.context.font = '16px Arial';
    app.context.fillStyle = 'red';
    app.context.fillText('Lives: ' + app.lives, app.canvas.width - 65, 20);
}

// Functie pentru calcularea distantei dintre doua puncte
app.distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Functie pentru determinarea coliziunii dintre un asteroid si nava
app.shipAsteroidCollision = function () {

    for (let i = 0; i < app.asteroidCount; i++) {
        if (app.distance(app.shipX + 30, app.shipY + 30, app.x[i], app.y[i]) < app.asteroidRadius * app.size[i] ||
            app.distance(app.shipX - 25, app.shipY, app.x[i], app.y[i]) < app.asteroidRadius * app.size[i] ||
            app.distance(app.shipX, app.shipY - 25, app.x[i], app.y[i]) < app.asteroidRadius * app.size[i]) {

            if (app.lives >= 2) {
                app.shipX = 0;
                app.shipY = 0;
                app.angle = null;
            }
            app.lives--;
            app.drawLives();
        }
    }
}

// Functie pentru a verifica daca scorul obtinut este un highscore sau nu
app.checkHS = function (score) {
    const gameHighScores = JSON.parse(localStorage.getItem(app.HIGH_SCORES)) ?? [];
    const lowestHighScore = gameHighScores[app.numberOfHighScores - 1]?.score ?? 0;
    if (score > lowestHighScore) {
        app.saveHS(score, gameHighScores);
        app.showHS();
    }
}

// Functie pentru salvarea unui highscore
app.saveHS = function (score, gameHighScores) {
    const name = prompt('Highscore! Enter your name:');
    const currentScore = { score, name };

    gameHighScores.push(currentScore);
    gameHighScores.sort((a, b) => b.score - a.score);
    gameHighScores.splice(app.numberOfHighScores);
    localStorage.setItem(app.HIGH_SCORES, JSON.stringify(gameHighScores));

};

// Functie pentru afisarea unui highscore
app.showHS = function () {
    const gameHighScores = JSON.parse(localStorage.getItem(app.HIGH_SCORES)) ?? [];
    const listOfHighScores = document.getElementById(app.HIGH_SCORES);

    listOfHighScores.innerHTML = gameHighScores.map((score) => `<li>${score.score}-${score.name}`).join('');
}


// Functie pentru desenarea tuturor elementelor din joc
app.draw = function () {

    app.resize();
    app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);
    app.drawShip();
    app.drawLives();
    app.drawScore();

    app.showHS();
    app.drawAsteroids();
    app.shipAsteroidCollision();

    if (app.lives === 0) {
        alert('GAME OVER');
        document.location.reload();
        app.checkHS(app.score);
    }

    var noAsteroids = 0;
    for (let i = 0; i < app.asteroidCount; i++) {
        if (app.exists[i] == 1) {
            noAsteroids = 1;
        }
    }
    // Daca niciunul dintre cei 5 asteroizi nu mai exista, se vor recrea, generand aleatoriu valori pentru marimea fiecaruia
    if (noAsteroids == 0) {
        for (let i = 0; i < app.asteroidCount; i++) {
            app.x[i] = (app.canvas.width / 200) * (i + 50);
            app.y[i] = app.canvas.height - 100 * i;
            app.size[i] = Math.floor((Math.random() * 4) + 1);
            app.drawAsteroids();
        }
    }

    // Nava se deplaseaza in partea dreapta daca este apasata sageata dreapta
    if (app.rightKeyPressed && app.shipX < app.canvas.width - app.shipWidth) {
        app.shipX += app.speedShip;
    }

    // Nava se deplaseaza in partea stanga daca este apasata sageata stanga
    else if (app.leftKeyPressed && app.shipX > 0 && app.shipY) {
        app.shipX -= app.speedShip;
    }
    // Nava se deplaseaza in sus daca este apasata sageata indreptata in sus
    else if (app.upKeyPressed && app.shipY > 0) {
        app.shipY -= app.speedShip;
    }
    // Nava se deplaseaza in jos daca este apasata sageata indreptata in jos
    else if (app.downKeyPressed && app.shipY < app.canvas.height - app.shipHeight) {
        app.shipY += app.speedShip;
    }
    // Nava se roteste in stanga daca este apasata tasta Z
    else if (app.zKeyPressed) {
        app.angle += 1 * Math.PI / 180;
    }
    // Nava se roteste in dreapta daca este apasata tasta C
    else if (app.cKeyPressed) {
        app.angle -= 1 * Math.PI / 180;
    }
    // Nava impusca rachete daca este apasata tasta X
    else if (app.xKeyPressed) {

        if (app.pressCount >= 1) {
            app.drawRocket();
            app.moveRocket();
        }
        if (app.pressCount >= 2) {
            app.drawRocket2();
            app.moveRocket2();
        }
        if (app.pressCount >= 3) {
            app.drawRocket3();
            app.moveRocket3();
        }
        app.rocketCollisionDetection();
        app.drawScore();
    }

    requestAnimationFrame(app.draw);
}
