import React from 'react';
import PropTypes from 'prop-types';
import { Button, Spin } from 'antd';
import { Link } from 'dva/router';
import QueueAnimation from 'rc-queue-anim';
import styles from './Recommendation.less';

const Recommendation = ({ repository, loading }) => {
  return (
    <div className={styles.recommendationInfo} >
      <h2>{`系统为您推荐${repository.length}条知识库常见问题，可能包含您遇到的问题：`}</h2>
      {loading ? <div style={{ padding: 20, textAlign: 'center' }} ><Spin /></div> : null}
      <QueueAnimation component="ul" type="left" >
        {
          repository && repository.length > 0 ?
            repository.map((item, i) => {
              return (
                <li key={item.knowledgerepositorycode} >{`${i + 1}、`}<a>{item.faqtitle}</a></li>
              );
            }) :
            <li key="noData" >{repository && repository.length == 0 ? '无数据' : null}</li>
        }
        <li key="loadingMore" >{repository && !loading ? <a>查看更多...</a> : null}</li>
      </QueueAnimation>
      <p style={{ textAlign: 'left' }} >
        没有找到您需要的知识：
      </p>
      <p>
        <Link to="/questionSubmit" >
          <Button type="primary" size="large" style={{ width: 200 }} >我要提问</Button>
        </Link>
      </p>
    </div>
  );
};
Recommendation.propTypes = {
  repository: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default Recommendation;
