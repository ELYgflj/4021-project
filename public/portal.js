const Portal = function(ctx, x, y,target_x, target_y) {
    const sprite = Sprite(ctx, x, y);
    const targetx = target_x;
    const targety = target_y;
    // The sprite object is configured for the gem sprite here.
    sprite.setSequence({ x: 4*16, y:  9*16, width: 16, height: 16, count: 4, timing: 50, loop: true })
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet("object_sprites.png");

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        targetx: targetx,
        targety: targety,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
};
