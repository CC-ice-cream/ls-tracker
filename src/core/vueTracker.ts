import {
  Options,
  appConfig
} from "../types/index";
import { useVueTracker } from "../utils/index";


export default {
  install: (app: appConfig, options: Options) => {
    console.log(app);
    if (!options.requestUrl) {
      return new Error("缺少参数 requestUrl");
    }
    let _options = Object.assign(
      {
        historyTracker: false,
        domTracker: false,
        jsError: false,
      },
      options
    );
    useVueTracker(_options, app)
  },
};