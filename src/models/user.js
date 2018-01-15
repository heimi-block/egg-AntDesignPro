import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addUser, removeUser, removesUser, updateUser, queryUser, queryCurrent } from '../services/user';
import { queryRole } from '../services/role';

export default {
  namespace: 'user',

  state: {
    data: {
      list: [],
      pagination: {},
      roleOptions: [], // 角色下拉列表
    },
    loading: true,
    currentUser: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUser, payload);
      const roleOptionsResponse = yield call(queryRole, { isPaging: false });
      // 处理表格所需的dataSource
      const dataSource = {
        list: response.data.list,
        pagination: {
          total: response.data.count,
          pageSize: response.data.pageSize || 10,
          current: response.data.currentPage || 1,
        },
        roleOptions: roleOptionsResponse.data.list,
      };
      yield put({
        type: 'save',
        payload: dataSource,
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
    *add({ payload, callback }, { call, put }) {
      // 添加单个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addUser, payload);
      if (response.code === 0) {
        message.success('添加成功');
      } else {
        message.error('添加失败, 角色名称已存在');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *remove({ payload, callback }, { call, put }) {
      // 删除单个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeUser, payload);
      if (response.code === 0) {
        message.success('删除成功');
      } else {
        message.error('删除失败, 角色不已存在或已删除');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *removes({ payload, callback }, { call, put }) {
      // 删除多个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removesUser, payload);
      if (response.code === 0) {
        message.success('删除成功');
      } else {
        message.error('删除失败, 角色不已存在或已删除');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *update({ payload: { id, values }, callback }, { call, put }) {
      // 更新单个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateUser, id, values);
      if (response.code === 0) {
        // 修改成功
        message.success('修改成功');
      } else {
        message.error('修改失败, 角色名称已存在');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      // 删除或修改后，重新定位并刷新数据
      const currentPage = yield select(state => state.user.data.pagination.current);
      const pageSize = yield select(state => state.user.data.pagination.pageSize);
      yield put({ type: 'fetch', payload: { currentPage, pageSize } });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
