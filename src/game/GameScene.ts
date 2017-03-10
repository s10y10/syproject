class GameScene extends egret.DisplayObjectContainer{
    private bg:egret.Bitmap;
    private hero:Hero;
    private enemy:Enemy;

    private stageHeight:number;
    constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this.stageHeight = Utils.getStageHeight();
        this.initBg();
        this.initElement();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(e:egret.Event):void
    {
    }

    private initBg():void
    {
        this.bg = Utils.createBitmapByName("map_png");
        this.bg.x = 0;
        this.bg.y = this.stageHeight - this.bg.height;
        this.addChild(this.bg);
    }

    private initElement():void{
        this.hero = new Hero();
        this.hero.x = 200;
        this.hero.y = this.stageHeight - 200;
        this.addChild(this.hero);

        this.enemy = new Enemy();
        this.enemy.x = 600;
        this.enemy.y = this.stageHeight - 200;
        this.addChild(this.enemy);
    }
}