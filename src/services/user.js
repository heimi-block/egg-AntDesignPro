import { stringify } from 'qs';
import request from '../utils/request';

export async function addUser(params) {
  return request('/api/user', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeUser(params) {
  return request(`/api/user/${params}`, {
    method: 'DELETE',
  });
}

export async function removesUser(params) {
  console.log(...params);
  return request('/api/user', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function updateUser(id, values) {
  return request(`/api/user/${id}`, {
    method: 'PUT',
    body: {
      ...values,
      method: 'put',
    },
  });
}

export async function queryUser(params) {
  return request(`/api/user?${stringify(params)}`, {
    method: 'GET',
  });
}

export async function queryCurrent() {
  return request('/api/user/access/current', {
    method: 'GET',
  });
}
