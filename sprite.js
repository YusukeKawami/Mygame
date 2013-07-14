var STATUS_WAIT = 0;
var STATUS_WALK = 1;
var STATUS_JUMP = 2;

var game;

enchant();
window.onload = function() {
    //ゲームオブジェクトの生成
    game = new Game(320, 320);
    game.fps = 16;
    game.touched = false;
    //画像の読み込み
    game.preload(
        'images/back1.jpg',
        'images/back2.jpg',
        'images/back3.jpg',
        'images/chara1.png',
        'images/chara3.png',
        'images/clear.png',
        'images/effect0.png',
        'images/end.png',
        'images/font2.png',
        'images/start.png',
        'images/graphic.png'
    );
    //ロード完了時に呼ばれる
    game.onload = function() {
        //背景の生成
        var bg3 = new Sprite(320, 320);
        bg3.image = game.assets["images/back1.jpg"];
        bg3.y = game.height - bg3.height;
        game.rootScene.addChild(bg3);
        //自機
        tank = new Player(10,160);           
        //バーチャルパッドの生成
        var pad = new Pad();
        pad.x   = 0;
        pad.y   = 220;
        game.rootScene.addChild(pad);
        game.rootScene.addEventListener('enterframe',function(){});
    }
    //ゲームの開始
    game.start();
};

var PlayerShoot = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y){
        enchant.Sprite.call(this,16,16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y - this.height / 2;
        this.frame = 2;
        this.addEventListener('enterframe',function(){
                    console.log(1);
            this.x += 5;
            if(this.x > 320 - this.width / 2){
                this.remove();
            }
        });
        game.rootScene.addChild(this);
    },
    remove: function(){ game.rootScene.removeChild(this);delete this;}
});

var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x,y){
        enchant.Sprite.call(this,32,32);
        this.image = game.assets['images/chara3.png'];
        this.x = x;
        this.y = y;
        this.frame = 12;
        game.rootScene.addEventListener('touchstart',function(e){
            game.touched= true;
        });
        game.rootScene.addEventListener('touchend',function(e){
            game.touched= false;
        });
        this.addEventListener('enterframe',function(){
            if(game.touched && game.frame % 3 == 0){
                var shoot = new PlayerShoot(this.x,this.y + this.height / 2);
            }
            if(game.input.up){tank.y -= 3;}
            if(game.input.down){tank.y += 3;}
        });
        game.rootScene.addChild(this);
    }
});