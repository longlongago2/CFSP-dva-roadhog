import Cookie from 'js-cookie';
import { parse, stringify } from 'qs';
import { message } from 'antd';
import { login, logout, updateUser, queryBannerImg } from '../services/user';

export default {
  namespace: 'User',

  state: {
    login: false,
    modalVisible: false,
    capsLock: false,
    menu: {
      defaultSelectedKeys: ['home'],
      selectedKeys: ['home'],
    },
    banner: [],
    user: {},
    newMessage: 3
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // 1、请求初始数据
      dispatch({ type: 'queryBannerImg' });
      // 2、自动登录
      const loginData = Cookie.get('login_form_data');
      if (loginData) {
        message.success('正在登录...');
        dispatch({
          type: 'login',
          payload: {
            userName: parse(loginData).userName,
            passWord: parse(loginData).passWord,
            remember: false
          }
        });
      }
      // 路由监听
      history.listen((location) => {
        // 3、绑定地址栏的 pathname 和 菜单栏的 selectedKey
        const selectedKey = location.pathname.split('/')[1];
        dispatch({
          type: 'menuItemActive',
          payload: selectedKey.trim() !== '' ? selectedKey : 'home'
        });
        // 4、强制登录(只有主页可以在未登录状态下查看)
        const login = Cookie.get('login_form_data');
        if (!login) {
          if (selectedKey !== 'home' && selectedKey.trim() !== '') {
            dispatch({ type: 'showModal' });
          }
          dispatch({
            type: 'resetLoginInfo',
            payload: { shouldLogin: false }
          });
        } else {
          dispatch({
            type: 'resetLoginInfo',
            payload: { shouldLogin: true }
          });
        }
      });
    },
  },

  effects: {
    // select 用于在全局的 models 里取数据(state)，reducer api 只能取本 models 里的 state：https://github.com/dvajs/dva-knowledgemap#select
    * login({ payload }, { call, put }) {
      const { data, err } = yield call(login, parse(payload));
      if (data && data.data.status === '20000') {
        yield put({
          type: 'loginSuccess',
          payload: data.data.info
        });
        // 登录成功，记录返回信息到cookie(session)
        Cookie.set('user', stringify(data.data.info));
        // 登录成功，如果选中自动登录，cookie将存储7天
        const login = Cookie.get('login_form_data');
        if (!login) {
          const loginDataExpires = payload.remember ? { expires: 7 } : null;
          Cookie.set('login_form_data', stringify(payload), loginDataExpires);
        }
      } else {
        // 登录失败，清除cookies
        Cookie.remove('login_form_data');
        Cookie.remove('user');
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },

    * logout({ payload }, { call, put }) {
      const { data, err } = yield call(logout);
      if (data && data.data.status === '20097') {
        yield put({ type: 'logoutSuccess' });
        // 退出成功，清除cookies
        message.info('用户已退出！');
        Cookie.remove('login_form_data');
        Cookie.remove('user');
      } else {
        yield put({ type: '@@redux-undo/UNDO' });
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },

    * updateMotto({ payload }, { select, call, put }) {
      const haveLogin = Cookie.get('login_form_data');
      // 未登录
      if (!haveLogin) {
        yield put({
          type: 'resetLoginInfoSuccess',
          payload: { login: false, user: {} }
        });
        message.error('用户已退出，请重新登录！');
        return;
      }
      const { data, err } = yield call(updateUser, parse(payload));
      if (data && data.data.status === '21200') {
        yield put({
          type: 'updateMottoSuccess',
          payload
        });
        // updateMottoSuccess之后，更新 cookie 信息
        const { user } = yield select(state => state.present.User);
        Cookie.set('user', stringify(user));
      } else {
        yield put({ type: '@@redux-undo/UNDO' });
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },

    * resetLoginInfo({ payload }, { select, call, put }) {
      const { shouldLogin } = payload;
      const { login } = yield select(state => state.present.User);
      // 如果状态不同步
      if (shouldLogin !== login) {
        yield put({
          type: 'resetLoginInfoSuccess',
          payload: {
            login: shouldLogin,
            user: shouldLogin ? parse(Cookie.get('user')) : {}
          }
        });
      }
    },

    * queryBannerImg({ payload }, { call, put }) {
      const { data, err } = yield call(queryBannerImg);
      if (data && data.data.status === '20000') {
        yield put({
          type: 'queryBannerImgSuccess',
          payload: {
            banner: data.data.info
          }
        });
      } else {
        throw new Error(err ? `接口报错：${err.message}` : `错误信息：${data.data.info}，错误码：${data.data.status}`);
      }
    },

    * onOffCapsLock({ payload }, { call, put }) {
      const { capsLock } = payload;
      yield put({
        type: 'onOffCapsLockSuccess',
        payload: {
          capsLock,
        }
      });
    },
  },

  reducers: {
    showModal(state) {
      return { ...state, modalVisible: true };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
    menuItemActive(state, action) {
      return { ...state, menu: { defaultSelectedKeys: ['home'], selectedKeys: [action.payload] } };
    },
    updateMottoSuccess(state, action) {
      const userData = state.user;
      return { ...state, user: { ...userData, description: action.payload.description } };
    },
    loginSuccess(state, action) {
      return {
        ...state,
        modalVisible: false,
        login: true,
        user: action.payload
      };
    },
    logoutSuccess(state) {
      return { ...state, login: false, user: {} };
    },
    queryBannerImgSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    resetLoginInfoSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    onOffCapsLockSuccess(state, action) {
      return { ...state, ...action.payload };
    }
  },

};

