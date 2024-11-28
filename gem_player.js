const Player = function(ctx, x, y, gameArea,walls) {
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        idleLeft:  { x: 0, y: 25, width: 24, height: 25, count: 3, timing: 2000, loop: false },
        idleUp:    { x: 0, y: 50, width: 24, height: 25, count: 1, timing: 2000, loop: false },
        idleRight: { x: 0, y: 75, width: 24, height: 25, count: 3, timing: 2000, loop: false },
        idleDown:  { x: 0, y:  0, width: 24, height: 25, count: 3, timing: 2000, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveLeft:  { x: 0, y: 125, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveUp:    { x: 0, y: 150, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveRight: { x: 0, y: 175, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveDown:  { x: 0, y: 100, width: 24, height: 25, count: 10, timing: 50, loop: true }
    };

    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.idleDown)
          .setScale(2)
          .useSheet("player_sprite.png"); // Use your player sprite sheet

    let targetx = x;
    let targety = y;
    let count =0;
    let times = 0
    const moveTo = function(targetX, targetY) {
        // 获取当前角色的位置 (假设 sprite 对象有这些属性)
        let { x, y } = sprite.getXY();
        targetx = targetX;
        targety = targetY;
        // 计算目标的 X 和 Y 距离
        let deltaX = targetX - x;
        let deltaY = targetY - y;
        // 计算当前的移动方向
        let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        times = distance*50
        // 如果距离不为 0，则确定移动方向
        if (distance > 0) {
            // 计算移动的步长
            let stepX = deltaX;
            let stepY = deltaY;
            

            // 更新精灵动画序列（根据方向判断）
            if (Math.abs(stepX) > Math.abs(stepY)) {
                // 水平移动
                if (stepX < 0) {
                    sprite.setSequence(sequences.moveLeft);
                } else {
                    sprite.setSequence(sequences.moveRight);
                }
            } else {
                // 垂直移动
                if (stepY < 0) {
                    sprite.setSequence(sequences.moveUp);
                } else {
                    sprite.setSequence(sequences.moveDown);
                }
            }
        }
    };

    const stop = function(time) {
        let { x, y } = sprite.getXY();
        let deltaX = targetx - x;
        let deltaY = targety - y;
        let stepX = deltaX;
        let stepY = deltaY;
        targetx = x;
        targety = y;
        if (Math.abs(stepX) > Math.abs(stepY)) {
            // 水平移动
            if (stepX < 0) {
                sprite.setSequence(sequences.idleLeft);
            } else {
                sprite.setSequence(sequences.idleRight);
            }
        } else {
            // 垂直移动
            if (stepY < 0) {
                sprite.setSequence(sequences.idleUp);
            } else {
                sprite.setSequence(sequences.idleDown);
            }
        }
    };

    const update = function(time) {
        let { x, y } = sprite.getXY();
        if(Math.abs(x-targetx)>3||Math.abs(y-targety)>3){
            count =0;
            let deltaX = targetx - x;
            let deltaY = targety - y;
            let stepX = deltaX;
            let stepY = deltaY;
            let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > 0) {
                x += deltaX/times;
                y +=  deltaY/times; 
                if (gameArea.isPointInBox(x, y)){
                    for (let i = 0; i < walls.length; i++) {
                        if(walls[i].isPointInBox(x,y)){
                            console.log("stuck");
                            stop();
                            return;
                        }
                    
                        // 在这里对 wall 执行某些操作
                    }
                    sprite.setXY(x, y);}
            }
        }
        else{
            if(count <=1){
                let deltaX = targetx - x;
                let deltaY = targety - y;
                let stepX = deltaX;
                let stepY = deltaY;
                if (Math.abs(stepX) > Math.abs(stepY)) {
                    // 水平移动
                    if (stepX < 0) {
                        sprite.setSequence(sequences.idleLeft);
                    } else {
                        sprite.setSequence(sequences.idleRight);
                    }
                } else {
                    // 垂直移动
                    if (stepY < 0) {
                        sprite.setSequence(sequences.idleUp);
                    } else {
                        sprite.setSequence(sequences.idleDown);
                    }
                }
                count+=1
            }
        }
        sprite.update(time);
    };

    return {
        moveTo: moveTo,
        stop: stop,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    };
};
