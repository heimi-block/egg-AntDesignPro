import { stringify } from 'qs';
import request from '../utils/request';

export async function addRole(params) {
  return request('/api/role', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function removeRole(params) {
  return request(`/api/role/${params}`, {
    method: 'DELETE',
  });
}

export async function removesRole(params) {
  console.log(...params);
  return request('/api/role', {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}

export async function updateRole(id, values) {
  return request(`/api/role/${id}`, {
    method: 'PUT',
    body: {
      ...values,
      method: 'put',
    },
  });
}

export async function queryRole(params) {
  return request(`/api/role?${stringify(params)}`, {
    method: 'GET',
  });
}
