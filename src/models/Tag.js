import { parse } from 'qs';
import { queryTagList } from '../services/tag';

export default {
  namespace: 'Tag',
  state: {
    tag: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/home') >= 0 || location.pathname === '/') {
          dispatch({ type: 'queryTag' });
        }
      });
    }
  },
  effects: {
    * queryTag({ payload }, { call, put }) {
      const { data, err } = yield call(queryTagList);
      if (data && data.data.status == '22800') {
        yield put({
          type: 'queryTagSuccess',
          payload: {
            tag: data.data.info
          }
        });
      } else {
        yield put({ type: '@@redux-undo/UNDO' });
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
  },
  reducers: {
    queryTagSuccess(state, action) {
      return { ...state, ...action.payload };
    },
  }
};
