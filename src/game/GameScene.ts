class GameScene extends egret.DisplayObjectContainer{
    private bg:egret.Bitmap;
    private hero:Hero;
    private enemy:Enemy;
    private stageHeight:number;

    private startState:number = 0;
    private moveingState:number = 1;
    private attackState:number = 2;

    private curState:number = 0;
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
        if(this.curState == this.startState){
            this.enemy.reset();
            this.hero.reset();
            this.curState = this.moveingState;
        }
        else if(this.curState == this.moveingState){
            this.enemy.x -= this.enemy.moveSpeed;
            if(this.enemy.x - this.hero.x <= this.hero.attackDis)
            {
                this.hero.setTarget(this.enemy);
                this.enemy.stand();
                this.hero.attack();
                this.curState = this.attackState;
            }
        }else if(this.curState == this.attackState){
            if(this.enemy.isDead){
                this.sendMessage();
                this.curState = this.startState;
            }
        }
    }

    private sendMessage():void
    {
        var proxy:GameProxy = new GameProxy();
        proxy.sendHttpRequest(GameProxyType.KillEnemy);
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
        this.enemy.x = 1300;
        this.enemy.y = this.stageHeight - 200;
        this.addChild(this.enemy);
    }
}