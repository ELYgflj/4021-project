const Fire = function(ctx, x, y) {
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence({ x: 0, y: 160, width: 16, height: 16, count: 8, timing: 200, loop: true }) // Use your fire sprite sheet
          .setScale(2)
          .useSheet("object_sprites.png"); 

    const draw = function() {
        sprite.draw();
    };

    return {
        draw: draw,
        getBoundingBox: sprite.getBoundingBox
    };
};
