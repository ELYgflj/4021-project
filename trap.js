const Trap = function(ctx, x, y) {
    // Sprite sequences for the trap item
    const sequences = {
        orange: { x: 0, y: 48, width: 16, height: 16, count: 1, timing: 200, loop: true }
    };

    // Sprite object for the trap
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.orange).useSheet("./public/object_sprites.png"); // Use your sprite sheet image

    // Update the trap sprite
    const update = function(time) {
        sprite.update(time);
    };

    // Draw the trap sprite
    const draw = function() {
        sprite.draw();
    };

    // Return methods for the trap item
    return {
        update: update,
        draw: draw,
        setXY: sprite.setXY,
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox
    };
};