import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Popover, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './CollectionList.less';
import centerLi from '../HOCs/CenterLi';

const CollectionList = ({ collect, loading, onLoadingMore }) =>
  <QueueAnim component="ul" id="collectContainer" className={styles.collectContainer} type="bottom" leaveReverse>
    { loading ? <div><Spin /></div> : null }
    {
      collect && collect.length > 0 ?
        collect.map(item =>
          <li key={item.collectcode}>
            <Popover
              title="用户信息"
              content={
                <div className={styles.popBody}>
                  <p title={item.userinfo.username}>
                    账号：{item.userinfo.username}
                  </p>
                  <p title={item.userinfo.description}>
                    签名：{item.userinfo.description}
                  </p>
                  <p title={item.userinfo.email}>
                    邮箱：{item.userinfo.email}
                  </p>
                  <p><a>查看Ta的空间</a></p>
                </div>
              }
            >
              <div className={styles.img}>
                <img
                  height={70} width={70}
                  src={item.userinfo.avatar}
                  title={item.userinfo.username}
                  alt={item.userinfo.username}
                />
              </div>
            </Popover>
            <div className={styles.text}>
              <a>{item.userinfo.username}</a>
            </div>
          </li>) : <div>{collect && collect.length === 0 && !loading ? '无数据' : null}</div>
    }
    <li key="collectLoadingMore">
      <div className={styles.loadingMore} onClick={onLoadingMore}>
        {loading ? <Icon type="loading" /> : <Icon type="ellipsis" />}
      </div>
      <div className={styles.text}><a>加载更多...</a></div>
    </li>
  </QueueAnim>;

CollectionList.propTypes = {
  collect: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onLoadingMore: PropTypes.func.isRequired,
};

export default centerLi('#collectContainer', 110)(CollectionList);
