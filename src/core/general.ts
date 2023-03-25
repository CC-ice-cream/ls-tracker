import {
  DefaultOptions,
  TrackerConfig,
  Options,
  beaconDataType,
} from "../types/index";
import { createHistoryEvent } from "../utils/pv";

export default class Tracker {
  //['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
  private MouseEventList: string[] = ["click"];
  public data: Options;
  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options);
    this.installTracker();
  }

  /**
   * @description: 初始化参数
   * @param {*} DefaultOptions
   * @return {*}
   */
  private initDef(): DefaultOptions {
    //pushState,replaceState 事件无法监听 需要重写该函数，加入自定义监听事件
    window.history["pushState"] = createHistoryEvent("pushState");
    window.history["replaceState"] = createHistoryEvent("replaceState");
    return <DefaultOptions>(<unknown>{
      sdkVersion: TrackerConfig,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    });
  }

  public setUserId<T extends DefaultOptions["uuid"]>(uuid: T) {
    this.data.uuid = uuid;
  }

  public setExtra<T extends DefaultOptions["extra"]>(extra: T) {
    this.data.extra = extra;
  }

  /**
   * @description: 用户手动上报
   * @param {T} data
   * @return {*}
   */
  public sendTracker<T>(data: T) {
    this.reportTracker({
      data,
    });
  }
  /**
   * @description: dom上报初始化
   */
  private targetKeyReport() {
    this.MouseEventList.forEach((ev) => {
      window.addEventListener(ev, (e) => {
        const target = e.target as HTMLElement;
        const targetKey = target.getAttribute("target-key");
        if (targetKey) {
          this.reportTracker({ event: ev, targetKey });
        }
      });
    });
  }

  /**
   * @description: 路由劫持 捕获异常事件 自动捕获
   * @param mousueEventList 监听事件列表
   * @param trgetKey key 由后端指定
   * @param data
   * @return void
   */
  private captureEvent<T>(mousueEventList: string[], trgetKey: string) {
    mousueEventList.forEach((event) => {
      window.addEventListener(event, (e) => {
        this.reportTracker({
          event,
          trgetKey,
          currentHref: location.href,
        });
      });
    });
  }

  /**
   * @description: 初始化监听事件列表
   * @param {*} if
   * @return {*}
   */
  private installTracker() {
    if (this.data.historyTracker) {
      this.captureEvent(
        ["pushState", "replaceState", "popstate"],
        "history-pv"
      );
    }
    if (this.data.hashTracker) {
      this.captureEvent(["hashchange"], "hash-pv");
    }
    if (this.data.domTracker) {
      this.targetKeyReport();
    }
    if (this.data.jsError) {
      this.jsError();
    }
  }

  private jsError() {
    this.errorEvent();
    this.promiseReject();
  }

  private errorEvent() {
    window.addEventListener(
      "error",
      (event) => {
        let message: string;
        let target = <HTMLElement>event.target;
        if (event.target !== window) {
          message = `${event.message};className='${target.className}';tagName='{${target.tagName}}'`;
        } else {
          message = `${event.message};filename:${event.filename};lineno: ${event.lineno};colno:${event.colno}`;
        }
        this.reportTracker({
          event: "error",
          targetKey: "message",
          message: message,
        });
      },
      true
    );
  }

  private promiseReject() {
    window.addEventListener("unhandledrejection", (event) => {
      event.promise.catch((err) => {
        this.reportTracker({
          event: "promise",
          targetKey: "message",
          message: err,
        });
      });
    });
  }

  /**
   * @description 错误上报 sendBeacon
   * @param data
   */
  private reportTracker<T>(data: beaconDataType | T) {
    let params = {};
    params = Object.assign(params, this.data, data, {
      time: new Date().getTime(),
    });
    let header = {
      type: "application/x-www-form-urlencoded",
    };
    let blob = new Blob([JSON.stringify(params)], header);
    navigator.sendBeacon(this.data.requestUrl, blob);
  }
}
