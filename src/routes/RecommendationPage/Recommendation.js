import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import styles from './Recommendation.less';
import SimpleSideBar from '../../components/SimpleSideBar';
import Recommendation from '../../components/Recommendation';

const SubmitPage = ({ loading, subject, repository, params }) => {
  const simpleSideProps = {
    dataSource: subject,
    dataDimension: {
      key: 'knowledgerepositorycode',
      text: 'knowledgerepositoryname'
    },
    defaultActiveKey: params.askType,
    route: {
      pathname: '/ask',
      params: [ 'knowledgerepositorycode' ], // rest参数路由：参数名称组成的数组
    }
  };
  const recommendationProps = {
    repository,
    loading: loading.models.Question
  };
  return (
    <Row type="flex" justify="center" >
      <Col span={24} >
        <div className={styles.recommendationTitle} >请准确选择您遇到的问题类型</div>
        <div className={styles.board} style={{ minHeight: 800 }} >
          <Row type="flex" justify="center" className={styles.recommendationContainer} >
            <Col span={6} >
              <SimpleSideBar {...simpleSideProps} />
            </Col>
            <Col span={18} >
              <Recommendation {...recommendationProps} />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};
SubmitPage.propTypes = {
  loading: PropTypes.object,
  subject: PropTypes.array,
  repository: PropTypes.array,
  params: PropTypes.object
};

function mapStateToProps(state) {
  return {
    ...state.present.Subject,
    ...state.present.Question,
    loading: state.present.loading,
  };
}
export default connect(mapStateToProps)(SubmitPage);
