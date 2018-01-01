import { stringify } from 'qs';
import request from '../utils/request';

export async function queryAttachments(params) {
  return request(`/api/attachments?${stringify(params)}`, {
    method: 'GET',
  });
}
