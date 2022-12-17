# tracker
前端埋点SDK

使用方法如下

```js
import Tracker from 'ls-tracker'

const tr = new Tracker({
    requestUrl:"xxxxxx"
})
tr.setUserId('userID') // 可以设置身份id，会随着埋点请求上传
let data = {
    //...
}
tr.sendTracker(data) //支持用户手动上报自定义数据
```
js error监听
```js
const tr = new Tracker({
    requestUrl:"xxxxxx"，
    jsError: true
})
//{"sdkVersion":{"version":"1.0.0"},"historyTracker":true,"hashTracker":false,"domTracker":true,"jsError":true,"requestUrl":"xxx","event":"error","targetKey":"message","message":"Uncaught 报错; lineno: 31","time":xxx}
//message字段中包含错误信息
```
dom click事件监听
```js
const tr = new Tracker({
    requestUrl:"xxxxxx"，
    domTracker: true
})
<button target-key="btn">button</button>

// {"sdkVersion":{"version":"1.0.0"},"historyTracker":true,"hashTracker":false,"domTracker":true,"jsError":true,"requestUrl":"xxx","event":"click","targetKey":"btn","message":"className {bad-img};tagName {IMG}","time":xxx}
```
options 介绍
Options introduction
```ts
/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @historyTracker sdkVersion sdk版本
 * @historyTracker extra 透传字段
 * @jsError js 和 promise 报错异常上报
 */
export interface DefaultOptons {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError:boolean
}
```