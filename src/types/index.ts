/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带tracker-key上报
 * @sdkVersion 版本
 * @extra 透传字段
 * @jsError js和promise 报错异常上报
 */
export interface DefaultOptions {
  uuid?: string | undefined;
  requestUrl: string;
  historyTracker?: boolean;
  hashTracker?: boolean;
  domTracker?: boolean;
  sdkVersion: string | number;
  extra?: Record<string, any> | undefined;
  jsError?: boolean;
}
export interface Options extends Partial<DefaultOptions> {
  requestUrl: string;
}
export enum TrackerConfig {
  version = "1.0.0",
}
export type appConfig = Record<string, any>;

type errorString = string | Error;
type customParameters = string | number;

export interface beaconDataType {
  sdkVersion?: string | number;
  historyTracker?: boolean;
  hashTracker?: boolean;
  domTracker?: boolean;
  jsError?: boolean;
  requestUrl?: string;
  event?: "pushState" | "replaceState" | "popstate" | customParameters;
  targetKey?: "history-pv" | "hash-pv" | customParameters;
  message?: errorString;
  time?: Date;
  trgetKey?: "message" | customParameters;
  currentHref?: string
}
