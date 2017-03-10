class GameProxyEvent extends egret.Event{
    constructor(type){
        super(type);
    }

    public static ERROR:string = "proxy_error";
    public static SUCCESS:string = "proxy_success";
}