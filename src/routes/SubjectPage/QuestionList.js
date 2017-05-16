import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { message } from 'antd';
import Cookie from 'js-cookie';
import List from '../../components/QuestionList';
import SubjectOperationConnect from '../../HOCs/SubjectConnect';

const QuestionList = ({
  questionBySubject,
  questionBySubjectCurrentPage,
  loading,
  dispatch,
  params,
  handleStar,
}) => {
  function handleLoadingMore(currentPage) {
    message.info(`第${currentPage + 2}页，努力加载中…`);
    dispatch({
      type: 'Subject/pageDemanding',
      payload: {
        pageNumber: currentPage + 1,
        subjectCode: params.subjectCode,
      }
    });
  }

  const listProps = {
    question: questionBySubject,
    showSubject: false,
    questionsCurrentPage: questionBySubjectCurrentPage,
    onStar: Cookie.get('login_form_data') ? handleStar : false, // 登录后才显示收藏等按钮,
    onLoadingMore: handleLoadingMore,
    loading: loading.models.Subject,
  };
  return <List {...listProps} />;
};
QuestionList.propTypes = {
  questionBySubject: PropTypes.array,
  questionBySubjectCurrentPage: PropTypes.number,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  handleStar: PropTypes.func,
};

const NewQuestionList = SubjectOperationConnect()(QuestionList);

function mapStateToProps(state) {
  return {
    ...state.present.Subject,
    loading: state.present.loading,
  };
}
export default connect(mapStateToProps)(NewQuestionList);
