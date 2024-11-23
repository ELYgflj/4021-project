const Shield = function(ctx, x, y) {
    // Sprite sequences for the shield item
    const sequences = {
        cyan: { x: 0, y: 32, width: 16, height: 16, count: 1, timing: 200, loop: true }
    };

    // Sprite object for the shield
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.cyan).useSheet("./public/object_sprites.png"); // Use your sprite sheet image

    // Update the shield sprite
    const update = function(time) {
        sprite.update(time);
    };

    // Draw the shield sprite
    const draw = function() {
        sprite.draw();
    };

    // Return methods for the shield item
    return {
        update: update,
        draw: draw,
        setXY: sprite.setXY,
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox
    };
};