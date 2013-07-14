var STATUS_WAIT = 0;
var STATUS_WALK = 1;
var STATUS_JUMP = 2;

enchant();
window.onload = function() {
    //ゲームオブジェクトの生成
    var game = new Game(320, 320);
    game.fps = 16;

    //画像の読み込み
    game.preload('images/back1.jpg','images/back2.jpg','images/back3.jpg','images/chara1.png','images/chara3.png','images/clear.png','images/effect0.png','images/end.png','images/font2.png','images/start.png');

    //ロード完了時に呼ばれる
    game.onload = function() {
        //背景の生成
        var bg3 = new Sprite(320, 320);
            bg3.image = game.assets["images/back1.jpg"];
            bg3.y = game.height - bg3.height;
            game.rootScene.addChild(bg3);
        
        //バーチャルパッドの生成
        var pad = new Pad();
        pad.x   = 0;
        pad.y   = 220;
        game.rootScene.addChild(pad);

        //戦車の生成
        var bear = new Sprite(32, 32);
        bear.image  = game.assets['images/chara3.png'];
        bear.x      = 0;
        bear.y      = 160;
        bear.status = STATUS_WAIT;
        bear.anim   = [12, 13, 12, 14];
        bear.frame  = 12;
        game.rootScene.addChild(bear);
        
        //クマの定期処理
        bear.tick = 0;
        bear.addEventListener(Event.ENTER_FRAME, function() {
            
            //上
            if (bear.status != STATUS_JUMP) {
                bear.status = STATUS_WAIT;
                if (game.input.up)  {
                    bear.y -= 3;
               // bear.scaleX =  -1;
                if (bear.status != STATUS_JUMP) bear.status = STATUS_WALK;
                }
            }
            //左
            if (game.input.down)  {
                bear.y += 3;
                //bear.scaleX = +1;
                if (bear.status != STATUS_JUMP) bear.status = STATUS_WALK;
            }
           
           
            
            //フレームの指定
           /* bear.tick++;
            if (bear.status == STATUS_WAIT) {
                bear.frame = bear.anim[0];            
            } else if (bear.status == STATUS_WALK) {
                bear.frame = bear.anim[bear.tick % 4];            
            } else if (bear.status == STATUS_JUMP) {
                bear.frame = bear.anim[1];            
            }
            
            */
        });
        
    };
    
    //ゲームの開始
    game.start();
};