import request from '../utils/request';

// 根据被收藏信息的code 和 收藏类型 查询收藏者信息
export async function queryCollectListByMsgCodeAndType(params) {
  const { collectMsgCode, collectType, pageNumber } = params;
  return request(`/CFSP/collect/queryCollectByCollectMsgCodeAndCollectType/${collectMsgCode}/${collectType}/${pageNumber}`, {
    method: 'GET',
  });
}

// 添加收藏
export async function insertCollection(params) {
  // 字段匹配：接口接收的参数键名与传入的键名之间的匹配
  const { collectType, collectUserId, collectMsgCode, collectMsgTitle } = params;
  const paramsMatching = {
    collecttype: collectType,
    collectuserid: collectUserId,
    collectmsgcode: collectMsgCode,
    collectmsgtitle: collectMsgTitle,
  };
  // Post JSON
  return request('/CFSP/collect/insertCollectByJson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paramsMatching),
  });
}

// 删除收藏
export async function removeCollection(params) {
  // collectUserId 和 collectMsgCode 为联合主键，通过 userId 和 collectMsgCode 去删除收藏数据
  const { collectUserId, collectMsgCode } = params;
  return request(`/CFSP/collect/cleanCollectByUserIdAndCollectMsgCode/${collectUserId}/${collectMsgCode}`, {
    method: 'DELETE',
  });
}
