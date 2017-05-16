import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { parse } from 'qs';
import Cookie from 'js-cookie';
import globalStyles from '../index.less';
import styles from './SubjectPanel.less';

/**
 * 专题简介面板
 * @param subjectDetail [array:专题详情数据]
 * @param onStar        [func||bool:当值为false时，收藏等按钮不加载，当值为function类型时加载收藏等按钮]
 * @param loading       [bool:是否正在加载中]
 * @return {*}
 * @constructor
 */
const SubjectPanel = ({ subjectDetail, onStar, loading }) => {
  const currentUserId = parse(Cookie.get('user')).userid;
  return subjectDetail.collectinfo && subjectDetail.collectinfo.length > 0 ?
    <div>
      <div className={globalStyles.headline}>
        <div className={globalStyles.left}>{subjectDetail.knowledgerepositoryname}</div>
        {
          onStar && typeof onStar === 'function' ?
            <div className={globalStyles.right}>
              {
                subjectDetail.collectinfo.filter(item =>
                item.collectuserid == currentUserId).length > 0 ?
                  <a
                    onClick={() => {
                      onStar(subjectDetail.knowledgerepositorycode, subjectDetail.knowledgerepositoryname, 0, '2');
                    }}
                  ><Icon type="star" /> 取消收藏 </a>
                  :
                  <a
                    onClick={() => {
                      onStar(subjectDetail.knowledgerepositorycode, subjectDetail.knowledgerepositoryname, 1, '2');
                    }}
                  ><Icon type="star-o" /> 收藏 </a>
              }
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a><Icon type="eye-o" /> 订阅 </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a><Icon type="edit" /> 提问 </a>
            </div> :
            null
        }
      </div>
      <div className={styles.introduction}>
        <div className={styles.introImg}>
          <img
            src={subjectDetail.imgpath}
            width={200} height={200}
            alt={subjectDetail.knowledgerepositoryname}
            title={subjectDetail.knowledgerepositoryname}
          />
        </div>
        <div className={styles.introTxt}>
          <div className={styles.top}>
            {subjectDetail.knowledgerepositorymessage}
          </div>
          <div className={styles.bottom}>
            <a><i className="fa fa-share-alt"> 分享 </i></a>
            <span style={{ float: 'right' }}>
              {`${subjectDetail.bereadnum}次浏览·${subjectDetail.collectinfo.length}人收藏·55人订阅·${subjectDetail.createtime}`}
            </span>
          </div>
        </div>
      </div>
    </div> : null
    ;
};
SubjectPanel.propTypes = {
  subjectDetail: PropTypes.object.isRequired,
  onStar: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).isRequired,
  loading: PropTypes.object,
};
export default SubjectPanel;
