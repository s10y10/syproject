/**
 * Created by egret on 15-1-14.
 * DragonBones工厂类
 */
class DragonBonesFactory{
    public averageUtils:AverageUtils;
    private factory:dragonBones.EgretFactory;
    private isPlay:boolean;
    private clocks:Array<dragonBones.WorldClock>;
    private clocksLen:number;
    private files:Array<string>;

    private static _inst:DragonBonesFactory;

    public static i():DragonBonesFactory{
        if(this._inst == null)
        {
            this._inst = new DragonBonesFactory();
        }
        return this._inst;
    }
    /**
     * 构造函数
     */
    public constructor(){
        this.averageUtils = new AverageUtils();
        this.factory = new dragonBones.EgretFactory();
        this.clocks = [];
        this.clocksLen = 0;
        this.files = [];
        //默认开启
        this.start();
    }

    /**
     * 初始化一个动画文件
     * @param skeletonData 动画描述文件
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public initArmatureFile(skeletonData:any, texture:egret.Texture, textureData:any):void{
        if(!skeletonData  || !texture || !textureData){
            egret.warn("**动画数据有误**",skeletonData,texture,textureData)
        }
        if(this.files.indexOf(skeletonData.name) != -1){
            return;
        }
        this.addSkeletonData(skeletonData);
        this.addTextureAtlas(texture, textureData);
        this.files.push(skeletonData.name);
    }

    /**
     * 添加动画描述文件
     * @param skeletonData
     */
    public addSkeletonData(skeletonData:any):void{
        this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
    }

    /**
     * 添加动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public addTextureAtlas(texture:egret.Texture, textureData:any):void{
        this.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    }

    /**
     * 移除动画描述文件
     * @param skeletonData
     */
    public removeSkeletonData(name:string):void{
        this.factory.removeSkeletonData(name);
    }

    /**
     * 移除动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    public removeTextureAtlas(name:string):void{
        this.factory.removeTextureAtlas(name);
    }

    /**
     * 创建一个动画（急速模式）
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    public makeFastArmature(name:string, fromDragonBonesDataName?:string, playSpeed:number = 1,needCache:boolean =false, isNew:boolean = false):DragonAnimation {
        if(this.files.indexOf(fromDragonBonesDataName) == -1){
            var skeletonData:any = RES.getRes(fromDragonBonesDataName+"_skeleton_json");
            var texturePng:egret.Texture = RES.getRes(fromDragonBonesDataName+"_texture_png");
            var textureData:any = RES.getRes(fromDragonBonesDataName+"_texture_json");
            if(!skeletonData){
                egret.warn("动画文件："+ fromDragonBonesDataName +" 没有加载成功！！");
                return null;
            }
            this.initArmatureFile(skeletonData, texturePng, textureData);
        }

        var armature:dragonBones.FastArmature = this.factory.buildFastArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            egret.warn("不存在Armature： "+name);
            return null;
        }
        if(needCache){
            armature.enableAnimationCache(24);
        }
        var clock:dragonBones.WorldClock = this.createWorldClock(playSpeed);
        var result:DragonAnimation = new DragonAnimation(armature, clock);
        return result;
    }

    /**
     * 创建WorldClock
     * @param playSpeed
     * @returns {dragonBones.WorldClock}
     */
    private createWorldClock(playSpeed:number):dragonBones.WorldClock{
        for(var i:number = 0; i<this.clocksLen; i++){
            if(this.clocks[i].timeScale == playSpeed){
                return this.clocks[i];
            }
        }
        var newClock:dragonBones.WorldClock = new dragonBones.WorldClock();
        newClock.timeScale = playSpeed;
        this.clocks.push(newClock);
        this.clocksLen = this.clocks.length;
        return newClock;
    }


    /**
     * dragonBones体系的每帧刷新
     * @param advancedTime
     */
    private onEnterFrame(advancedTime:number):void {
        this.averageUtils.push(advancedTime);
        var time:number = this.averageUtils.getValue() * 0.001;
        for(var i:number = 0; i<this.clocksLen; i++){
            var clock:dragonBones.WorldClock = this.clocks[i];
            clock.advanceTime(time);
        }
    }

    /**
     * 停止
     */
    public stop():void{
        if(this.isPlay){
            TimerManager.i().remove(this.onEnterFrame, this);
            this.isPlay = false;
        }
    }

    /**
     * 开启
     */
    public start():void{
        if (!this.isPlay) {
            this.isPlay = true;
            TimerManager.i().doFrame(1, 0, this.onEnterFrame, this);
        }
    }
}