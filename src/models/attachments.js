import { message } from 'antd';
import { queryAttachments, removeAttachments, addAttachmentsByUrl } from '../services/attachments';

export default {
  namespace: 'attachments',

  state: {
    attachments: [],
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryAttachments, payload);
      yield put({
        type: 'save',
        payload: Array.isArray(response.data.list) ? response.data.list : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
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
      // yield put({ type: 'reload' });
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
      // yield put({ type: 'reload' });
    },
    // *appendFetch({ payload }, { call, put }) {
    //   yield put({
    //     type: 'changeLoading',
    //     payload: true,
    //   });
    //   const response = yield call(queryFakeList, payload);
    //   yield put({
    //     type: 'appendList',
    //     payload: Array.isArray(response) ? response : [],
    //   });
    //   yield put({
    //     type: 'changeLoading',
    //     payload: false,
    //   });
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        attachments: action.payload,
      };
    },
    // appendList(state, action) {
    //   return {
    //     ...state,
    //     list: state.list.concat(action.payload),
    //   };
    // },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
