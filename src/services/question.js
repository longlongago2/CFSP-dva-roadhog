import request from '../utils/request';

// 查询所有常见问题
export async function queryQuestionList(params) {
  const { pageNumber } = params;
  return request(`/CFSP/knowledgerepository/queryKnowledgerepositoryfaqListByFlag/${pageNumber}/0`, {
    method: 'GET',
  });
}

// 查询所有某个专题下的常见问题
export async function queryQuestionListBySubjectCode(params) {
  const { subjectCode, pageNumber } = params;
  return request(`/CFSP/knowledgerepository/queryKnowledgerepositoryfaqListByMainCodeAndPageNumAndFlag/${subjectCode}/${pageNumber}/0`, {
    method: 'GET',
  });
}

// 查询某个专题下的知识库内容
export async function queryRepositoryListBySubjectCode(params) {
  const { subjectCode, pageNumber } = params;
  return request(`/CFSP/knowledgerepository/queryKnowledgerepositoryfaqListByMainCodeAndPageNumAndFlag/${subjectCode}/${pageNumber}/1`, {
    method: 'GET',
  });
}
