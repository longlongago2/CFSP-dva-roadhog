import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import QueueAnimation from 'rc-queue-anim';
import styles from './SubjectList.less';
import centerLi from '../HOCs/CenterLi';

const SubjectList = ({ subject, loading, showAll }) => {
  const showList = showAll ? subject.slice(0, showAll === true ? subject.length : showAll) :
    subject.slice(0, 6); // true：全部显示；false：默认显示前6条数据；数字：显示该数字的条数
  return (
    <div className={styles.subject} id="subjectModule">
      <QueueAnimation component="ul" leaveReverse>
        {
          showList && showList.length > 0 && !loading ?
            showList.map(item =>
              <li key={item.knowledgerepositorycode}>
                <a href={`#/subject/${item.knowledgerepositorycode}`} target="view_window">
                  <img
                    src={item.imgpath}
                    alt={item.knowledgerepositoryname}
                    title={item.knowledgerepositoryname}
                  />
                </a>
                <div className={styles.subjectBottom} />
                <div className={styles.subjectBottomText}>
                  {item.knowledgerepositoryname}
                </div>
              </li>) :
            <div className={styles.loading}><Spin size="large" /></div>
        }
      </QueueAnimation>
    </div>
  );
};

SubjectList.propTypes = {
  subject: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  showAll: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
};

export default centerLi('#subjectModule', 220)(SubjectList);
