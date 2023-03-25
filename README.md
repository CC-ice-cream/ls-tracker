# tracker
前端埋点SDK

vue框架下使用方法
```js
import { createApp } from 'vue'
import { vueTracker } from "ls-tracker";

const app = createApp({})
let options = {
    historyTracker: true, //history API监听
    hashTracker: true, //hashUrl API监听
    domTracker: true, //DOM 点击事件监听
    jsError: true, //JS 异常报错事件监听
}
app.use(vueTracker,{options})

const tr = new Tracker(options)
```
DOM click 事件监听
```js
click监听需要被被监听元素使用指令来进行绑定'v-lstracker:params'

<div v-lstracker:foo >click</div>

params: 传递给指令的参数 (如果有的话)。例如在 v-lstracker:foo 中，参数是 "foo"。
在传递给服务器的请求参数中被赋值给targetKey字段
```
支持用户手动上报自定义数据
```js
let data = {
    //...
}

//vue 2.xx
this.$sendTracker(data)

//vue 3.xx
<script setup>
import { inject } from 'vue'

const $sendTracker = inject('$sendTracker')
$sendTracker(data)
</script>
```
你可以下载到本地后借助 script 标签直接使用
使用方法如下：
```js
<script src="file/index.umd.js"></script>
<script>
    const { generalTracker } = tracker
    new generalTracker({
        requestUrl: "http://localhost:9000/api/tracker",
        historyTracker: true,
        domTracker: true,
        jsError: true,
    });
</script>

```
或者 script标签开启type="module"模式
```js

import { generalTracker as Tracker } from "./dist/index.js"

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
 * @targetKey 'message' || '自定义参数'
 * @message 消息
 * @time 上报时间
 * @currentHref 当前路由地址
 */
export interface DefaultOptons {
    uuid: string | undefined,
    requestUrl: string | undefined,
    historyTracker: boolean,
    hashTracker: boolean,
    domTracker: boolean,
    sdkVersion: string | number,
    extra: Record<string, any> | undefined,
    jsError:boolean,
    targetKey: string,
    sdkVersion?: { version: string };
    event?: "pushState" | "replaceState" | "popstate" | customParameters;
    targetKey?: "history-pv" | "hash-pv" | customParameters;
    message?: errorString;
    time?: Date;
    trgetKey?: "message" | customParameters;
    currentHref?: string
}
```