class Utils{
    constructor(){}

    public static createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public static getStageHeight():number{
        return egret.MainContext.instance.stage.stageHeight;
    }

    public static getStageWidth():number{
        return egret.MainContext.instance.stage.stageWidth;
    }

    public static getAnim(aniName:string,fromFile):DragonAnimation{
        return DragonBonesFactory.i().makeFastArmature(aniName,fromFile);
    }
}