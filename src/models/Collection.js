import { message } from 'antd';
import { queryCollectListByMsgCodeAndType } from '../services/collection';

export default {
  namespace: 'Collection',

  state: {
    collection: [],
    collectionCurrentPage: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const routeName = location.pathname.split('/')[ 3 ];
        const collectMsgCode = location.pathname.split('/')[ 2 ];
        if (routeName == 'stars') {
          dispatch({
            type: 'querySubjectCollectorsByMsgCode',
            payload: {
              collectMsgCode,
              pageNumber: 0, // 查询第一页数据
            },
          });
        }
      });
    }
  },

  effects: {
    // 查询收藏专题的人的信息列表
    * querySubjectCollectorsByMsgCode({ payload }, { call, put }) {
      const { data, err } = yield call(queryCollectListByMsgCodeAndType, { ...payload, collectType: '2' });
      if (data && data.data.status == '23000') {
        yield put({
          type: 'queryCollectorsByCodeAndTypeSuccess',
          payload: {
            collection: data.data.info,
          },
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 分页加载
    * pageDemanding({ payload }, { call, put }) {
      const { data, err } = yield call(queryCollectListByMsgCodeAndType, { ...payload, collectType: '2' });
      if (data && data.data.status == '23000') {
        const total = parseInt(data.data.count, 0);
        const shouldHavePage = Math.ceil(total / 10);// 数据总共应该有几页
        if (payload.pageNumber < shouldHavePage) {
          yield put({
            type: 'pageDemandingSuccess',
            payload: {
              increasedData: data.data.info,
              collectionCurrentPage: payload.pageNumber
            },
          });
        } else {
          message.warning('到底啦，我也是有底线的~！');
        }
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
  },

  reducers: {
    queryCollectorsByCodeAndTypeSuccess(state, { payload }) {
      return {
        ...state,
        collection: payload.collection,
        collectionCurrentPage: 0 // 重置页码
      };
    },
    pageDemandingSuccess(state, { payload }) {
      return {
        ...state,
        collection: state.collection.concat(payload.increasedData),
        collectionCurrentPage: payload.collectionCurrentPage,
      };
    },
  },
};
