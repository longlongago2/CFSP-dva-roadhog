import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Radio } from 'antd';
import { connect } from 'dva';
import QueueAnimation from 'rc-queue-anim';
import styles from './Index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const QuestionSubject = ({ location, children, dispatch }) => {
  function link(route) {
    dispatch({
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: `/questionSubmit/${route}`,
        key: 'ibfke2',
        search: '',
        hash: ''
      }
    });
  }

  return (
    <Row type="flex" justify="center" className={styles.board} style={{ minHeight: 900 }} >
      <Col span={18} >
        <div className={styles.editPanel} >
          <div className={styles.headline} >
            <div className={styles.left} >
              <Icon type="edit" /> 撰写&nbsp;
            </div>
            <div className={styles.right} >
              <RadioGroup defaultValue={location.pathname === '/questionSubmit/workOrder' ? 'b' : 'a'} size="small" >
                <RadioButton value="a" onClick={() => link('question')} >发布提问</RadioButton>
                <RadioButton value="b" onClick={() => link('workOrder')} >提交工单</RadioButton>
              </RadioGroup>
            </div>
          </div>
          <div className={styles.children} >
            {children}
          </div>
        </div>
      </Col>
      <Col span={6} >
        {
          location.pathname === '/questionSubmit/workOrder' ?
            <div className={styles.tipPanel} >
              <h2>提交工单指南</h2>
              <QueueAnimation component="ul" leaveReverse >
                <li key="WOT1" ><b>· 工单主题：</b>请用准确的语言描写您的工单主题，字数控制在50字以内。</li>
                <li key="WOT2" ><b>· 工单内容：</b>详细补充您的问题内容，并提供一些相关的素材以提供参与者更多的了解您的问题所要表达的主题思想和问题。可以上传图片和附件</li>
                <li key="WOT3" ><b>· 工单类型：</b>选择工单类型让您的问题有合适的归类，方便后台人员可以根据类型快速的定位问题并给出解决方案！</li>
                <li key="WOT4" ><b>· 问题种类：</b>选择问题种类让您的问题有合适的归类，方便后台人员可以根据类型快速的定位问题并给出解决方案！</li>
                <li key="WOT5" ><b>· 所述产品：</b>您描述的问题是属于什么产品，后台工程师根据产品类型分配工作</li>
              </QueueAnimation>
            </div> :
            <div className={styles.tipPanel} >
              <h2>发布问题指南</h2>
              <ul>
                <li><b>· 填写标题：</b>请用准确的语言描写您的问题主题，字数控制在50字以内。</li>
                <li><b>· 填写内容：</b>详细补充您的问题内容，并提供一些相关的素材以提供参与者更多的了解您的问题所要表达的主题思想和问题。</li>
                <li><b>· 选择专题：</b>选择专题让您的问题有合适的归类，方便参与者可以根据类型快速的找到您的问题！</li>
                <li><b>· 添加标签：</b>选择一个或多个合适的标签，让您的问题可以让更多的人快速的检索到并参与其中。</li>
              </ul>
            </div>
        }
      </Col>
    </Row>
  );
};
QuestionSubject.propTypes = {
  location: PropTypes.object,
  children: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(QuestionSubject);
