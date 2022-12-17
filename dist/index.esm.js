var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

/**
 * @description: 创建History的监听事件
 * @param {*} 监听事件名称
 * @return {*}
 */
const createHistoryEvent = (type) => {
    const origin = history[type];
    return function () {
        const result = origin.apply(this, arguments);
        const e = new Event(type);
        window.dispatchEvent(e);
        return result;
    };
};

class Tracker {
    constructor(options) {
        //['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']
        this.MouseEventList = ['click'];
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }
    /**
     * @description: 初始化参数
     * @param {*} DefaultOptions
     * @return {*}
     */
    initDef() {
        window.history["pushState"] = createHistoryEvent("pushState");
        window.history["replaceState"] = createHistoryEvent("replaceState");
        return {
            sdkVersion: TrackerConfig,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false,
        };
    }
    setUserId(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
    /**
     * @description: 用户手动上报
     * @param {T} data
     * @return {*}
     */
    sendTracker(data) {
        this.reportTracker({
            data
        });
    }
    /**
     * @description: dom上报初始化
     */
    targetKeyReport() {
        this.MouseEventList.forEach(ev => {
            window.addEventListener(ev, (e) => {
                const target = e.target;
                const targetKey = target.getAttribute('target-key');
                if (targetKey) {
                    this.reportTracker({ event: ev, targetKey });
                }
            });
        });
    }
    /**
     * @description: 捕获异常事件 自动捕获
     * @param mousueEventList 监听事件列表
     * @param trgetKey key 由后端指定
     * @param data
     * @return void
     */
    captureEvent(mousueEventList, trgetKey, data) {
        mousueEventList.forEach((event) => {
            window.addEventListener(event, () => {
                // console.log("TRACKER Message: addEventListener: ", event);
                this.reportTracker({
                    event,
                    trgetKey,
                    data,
                    href: location.href
                });
            });
        });
    }
    /**
     * @description: 初始化监听事件列表
     * @param {*} if
     * @return {*}
     */
    installTracker() {
        if (this.data.historyTracker) {
            this.captureEvent(["pushState", "replaceState", "popstate"], "history-pv");
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
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    errorEvent() {
        window.addEventListener('error', (event) => {
            console.log(event);
            let message;
            let target = event.target;
            if (event.target !== window) {
                message = `className {${target.className}};tagName {${target.tagName}}`;
            }
            else {
                message = `${event.message}; lineno: ${event.lineno}`;
            }
            this.reportTracker({
                event: "error",
                targetKey: "message",
                message: message
            });
        }, true);
    }
    promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(err => {
                this.reportTracker({
                    event: "promise",
                    targetKey: "message",
                    message: err
                });
            });
        });
    }
    /**
     * @description 错误上报 sendBeacon
     * @param data
     */
    reportTracker(data) {
        const params = Object.assign(this.data, data, {
            time: new Date().getTime(),
        });
        let header = {
            type: "application/x-www-form-urlencoded",
        };
        let blob = new Blob([JSON.stringify(params)], header);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

export { Tracker as default };
