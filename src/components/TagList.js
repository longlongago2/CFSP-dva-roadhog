import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import QueueAnimation from 'rc-queue-anim';
import styles from './TagList.less';

const TagList = ({ tag, loading }) =>
  <QueueAnimation component="ul" className={styles.tagCloud}>
    {
      tag && tag.length > 0 && !loading ?
        tag.slice(0, 15).map(item =>
          <li key={item.tagcode}>
            <a>{item.tagname}</a>
          </li>) : <div className={styles.loading}><Spin size="default" /></div>
    }
  </QueueAnimation>;

TagList.propTypes = {
  tag: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default TagList;
