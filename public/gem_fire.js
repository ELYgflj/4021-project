const Fire = function(ctx, x, y, firetype){
    const sequences = {
        realfire:  { x: 0, y:  160, width: 16, height: 16, count: 6, timing: 200, loop: true },
        boom    :  { x: 64, y:  112, width: 16, height: 16, count: 6, timing: 200, loop: true }
    };
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences[firetype])
    .setScale(2)
    .setShadowScale({ x: 0.75, y: 0.2 })
    .useSheet("object_sprites.png");
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
}