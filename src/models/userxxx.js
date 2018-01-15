import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      // 传入token，获取用户信息
      if (response.code === 0) {
        // 组装参数
        response.name = response.data.realName;
        response.avatar = response.data.avatar;
        response.userid = response.data._id;
        // 暂时未开发通知系统，默认数据7
        response.notifyCount = 7;
        // 更新状态
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        // 获取当前用户信息失败: 用户未登录或Token过期
        yield put(routerRedux.push('/user/login'));
        notification.error({
          message: '系统检测到您未登录或会话已过期',
          // description: '请您重新登入系统',
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
