const Gem = function(ctx, x, y) {
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence({ x: 192, y: 0, width: 16, height: 16, count: 4, timing: 200, loop: true })
          .setScale(2)
          .useSheet("object_sprites.png"); // Use your gem sprite sheet

    const draw =
