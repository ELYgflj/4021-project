const Bomb = function(ctx, x, y) {
    // Sprite sequences for the bomb item
    const sequences = {
        black: { x: 0, y: 16, width: 16, height: 16, count: 1, timing: 200, loop: true }
    };

    // Sprite object for the bomb
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.black).useSheet("./public/object_sprites.png"); // Use your sprite sheet image

    // Update the bomb sprite
    const update = function(time) {
        sprite.update(time);
    };

    // Draw the bomb sprite
    const draw = function() {
        sprite.draw();
    };

    // Return methods for the bomb item
    return {
        update: update,
        draw: draw,
        setXY: sprite.setXY,
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox
    };
};