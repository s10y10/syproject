class Enemy extends egret.DisplayObjectContainer{
    private _anim:DragonAnimation;
    public hp:number = 6;
    public moveSpeed:number = 10;
    public isDead:boolean = false;

    private maxHp:number = 6;
    constructor()
    {
        super();
        this.init();
    }

    public reset():void
    {
        this.hp = this.maxHp;
        this.x = 1300;
        this.isDead = false;
        this.move();
    }

    private init():void
    {
        this._anim = Utils.getAnim("anim","gongjianshou");
        this._anim.addCompleteCallFunc(this.completeFunc,this);
        this._anim.scaleX = -1;
        this._anim.play("stand",0);
        this.addChild(this._anim);
    }

    private completeFunc(label):void
    {
        if(label == "die"){
            this.isDead = true;
        }
    }

    public hurt():void
    {
        this.hp--;
        if(this.hp == 0)
        {
            this.dead();
        }
    }

    public stand():void
    {
        this._anim.play("stand",0);
    }

    public move():void
    {
        this._anim.play("move",0);
    }

    public dead():void
    {
        this._anim.play("die",1);
    }
}