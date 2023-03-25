!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).tracker={})}(this,(function(e){"use strict";var t;!function(e){e.version="1.0.0"}(t||(t={}));const r=e=>{const t=window.history[e];return function(){const r=t.apply(this,arguments),a=new Event(e);return window.dispatchEvent(a),r}};let a={},s="",n={requestUrl:""};function o(e,t){n=Object.assign({},e),a=t,console.log("useVueTracker",a),function(e){window.history.pushState=r("pushState"),window.history.replaceState=r("replaceState"),void(s=a.version.slice(0,1)),void("2"==s?a.prototype.$sendTracker=i:"3"==s&&(a.config.globalProperties.$sendTracker=i,a.provide("$sendTracker",i))),e.historyTracker&&c(["pushState","replaceState","popstate"],"history-pv");e.hashTracker&&c(["hashchange"],"hash-pv");e.domTracker&&function(){const e=(e,t)=>{const{arg:r}=t||{};return()=>{i({targetKey:r||"DOMCLICK"})}};a.directive("lstracker",{mounted(t,r){t.addEventListener("click",e(t,r))},unmounted(t){t.removeEventListener("click",e)}})}();e.jsError&&(window.addEventListener("error",(e=>{let t,r=e.target;t=e.target!==window?`${e.message};className='${r.className}';tagName='{${r.tagName}}'`:`${e.message};filename:${e.filename};lineno: ${e.lineno};colno:${e.colno}`,i({event:"error",targetKey:"message",message:t})}),!0),window.addEventListener("unhandledrejection",(e=>{e.promise.catch((e=>{i({event:"promise",targetKey:"message",message:e})}))})))}(n)}function i(e){let t=Object.assign({},n,e,{time:(new Date).getTime()}),r=new Blob([JSON.stringify(t)],{type:"application/x-www-form-urlencoded"});navigator.sendBeacon(n.requestUrl,r)}function c(e,t){e.forEach((e=>{window.addEventListener(e,(r=>{i({event:e,trgetKey:t,currentHref:location.href})}))}))}var d={install:(e,t)=>{if(console.log(e),!t.requestUrl)return new Error("缺少参数 requestUrl");o(Object.assign({historyTracker:!1,domTracker:!1,jsError:!1},t),e)}};const h=class{constructor(e){this.MouseEventList=["click"],this.data=Object.assign(this.initDef(),e),this.installTracker()}initDef(){return window.history.pushState=r("pushState"),window.history.replaceState=r("replaceState"),{sdkVersion:t,historyTracker:!1,hashTracker:!1,domTracker:!1,jsError:!1}}setUserId(e){this.data.uuid=e}setExtra(e){this.data.extra=e}sendTracker(e){this.reportTracker({data:e})}targetKeyReport(){this.MouseEventList.forEach((e=>{window.addEventListener(e,(t=>{const r=t.target.getAttribute("target-key");r&&this.reportTracker({event:e,targetKey:r})}))}))}captureEvent(e,t){e.forEach((e=>{window.addEventListener(e,(r=>{this.reportTracker({event:e,trgetKey:t,currentHref:location.href})}))}))}installTracker(){this.data.historyTracker&&this.captureEvent(["pushState","replaceState","popstate"],"history-pv"),this.data.hashTracker&&this.captureEvent(["hashchange"],"hash-pv"),this.data.domTracker&&this.targetKeyReport(),this.data.jsError&&this.jsError()}jsError(){this.errorEvent(),this.promiseReject()}errorEvent(){window.addEventListener("error",(e=>{let t,r=e.target;t=e.target!==window?`${e.message};className='${r.className}';tagName='{${r.tagName}}'`:`${e.message};filename:${e.filename};lineno: ${e.lineno};colno:${e.colno}`,this.reportTracker({event:"error",targetKey:"message",message:t})}),!0)}promiseReject(){window.addEventListener("unhandledrejection",(e=>{e.promise.catch((e=>{this.reportTracker({event:"promise",targetKey:"message",message:e})}))}))}reportTracker(e){let t={};t=Object.assign(t,this.data,e,{time:(new Date).getTime()});let r=new Blob([JSON.stringify(t)],{type:"application/x-www-form-urlencoded"});navigator.sendBeacon(this.data.requestUrl,r)}},l=d;e.generalTracker=h,e.vueTracker=l}));
