class GameProxy extends egret.EventDispatcher{
    private _loader:egret.URLLoader;
    constructor()
    {
        super();
    }

    public sendHttpRequest(type:string,para:any = null):void{
        var variables:egret.URLVariables = this.getURLVariables(type,para);
        var request = new egret.URLRequest();
        request.data = variables;
        request.method = egret.URLRequestMethod.POST;
        request.url = "http://10.0.9.133:8888";
        this._loader = new egret.URLLoader();
        this._loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        this._loader.addEventListener(egret.Event.COMPLETE,this.onLoaderComplete,this);
        this._loader.load(request);
    }
    
    private onError(e:egret.IOErrorEvent):void
    {
        this.dispatchEvent(new GameProxyEvent(GameProxyEvent.ERROR));
        this.removeListener();
    }

    private onLoaderComplete(e:egret.Event):void
    {
        var resultData = e.target.data;
        var jsonData = JSON.parse(resultData);
        if(jsonData.s == 0)//判断返回值状态码
        {
            console.log(resultData);
            this.dispatchEvent(new GameProxyEvent(GameProxyEvent.SUCCESS));
        }else{
            this.dispatchEvent(new GameProxyEvent(GameProxyEvent.ERROR));
        }
        this.removeListener();
    }

    private removeListener():void{
        this._loader.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onError,this);
        this._loader.removeEventListener(egret.Event.COMPLETE,this.onLoaderComplete,this);
    }

    private getURLVariables(type:string,para:any = null):egret.URLVariables{
        var typeArr:Array<any> = type.split(".");
        var paraObj:any = {};
        paraObj["mod"] = typeArr[0];
        paraObj["do"] = typeArr[1];
        if(para != null)
        {
            paraObj["p"] = para;
        }
        var param:string = JSON.stringify(paraObj);
        var variables:egret.URLVariables = new egret.URLVariables("data="+param);
        return variables;
    }
}