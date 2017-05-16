import { message } from 'antd';
import { parse } from 'qs';
import { queryQuestionList, queryRepositoryListBySubjectCode } from '../services/question';

export default {
  namespace: 'Question',

  state: {
    question: [],
    questionsCurrentPage: 0,
    repository: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('/home') >= 0 || location.pathname === '/') {
          // home 页 Question 初始数据
          dispatch({
            type: 'queryQuestion',
            payload: {
              pageNumber: 0 // 每页10条数据，查询第1页
            }
          });
        }
        if (location.pathname.indexOf('/ask') >= 0) {
          const subjectCode = location.pathname.split('/')[ 2 ];
          dispatch({
            type: 'queryRepositoryBySubjectCode',
            payload: {
              subjectCode,
              pageNumber: 0,
            }
          });
        }
      });
    }
  },

  effects: {
    // 查询常见问题列表
    * queryQuestion({ payload }, { call, put }) {
      const { data, err } = yield call(queryQuestionList, parse(payload));
      if (data && data.data.status == '22300') {
        yield put({
          type: 'queryQuestionSuccess',
          payload: {
            question: data.data.info
          }
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 查询专题下的知识库列表
    * queryRepositoryBySubjectCode({ payload }, { call, put }) {
      const { data, err } = yield call(queryRepositoryListBySubjectCode, parse(payload));
      if (data && data.data.status == '22300') {
        yield put({
          type: 'queryRepositoryBySubjectCodeSuccess',
          payload: {
            repository: data.data.info
          }
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
    // 分页加载
    * pageDemanding({ payload }, { call, put }) {
      const { data, err } = yield call(queryQuestionList, parse(payload));
      if (data && data.data.status == '22300') {
        const total = parseInt(data.data.count, 0);
        const shouldHavePage = Math.ceil(total / 10); // 数据总共应该有几页
        if (payload.pageNumber < shouldHavePage) {
          yield put({
            type: 'pageDemandingSuccess',
            payload: {
              increasedQuestion: data.data.info,
              questionsCurrentPage: payload.pageNumber,
            }
          });
        } else {
          message.warning('没有啦，我也是有底线的~！');
        }
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },
  },

  reducers: {
    queryQuestionSuccess(state, { payload }) {
      return {
        ...state,
        question: payload.question,
        questionsCurrentPage: 0, // 重置当前页
      };
    },
    queryRepositoryBySubjectCodeSuccess(state, { payload }) {
      return { ...state, repository: payload.repository };
    },
    pageDemandingSuccess(state, { payload }) {
      return {
        ...state,
        question: state.question.concat(payload.increasedQuestion),
        questionsCurrentPage: payload.questionsCurrentPage
      };
    },
  },

};
