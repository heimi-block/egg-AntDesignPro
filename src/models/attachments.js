import { queryAttachments } from '../services/attachments';

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
        payload: Array.isArray(response.data) ? response.data : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
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
