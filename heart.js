const Heart = function(ctx, x, y) {
    // Sprite sequences for the heart item
    const sequences = {
        red: { x: 0, y: 0, width: 16, height: 16, count: 1, timing: 200, loop: true }
    };

    // Sprite object for the heart
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.red).useSheet("./public/object_sprites.png"); // Use your sprite sheet image

    // Update the heart sprite
    const update = function(time) {
        sprite.update(time);
    };

    // Draw the heart sprite
    const draw = function() {
        sprite.draw();
    };

    // Return methods for the heart item
    return {
        update: update,
        draw: draw,
        setXY: sprite.setXY,
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox
    };
};