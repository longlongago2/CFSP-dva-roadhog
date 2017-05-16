import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Icon, Button } from 'antd';
import Cookie from 'js-cookie';
import { parse } from 'qs';
import QueueAnim from 'rc-queue-anim';
import styles from './QuestionList.less';

/**
 * 常见问题列表
 * @param question             [array:常见问题数据]
 * @param showSubject          [bool:是否显示专题栏目]
 * @param questionsCurrentPage [number:当前页，从0开始计]
 * @param loading              [bool:是否正在加载中]
 * @param onStar               [func||bool:当值为false时，收藏等按钮不加载，当值为function类型时加载收藏等按钮]
 * @param onLoadingMore        [func:加载更多]
 * @return {XML}
 * @constructor
 */
const QuestionList = ({
                        question,
                        showSubject,
                        questionsCurrentPage,
                        loading,
                        onStar,
                        onLoadingMore,
                      }) => {
  const currentUserId = parse(Cookie.get('user')).userid;
  return (
    <div className={styles.questions}>
      {
        question && question.length > 0 && loading ?
          <div className={styles.alwaysLoading}>
            <Spin size="default" />
            <p>正在刷新，请稍候…</p>
          </div> : null
      }
      <QueueAnim type="bottom" leaveReverse>
        {
          question && question.length > 0 ?
            question.map((item, i) =>
              <li key={item.faqcode}>
                <div className={styles.questionLeft}>
                  <div className={styles.leftContent}>
                    <div className={styles.imageInfo}>
                      <img src={require('../assets/avatar_default.png')} alt="头像" />
                    </div>
                  </div>
                </div>
                <div className={styles.questionMiddle}>
                  <div className={styles.middleContent}>
                    <div className={styles.info}>
                      <em>
                        <a
                          className={styles.subjectName}
                          href={`#/subject/${item.knowledgerepositorycode}`}
                          target="view_window"
                        >
                          {
                            item.knowledgerepositoryname && item.knowledgerepositoryname !== '' && showSubject ?
                              item.knowledgerepositoryname : null
                          }
                        </a>
                        <span>
                          {
                            item.knowledgerepositoryname && item.knowledgerepositoryname !== '' && showSubject ?
                              ' | ' : null
                          }
                        </span>
                        <a>{item.faqtitle}</a>
                      </em>
                      <div className={styles.summary}>{item.faqmessage.replace(/<(?:.|\n)*?>/gm, ' ')}</div>
                      <p>
                        {`#${i + 1} ${item.createrpersonname} 发起了提问 · ${item.collectinfo.length}人收藏 · ${item.repliesnum}个回复 · ${item.bereadnum}次浏览 · ${item.createtime}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={onStar && typeof onStar === 'function' ? styles.questionRight : styles.hidden}
                >
                  <p>
                    {
                      item.collectinfo.filter(item =>
                      item.collectuserid == currentUserId).length > 0 ?
                        <a
                          title="取消收藏"
                          onClick={() => {
                            if (onStar && typeof onStar === 'function') {
                              onStar(item.faqcode, item.faqtitle, 0, '1');
                            }
                          }}
                        ><Icon type="star" /></a> :
                        <a
                          title="收藏"
                          onClick={() => {
                            if (onStar && typeof onStar === 'function') {
                              onStar(item.faqcode, item.faqtitle, 1, '1');
                            }
                          }}
                        ><Icon type="star-o" /></a>
                    }
                  </p>
                  <p><a title="回复"><i className="fa fa-reply" /></a></p>
                </div>
              </li>) :
            <div>
              {
                question && question.length === 0 && !loading ? '无数据' : null
              }
            </div>
        }
      </QueueAnim>
      {
        question && question.length > 0 && !loading ?
          <div className={styles.btnLoadingMore}>
            <Button
              shape="circle"
              size="large"
              type="primary"
              icon="down"
              title="加载更多"
              onClick={() => {
                onLoadingMore(questionsCurrentPage);
              }}
            />
          </div> :
          <div className={styles.loading}>
            {question && question.length === 0 && !loading ? null : <Spin />}
          </div>
      }
    </div>
  );
};

QuestionList.propTypes = {
  question: PropTypes.array.isRequired,
  showSubject: PropTypes.bool.isRequired,
  questionsCurrentPage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onStar: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  onLoadingMore: PropTypes.func.isRequired,
};

export default QuestionList;
