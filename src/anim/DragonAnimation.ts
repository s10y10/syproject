/**
 * Created by yangsong on 15-1-14.
 * Armature封装类
 */
class DragonAnimation extends egret.DisplayObjectContainer{
    private _armature:dragonBones.FastArmature;
    private _clock:dragonBones.WorldClock;

    private _completeCalls:Array<any>;
    private _frameCalls:Array<any>;

    private _isPlay:boolean;
    private _playName:string;
    private _lastUseTime:number = 0;

    private _currAnimationState:dragonBones.FastAnimationState;

    public fromFile:string;
    public armatureName:string;
    public isDestroy:boolean;
    public autoDestroy:boolean = true;

    /**
     * 构造函数
     * @param armature dragonBones.Armature
     * @param clock dragonBones.WorldClock
     */
    public constructor(armature:dragonBones.FastArmature, clock:dragonBones.WorldClock){//dragonBones.Armature
        super();

        this._armature = armature;
        this._clock = clock;
        this.addChild(this._armature.display);

        this._completeCalls = [];
        this._frameCalls = [];

        this._isPlay = false;
        //armature.advanceTime(0.001);
        this._playName = "";
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
    }

    /**
     * 添加事件监听
     */
    private addListeners():void {
        this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE,this.completeHandler,this);
        if(this._armature.enableCache)
            this._armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frameHandler,this);// ANIMATION_FRAME_EVENT
        else{
            this._armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT,this.frameHandler,this);
        }
    }

    /**
     * 移除事件监听
     */
    private removeListeners():void {
        this._armature.removeEventListener(dragonBones.AnimationEvent.COMPLETE,this.completeHandler,this);
        if(this._armature.enableCache)
            this._armature.removeEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frameHandler,this);
        else
            this._armature.removeEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT,this.frameHandler,this);
    }
    /**
     * 事件完成执行函数
     * @param e
     */
    private completeHandler(e:dragonBones.AnimationEvent):void {
        for (var i:number=0, len=this._completeCalls.length; i < len; i++) {
            var arr:Array<any> = this._completeCalls[i];
            arr[0].apply(arr[1], [e.animationState.name].concat(arr[2]));
        }
        if(e.animationName == this._playName){
            this._playName = "";
        }
    }

    /**
     * 帧事件处理函数
     * @param e
     */
    private frameHandler(e:dragonBones.FrameEvent):void {
        for (var i:number=0, len=this._frameCalls.length; i < len; i++) {
            var arr:Array<any> = this._frameCalls[i];
            arr[0].apply(arr[1], [e.bone, e.frameLabel]);
        }
    }

    /**
     * 播放名为name的动作
     * @param name 名称
     * @param playNum 指定播放次数，默认走动画配置
     */
    public play(name:string, playNum:number = undefined):dragonBones.FastAnimationState {
        this._playName = name;
        this._lastUseTime = Math.floor(Date.now()/1000);
        this.start();
        if(playNum == undefined){
            this._currAnimationState = this.getAnimation().play(name);
        }
        else{
            this._currAnimationState = this.getAnimation().play(name, playNum);
        }
        //this._armature.advanceTime(0.001);
        var tis = this.getArmature().animation.timeScale;
        this.getArmature().animation.timeScale = 1;
        this._armature.advanceTime(0.001);
        this.getArmature().animation.timeScale = tis;

        if(this._currAnimationState){
            this._currAnimationState.autoTween = false;
        }
        return this._currAnimationState;
    }

    /**
     * 恢复播放
     */
    public start():void {
        if(!this._isPlay){
            if(this._clock == null) {
                console.log(this.fromFile, this.armatureName);
                return;
            }
            this._clock.add(this._armature);
            this._isPlay = true;
            this.addListeners();
        }
    }

    /**
     * 停止播放
     */
    public stop():void {
        if(this._isPlay){
            this._clock.remove(this._armature);
            this._isPlay = false;
            this._playName = "";
            this.removeListeners();
        }
    }

    /**
     * 添加动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    public addCompleteCallFunc(callFunc:Function, target:any, params?:any[]):void {
        if(!this._completeCalls){
            return;
        }
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr:Array<any> = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._completeCalls.unshift([callFunc, target, params]);
    }

    /**
     * 移除一个动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    public removeCompleteCallFunc(callFunc:Function, target:any):void {
        if(!this._completeCalls){
            return;
        }
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr:Array<any> = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._completeCalls.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * 添加帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    public addFrameCallFunc(callFunc:Function, target:any):void {
        if(!this._frameCalls){
            return;
        }
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr:Array<any> = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._frameCalls.push([callFunc, target]);
    }

    /**
     * 移除帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    public removeFrameCallFunc(callFunc:Function, target:any):void {
        if(!this._frameCalls){
            return;
        }
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr:Array<any> = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._frameCalls.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * 移除舞台处理
     * @private
     */
    private onRemoveFromStage(e:egret.Event){
        this.stop();
    }

    /**
     * 获取dragonBones.Armature
     * @returns {dragonBones.Armature}
     */
    public getArmature():dragonBones.FastArmature{
        return this._armature;
    }

    /**
     * 获取当前dragonBones.AnimationState
     * @returns {dragonBones.AnimationState}
     */
    public getCurrAnimationState():dragonBones.FastAnimationState{
        return this._currAnimationState;
    }

    /**
     * 获取所属dragonBones.WorldClock
     * @returns {dragonBones.WorldClock}
     */
    public getClock():dragonBones.WorldClock{
        return this._clock;
    }

    /**
     * 获取dragonBones.Animation
     * @returns {Animation}
     */
    public getAnimation():dragonBones.FastAnimation{
        return this._armature.animation;
    }

    /**
     * 获取一个Bone
     * @param boneName
     * @returns {Bone}
     */
    public getBone(boneName:string):dragonBones.FastBone {
        return this._armature.getBone(boneName);
    }

    /**
     * 当前正在播放的动作名字
     * @returns {string}
     */
    public getPlayName():string{
        return this._playName;
    }

    /**
     * 获取骨骼的display
     * @param bone
     * @returns {function(): any}
     */
    public getBoneDisplay(bone:dragonBones.Bone):egret.DisplayObject {
        return bone.slot.getDisplay();
    }

    /**
     * 替换骨骼插件
     * @param boneName
     * @param displayObject
     */
    public changeBone(boneName:string, displayObject:egret.DisplayObject):void{
        var bone:dragonBones.FastBone = this.getBone(boneName);
        if (bone) {
            bone.slot.display=displayObject;
        }
    }
    /*
    * 获取上次使用时间
    * */
    public get lastUseTime():number{
        return this._lastUseTime;
    }

    public get isPlay():boolean {
        return this._isPlay;
    }

    public set lastUseTime(value:number){
        this._lastUseTime = value;
    }
}