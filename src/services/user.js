import { stringify } from 'qs';
import request from '../utils/request';

// 登录
export async function login(params) {
  const { userName, passWord } = params;
  return request(`/CFSP/users/login/${userName}/${passWord}`, {
    method: 'GET',
  });
}

// 登出
export async function logout() {
  return request('/CFSP/users/logout', {
    method: 'POST',
  });
}

// 查询banner信息
export async function queryBannerImg() {
  return request('/CFSP/menus/queryBannerImg', {
    method: 'GET',
  });
}

// 更新user信息
export async function updateUser(params) {
  return request(`/CFSP/users/updateUser?${stringify(params)}`, {
    method: 'PUT',
  });
}
