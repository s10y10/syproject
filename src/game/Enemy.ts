class Enemy extends egret.DisplayObjectContainer{
    private _anim:DragonAnimation;
    constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this._anim = Utils.getAnim("anim","gongjianshou");
        this._anim.scaleX = -1;
        this._anim.play("stand",0);
        this.addChild(this._anim);
    }

    public move():void
    {
        this._anim.play("move",0);
    }

    public dead():void
    {
        this._anim.play("die",0);
    }
}