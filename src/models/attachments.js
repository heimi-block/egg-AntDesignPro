import { message } from 'antd';
import { queryAttachments, removeAttachments, updateAttachments, addAttachmentsByUrl } from '../services/attachments';

export default {
  namespace: 'attachments',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    // attachments: [],
    loading: false,
  },

  effects: {
    *add({ payload, callback }, { call, put }) {
      // 通过URL添加网络图片
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addAttachmentsByUrl, payload);
      if (response.code === 0) {
        message.success('添加成功');
      } else {
        message.error('添加失败');
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
      const { id } = payload;
      const response = yield call(removeAttachments, id);
      if (response.code === 0) {
        message.success('删除成功');
      } else {
        message.error('删除失败, 文件不已存在或已删除');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *update({ payload: { id, extra }, callback }, { call, put }) {
      // 更新单个数据
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(updateAttachments, id, extra);
      if (response.code === 0) {
        // 修改成功
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
      if (callback) callback();
      yield put({ type: 'reload' });
    },
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAttachments, payload);
      // 处理表格所需的dataSource
      const dataSource = {
        list: Array.isArray(response.data.list) ? response.data.list : [],
        pagination: {
          total: response.data.count,
          pageSize: response.data.pageSize || 8,
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
    *appendFetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAttachments, payload);
      // 处理表格所需的dataSource
      const dataSource = {
        list: Array.isArray(response.data.list) ? response.data.list : [],
        pagination: {
          total: response.data.count,
          pageSize: response.data.pageSize || 8,
          current: response.data.currentPage || 1,
        },
      };
      yield put({
        type: 'appendList',
        payload: dataSource,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *reload(action, { put, select }) {
      // 删除或修改后，重新定位并刷新数据
      const currentPage = yield select(state => state.attachments.data.pagination.current);
      const pageSize = yield select(state => state.attachments.data.pagination.pageSize);
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
    appendList(state, action) {
      // console.log('waht fuck', JSON.stringify(state));
      // console.log('waht fuck payload', JSON.stringify(action.payload));
      return {
        ...state,
        data: {
          list: state.data.list.concat(action.payload.list),
          pagination: action.payload.pagination,
        },
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
