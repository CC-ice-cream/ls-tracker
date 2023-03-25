import {
  Options,
  appConfig
} from "../types/index";
import { createHistoryEvent } from "../utils/pv";

let _app: appConfig = {};
let _version = "";
let _data:Options = {
  requestUrl: ''
}
export function useVueTracker(options: Options, ctx: appConfig) {
  _data = Object.assign({}, options);
  _app = ctx;
  console.log("useVueTracker", _app)
  installTracker(_data);
}

function initDef() {
  window.history["pushState"] = createHistoryEvent("pushState");
  window.history["replaceState"] = createHistoryEvent("replaceState");
  _version = _app.version.slice(0, 1);
}

function installTracker(data: Options) {
  initDef()
  BindGlobalProperty()
  if (data.historyTracker) {
    captureEvent(["pushState", "replaceState", "popstate"], "history-pv");
  }
  if (data.hashTracker) {
    captureEvent(["hashchange"], "hash-pv");
  }
  if (data.domTracker) {
    targetKeyReport();
  }
  if (data.jsError) {
    jsError();
  }
}
function BindGlobalProperty(){
  //绑定sendTracker事件到全局
  if (_version == "2") {
    _app.prototype.$sendTracker = reportTracker
  } else if (_version == "3") {
    _app.config.globalProperties.$sendTracker = reportTracker
    _app.provide("$sendTracker", reportTracker)
  }
}
function targetKeyReport() {
  const customClick = (el: any, binding: any) => {
    const { arg } = binding || {};
    return () => {
      reportTracker({ targetKey: arg || "DOMCLICK" });
    };
  };
  //注册指令
  _app.directive("lstracker", {
    mounted(el: any, binding: any) {
      el.addEventListener("click", customClick(el, binding));
    },
    unmounted(el: any) {
      el.removeEventListener("click", customClick);
    },
  });
}

function reportTracker<T>(data: Options | T) {
  let params = Object.assign({}, _data, data, {
    time: new Date().getTime(),
  });
  let header = {
    type: "application/x-www-form-urlencoded",
  };
  let blob = new Blob([JSON.stringify(params)], header);
  navigator.sendBeacon(_data.requestUrl as string, blob);
}

function captureEvent<T>(mousueEventList: string[], trgetKey: string) {
  mousueEventList.forEach((event) => {
    window.addEventListener(event, (e) => {
      reportTracker<{
        event:string,
        trgetKey:string,
        currentHref: string,
      }>({
        event,
        trgetKey,
        currentHref: location.href,
      });
    });
  });
}
function jsError() {
  errorEvent();
  promiseReject();
}
function errorEvent() {
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
      reportTracker({
        event: "error",
        targetKey: "message",
        message: message,
      });
    },
    true
  );
}

function promiseReject() {
  window.addEventListener("unhandledrejection", (event) => {
    event.promise.catch((err) => {
      reportTracker({
        event: "promise",
        targetKey: "message",
        message: err,
      });
    });
  });
}