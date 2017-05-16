import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Button, Affix, message } from 'antd';
import styles from './IndexPage.less';
import SubjectList from '../../components/SubjectList';
import QuestionList from '../../components/QuestionList';
import TagList from '../../components/TagList';

class IndexPage extends Component {
  static propTypes = {
    loading: PropTypes.object,
    subject: PropTypes.array,
    showAll: PropTypes.oneOfType([ PropTypes.bool, PropTypes.number ]).isRequired,
    question: PropTypes.array,
    tag: PropTypes.array,
    questionsCurrentPage: PropTypes.number,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleSubjectShowAll = this.handleSubjectShowAll.bind(this);
    this.handleRefreshQuestion = this.handleRefreshQuestion.bind(this);
    this.handleLoadingMore = this.handleLoadingMore.bind(this);
  }

  handleSubjectShowAll() {
    const { dispatch, showAll } = this.props;
    dispatch({
      type: 'Subject/updateTemporaryState',
      payload: {
        showAll: !showAll
      }
    });
  }

  handleRefreshQuestion() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Question/queryQuestion',
      payload: {
        pageNumber: 0 // 默认初始数据为第一页
      }
    });
  }

  handleLoadingMore(currentPage) {
    message.info(`第${currentPage + 2}页，努力加载中…`);
    const { dispatch } = this.props;
    dispatch({
      type: 'Question/pageDemanding',
      payload: {
        pageNumber: currentPage + 1,
      }
    });
  }

  render() {
    const { loading, subject, showAll, question, questionsCurrentPage, tag } = this.props;
    const subjectListProps = {
      subject,
      loading: loading.models.Subject,
      showAll,
    };
    const questionListProps = {
      question,
      showSubject: true,
      questionsCurrentPage,
      loading: loading.models.Question,
      onStar: false,
      onLoadingMore: this.handleLoadingMore,
    };
    const tagListProps = {
      tag,
      loading: loading.models.Tag,
    };
    return (
      <Row type="flex" justify="center" align="top" >
        <Col span={18} >
          <div className={styles.leftModule} >
            <div className={styles.board} >
              <div className={styles.headline} >
                <div className={styles.left} >专题列表</div>
                <div className={styles.right} >
                  <Button
                    type="ghost"
                    size="small"
                    onClick={this.handleSubjectShowAll}
                  >
                    {showAll === true ? '缩略' : '全部'}
                  </Button>
                </div>
              </div>
              <SubjectList {...subjectListProps} />
            </div>
            <div className={styles.board} >
              <div className={styles.headline} >
                <div className={styles.left} >最新问题</div>
                <div className={styles.right} >
                  <Button type="ghost" size="small" onClick={this.handleRefreshQuestion} >刷新</Button>
                </div>
              </div>
              <QuestionList {...questionListProps} />
            </div>
          </div>
        </Col>
        <Col span={6} >
          <Affix offsetTop={50} >
            <div className={styles.rightModule} >
              <div className={styles.board} >
                <div className={styles.headline} >
                  <div className={styles.left} >&nbsp;提&nbsp;问&nbsp;</div>
                </div>
                <div className={styles.longBtn} >
                  <Link to="/ask/0" >
                    <Button type="primary" size="large" >我要提问</Button>
                  </Link>
                </div>
                <p>
                  <a>知识库常见问题</a>
                </p>
              </div>
              <div className={styles.board} >
                <div className={styles.headline} >
                  <div className={styles.left} >&nbsp;回&nbsp;答&nbsp;</div>
                </div>
                <div className={styles.longBtn} >
                  <Button type="primary" size="large" >我要回答</Button>
                </div>
              </div>
              <div className={styles.board} >
                <div className={styles.headline} >
                  <div className={styles.left} >&nbsp;标签云&nbsp;</div>
                  <div className={styles.right} >
                    <Button type="ghost" size="small" >更多</Button>
                  </div>
                </div>
                <TagList {...tagListProps} />
              </div>
            </div>
          </Affix>
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.present.Subject,
    ...state.present.Question,
    ...state.present.Tag,
    loading: state.present.loading
  };
}

export default connect(mapStateToProps)(IndexPage);
