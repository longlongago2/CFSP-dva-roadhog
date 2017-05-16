import { stringify } from 'qs';
import request from '../utils/request';

export async function queryTagList(params) {
  return request('/CFSP/tag/queryTagAll', {
    method: 'GET',
  });
}

export async function queryTagByTagCode(params) {
  return request();
}
