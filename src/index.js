import dva from 'dva';
import { hashHistory } from 'dva/router';
import createLoading from 'dva-loading';
import undoable from 'redux-undo';
import { message } from 'antd';
import 'babel-polyfill';
import 'matchmedia-polyfill';
import 'matchmedia-polyfill/matchMedia.addListener';
import './index.html';
import './index.less';

const ERROR_MSG_DURATION = 5; // 报错显示持续时间

// 1. Initialize
const app = dva({
  history: hashHistory,
  onReducer(reducer) {
    return (state, action) => {
      const undoOpts = {
        debug: false,
        limit: false,
        filter: () => true,   // Action过滤：includeAction(SOME_ACTION); excludeAction(SOME_ACTION)
        initTypes: ['@@redux-undo/INIT'], // history重置：设置执行的时候会重置 history 的 action
        neverSkipReducer: false,          // 是否阻止跨步骤操作 undo/redo
      };
      const newState = undoable(reducer, undoOpts)(state, action); // redux-undo
      return {
        ...newState,
        routing: newState.present.routing, // react-router-redux 需要 state routing
      };
    };
  },
  onError(err) {
    // 统一处理 effects 和 subscriptions 中的 throw new Error()，这样 reject 的 promise 就都会被捕获到了
    message.error(err.message, ERROR_MSG_DURATION);
  }
});

// 2. Plugins
app.use(createLoading({
  namespace: 'loading',
  effect: false
}));

// 3. Model
// 此项目的 model 按照 数据维度 划分（还可以按照 业务维度 划分）
// 如果model很多可以按需加载，加快访问速度，手动将 route component 和 models 对应（一个route component可能对应多个model）
// 按需加载的例子：https://github.com/dvajs/dva/blob/master/examples/dynamic-load/router.js
app.model(require('./models/User'));
app.model(require('./models/Subject'));
app.model(require('./models/Question'));
app.model(require('./models/Tag'));
app.model(require('./models/Collection'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root'); // render target elem
