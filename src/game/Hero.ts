class Hero extends egret.DisplayObjectContainer{
    private _anim:DragonAnimation;
    private _target:Enemy;
    public attackDis:number = 450;
    constructor()
    {
        super();
        this.init();
    }

    private init():void
    {
        this._anim = Utils.getAnim("anim","houyi");
        this._anim.addCompleteCallFunc(this.completeFunc,this);
        this._anim.play("stand",0);
        this.addChild(this._anim);
    }

    public reset():void
    {
        this._target = null;
        this.stand();
    }

    public setTarget(enemy:Enemy):void
    {
        this._target = enemy;
    }

    private completeFunc(label):void
    {
        if(label == "attack1"){
            this._target.hurt();
            if(this._target.hp == 0)
            {
                this.stand();
            }else{
                this.attack();
            }
        }
    }

    public attack():void
    {
        this._anim.play("attack1",1);
    }

    public stand():void
    {
        this._anim.play("stand",0);
    }
}