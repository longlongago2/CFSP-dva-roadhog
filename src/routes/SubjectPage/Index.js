import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Radio } from 'antd';
import Cookie from 'js-cookie';
import styles from './Index.less';
import Sidebar from '../../components/Sidebar';
import SubjectPanel from '../../components/SubjectPanel';
import subjectOperationConnect from '../../HOCs/SubjectConnect';

// location,params 是 react-router 连接的参数
const SubjectPage = ({
                       location,
                       params,
                       dispatch,
                       children,
                       subject,
                       subjectDetail,
                       loading,
                       handleStar,
                     }) => {
  function link(route) {
    const subjectCode = params.subjectCode;
    dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: `/subject/${subjectCode}/${route}`,
        key: 'ibfke1',
        search: '',
        hash: ''
      }
    });
  }

  const sidebarProps = {
    subject,
    params,
    loading,
  };
  const subjectPanel = {
    subjectDetail,
    onStar: Cookie.get('login_form_data') ? handleStar : false, // 登录后才显示收藏等按钮
    loading,
  };
  return (
    <Row type="flex" justify="center" className={styles.subjectPage}>
      <Col span={5}>
        <div className={styles.board} style={{ padding: 0, textAlign: 'left' }}>
          <Sidebar {...sidebarProps} />
        </div>
      </Col>
      <Col span={19}>
        <div className={styles.board} style={{ minHeight: 1000 }}>
          <SubjectPanel {...subjectPanel} />
          <div className={styles.tabBar}>
            <Radio.Group
              style={{ maxWidth: '450px' }}
              size="large"
              value={location.pathname.split('/')[3] ? location.pathname.split('/')[3] : 'questions'}
            >
              <Radio.Button
                style={{ width: '150px' }}
                value="questions"
                onClick={() => {
                  link('questions');
                }}
              >
                最新问题
              </Radio.Button>
              <Radio.Button
                style={{ width: '150px' }}
                value="eyes"
                onClick={() => {
                  link('eyes');
                }}
              >
                政策关注
              </Radio.Button>
              <Radio.Button
                style={{ width: '150px' }}
                value="stars"
                onClick={() => {
                  link('stars');
                }}
              >
                {subjectDetail.collectinfo && subjectDetail.collectinfo.length > 0 ? `${subjectDetail.collectinfo.length}人收藏` : '无数据'}
              </Radio.Button>
            </Radio.Group>
          </div>
          <div>{children}</div>
        </div>
      </Col>
    </Row>
  );
};

SubjectPage.propTypes = {
  dispatch: PropTypes.func,
  subject: PropTypes.array,
  subjectDetail: PropTypes.object, // 根据subjectCode 查询的 subject详细信息
  loading: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.object,
  handleStar: PropTypes.func,
};

const NewSubjectPage = subjectOperationConnect()(SubjectPage);

function mapStateToProps(state) {
  return {
    ...state.present.Subject,
    loading: state.present.loading,
  };
}

export default connect(mapStateToProps)(NewSubjectPage);
