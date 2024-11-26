const Player = function(ctx, x, y, gameArea) {
    const sequences = {
        idleDown: { x: 0, y: 0, width: 24, height: 25, count: 1, timing: 2000, loop: false },
        moveDown: { x: 0, y: 25, width: 24, height: 25, count: 10, timing: 50, loop: true },
        // Add other directions as needed
    };

    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.idleDown)
          .setScale(2)
          .useSheet("player_sprite.png"); // Use your player sprite sheet

    let direction = 0;
    let speed = 150;

    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveUp); break;
                case 3: sprite.setSequence(sequences.moveRight); break;
                case 4: sprite.setSequence(sequences.moveDown); break;
            }
            direction = dir;
        }
    };

    const stop = function(dir) {
        if (direction == dir) {
            sprite.setSequence(sequences.idleDown);
            direction = 0;
        }
    };

    const update = function(time) {
        if (direction != 0) {
            let { x, y } = sprite.getXY();

            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }

            if (gameArea.isPointInBox(x, y))
                sprite.setXY(x, y);
        }

        sprite.update(time);
    };

    return {
        move: move,
        stop: stop,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    };
};
