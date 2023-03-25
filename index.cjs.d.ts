/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带tracker-key上报
 * @sdkVersion 版本
 * @extra 透传字段
 * @jsError js和promise 报错异常上报
 */
interface DefaultOptions {
    uuid?: string | undefined;
    requestUrl: string;
    historyTracker?: boolean;
    hashTracker?: boolean;
    domTracker?: boolean;
    sdkVersion: string | number;
    extra?: Record<string, any> | undefined;
    jsError?: boolean;
}
interface Options extends Partial<DefaultOptions> {
    requestUrl: string;
}
type appConfig = Record<string, any>;

declare class Tracker {
    private MouseEventList;
    data: Options;
    constructor(options: Options);
    /**
     * @description: 初始化参数
     * @param {*} DefaultOptions
     * @return {*}
     */
    private initDef;
    setUserId<T extends DefaultOptions["uuid"]>(uuid: T): void;
    setExtra<T extends DefaultOptions["extra"]>(extra: T): void;
    /**
     * @description: 用户手动上报
     * @param {T} data
     * @return {*}
     */
    sendTracker<T>(data: T): void;
    /**
     * @description: dom上报初始化
     */
    private targetKeyReport;
    /**
     * @description: 路由劫持 捕获异常事件 自动捕获
     * @param mousueEventList 监听事件列表
     * @param trgetKey key 由后端指定
     * @param data
     * @return void
     */
    private captureEvent;
    /**
     * @description: 初始化监听事件列表
     * @param {*} if
     * @return {*}
     */
    private installTracker;
    private jsError;
    private errorEvent;
    private promiseReject;
    /**
     * @description 错误上报 sendBeacon
     * @param data
     */
    private reportTracker;
}

declare const generalTracker: typeof Tracker;
declare const vueTracker: {
    install: (app: appConfig, options: Options) => Error | undefined;
};

export { generalTracker, vueTracker };
