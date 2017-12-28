import { message } from 'antd';
import { addRole, removeRole, removesRole, updateRole, queryRole } from '../services/role';

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    loading: true,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryRole, payload);
      // 处理表格所需的dataSource
      const dataSource = {
        list: response.data.list,
        pagination: {
          total: response.data.count,
          pageSize: response.data.pageSize || 10,
          current: response.data.currentPage || 1,
        },
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
    *add({ payload, callback }, { call, put }) {
      // 添加单个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addRole, payload);
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
      const response = yield call(removeRole, payload);
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
      const response = yield call(removesRole, payload);
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
      const response = yield call(updateRole, id, values);
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
      const currentPage = yield select(state => state.role.data.pagination.current);
      const pageSize = yield select(state => state.role.data.pagination.pageSize);
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
