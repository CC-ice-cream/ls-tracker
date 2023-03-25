/**
 * @description: 创建History的监听事件
 * @param {*} 监听事件名称
 * @return {*}
 */
export const createHistoryEvent = <T extends keyof History>(type: T) => {
  const origin = window.history[type];

  return function (this: any) {
    const result = origin.apply(this, arguments);
    const e = new Event(type)
    window.dispatchEvent(e);

    return result;
  };
};
