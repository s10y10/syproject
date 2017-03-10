class Hero extends egret.DisplayObjectContainer{
    private _anim:DragonAnimation;
    constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this._anim = Utils.getAnim("anim","houyi");
        this._anim.play("stand",0);
        this.addChild(this._anim);
    }

    public attack():void
    {
        this._anim.play("attack1",0);
    }

    public stand():void
    {
        this._anim.play("stand",0);
    }
}