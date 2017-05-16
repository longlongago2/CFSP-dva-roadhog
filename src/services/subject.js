import request from '../utils/request';

// 查询所有专题
export async function querySubjectList(params) {
  const { pageNumber } = params; // 分页数据：-1:全部；0,1,2,3...:从0开始正常页码/ 每页10条数据
  return request(`/CFSP/knowledgerepository/queryKnowledgerepositoryList/${pageNumber}`, {
    method: 'GET',
  });
}

// 根据专题code查询单条专题详情
export async function queryOneSubject(params) {
  const { subjectCode } = params;
  return request(`/CFSP/knowledgerepository/queryKnowledgerepositoryByKPCode/${subjectCode}`, {
    method: 'GET',
  });
}

