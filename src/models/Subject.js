import { message } from 'antd';
import { parse } from 'qs';
import { querySubjectList, queryOneSubject } from '../services/subject';
import { insertCollection, removeCollection } from '../services/collection';
import { queryQuestionListBySubjectCode } from '../services/question';

export default {
  namespace: 'Subject',

  state: {
    subject: [],
    subjectDetail: {},
    questionBySubject: [],
    questionBySubjectCurrentPage: 0,
    showAll: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/home') >= 0 || location.pathname === '/') {
          dispatch({
            type: 'querySubject',
            payload: {
              pageNumber: -1 // 查询所有，因为专题本身数据不会太多，并且专题导航栏需要全部数据
            }
          });
        }
        if (location.pathname.indexOf('/subject') >= 0) {
          // 1、查询所有专题
          dispatch({
            type: 'querySubject',
            payload: {
              pageNumber: -1,
            }
          });
          // 2、根据subjectCode查询专题详情
          const subjectCode = location.pathname.split('/')[ 2 ];
          dispatch({
            type: 'querySubjectBySubjectCode',
            payload: {
              subjectCode,
            },
          });
          // 3、根据subjectCode查询常见问题列表
          const moduleName = location.pathname.split('/')[ 3 ];
          if (!moduleName || moduleName === 'questions') {
            dispatch({
              type: 'queryQuestionBySubjectCode',
              payload: {
                pageNumber: 0,
                subjectCode,
              },
            });
          }
        }
        if (location.pathname.indexOf('/ask') >= 0) {
          dispatch({
            type: 'querySubject',
            payload: {
              pageNumber: -1 // 查询所有专题
            }
          });
        }
      });
    }
  },

  effects: {
    // 查询所有专题列表
    * querySubject({ payload }, { call, put }) {
      const { data, err } = yield call(querySubjectList, parse(payload));
      if (data && data.data.status == '22300') {
        yield put({
          type: 'querySubjectSuccess',
          payload: {
            subject: data.data.info
          }
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 根据专题编号查询专题信息
    * querySubjectBySubjectCode({ payload }, { call, put }) {
      const { data, err } = yield call(queryOneSubject, parse(payload));
      if (data && data.data.status == '22300') {
        yield put({
          type: 'querySubjectBySubjectCodeSuccess',
          payload: {
            subjectDetail: data.data.info,
          },
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 根据专题编号查询常见问题
    * queryQuestionBySubjectCode({ payload }, { call, put }) {
      const { data, err } = yield call(queryQuestionListBySubjectCode, parse(payload));
      if (data && data.data.status == '22300') {
        yield put({
          type: 'queryQuestionBySubjectCodeSuccess',
          payload: {
            questionBySubject: data.data.info,
          }
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 专题下常见问题列表分页请求
    * pageDemanding({ payload }, { call, put }) {
      const { data, err } = yield call(queryQuestionListBySubjectCode, parse(payload));
      if (data && data.data.status == '22300') {
        const total = parseInt(data.data.count, 0);
        const shouldHavePage = Math.ceil(total / 10); // 数据总共应该有几页
        if (payload.pageNumber < shouldHavePage) {
          yield put({
            type: 'pageDemandingSuccess',
            payload: {
              increasedQuestion: data.data.info,
              questionBySubjectCurrentPage: payload.pageNumber,
            }
          });
        } else {
          message.warning('别点啦，我是有底线的~！');
        }
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 专题板块下添加收藏
    * addCollection({ payload }, { call, put }) {
      const { data, err } = yield call(insertCollection, parse(payload));
      if (data && data.data.status == '23000') {
        yield put({
          type: 'addCollectionSuccess',
          payload: data.data.info,
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 专题板块下移除收藏
    * removeCollection({ payload }, { call, put }) {
      const { data, err } = yield call(removeCollection, parse(payload));
      if (data && data.data.status == '23000') {
        yield put({
          type: 'removeCollectionSuccess',
          payload: {
            collecttype: payload.collectType,         // 收藏类型
            collectuserid: payload.collectUserId,     // 收藏人userId
            collectmsgcode: payload.collectMsgCode,   // 收藏内容编码
          },
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    }
  },

  reducers: {
    querySubjectSuccess(state, { payload }) {
      return { ...state, subject: payload.subject };
    },
    querySubjectBySubjectCodeSuccess(state, { payload }) {
      return { ...state, subjectDetail: payload.subjectDetail };
    },
    queryQuestionBySubjectCodeSuccess(state, { payload }) {
      return {
        ...state,
        questionBySubject: payload.questionBySubject,
        questionBySubjectCurrentPage: 0, // 重置当前页页码为0
      };
    },
    pageDemandingSuccess(state, { payload }) {
      return {
        ...state,
        questionBySubject: state.questionBySubject.concat(payload.increasedQuestion),
        questionBySubjectCurrentPage: payload.questionBySubjectCurrentPage
      };
    },
    // 更新临时的状态
    updateTemporaryState(state, { payload }) {
      return { ...state, ...payload };
    },
    addCollectionSuccess(state, { payload }) {
      // 常见问题收藏
      if (payload.collecttype == '1') {
        const locateState = state.questionBySubject.filter((item) => {
          return item.faqcode == payload.collectmsgcode;
        }); // 定位到需要收藏的那条数据（收藏对象）
        if (locateState.length > 0) {
          locateState[ 0 ].collectinfo.push(payload);
        }
      }
      // 专题收藏
      if (payload.collecttype == '2') {
        state.subjectDetail.collectinfo.push(payload);
      }
      return state;
    },
    removeCollectionSuccess(state, { payload }) {
      // 常见问题取消收藏
      if (payload.collecttype == '1') {
        state.questionBySubject.forEach((item) => {
          if (item.faqcode === payload.collectmsgcode) {
            item.collectinfo = item.collectinfo.filter(
              collectItem => collectItem.collectuserid !== payload.collectuserid
            );
          }
        });
      }
      // 专题取消收藏
      if (payload.collecttype == '2') {
        state.subjectDetail.collectinfo = state.subjectDetail.collectinfo.filter(
          subjectCollectItem => subjectCollectItem.collectuserid !== payload.collectuserid
        );
      }
      return state;
    },
  }
};
