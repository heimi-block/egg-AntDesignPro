import { stringify } from 'qs';
import request from '../utils/request';

// 通过URL添加图片
export async function addAttachmentsByUrl(params) {
  return request('/api/upload/url', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeAttachments(params) {
  return request(`/api/upload/${params}`, {
    method: 'DELETE',
  });
}

// 为图片添加详细或备注
export async function updateAttachments(id, values) {
  return request(`/api/upload/${id}/extra`, {
    method: 'PUT',
    body: {
      ...values,
      method: 'put',
    },
  });
}

export async function queryAttachments(params) {
  return request(`/api/upload?isPaging=false&pageSize=8&${stringify(params)}`, {
    method: 'GET',
  });
}
