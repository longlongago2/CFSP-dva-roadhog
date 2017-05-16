import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { Spin } from 'antd';
import styles from './SimpleSideBar.less';

class SimpleSideBar extends Component {
  static defaultProps = {
    dataDimension: {
      key: 'key',
      text: 'text'
    }, // 匹配数据源的键值对
    route: '/ask'
  };
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    dataDimension: PropTypes.object.isRequired,
    defaultActiveKey: PropTypes.string,
    route: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    this.state = {
      activeKey: this.props.defaultActiveKey // default state
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultActiveKey !== nextProps.defaultActiveKey) {
      this.setState({
        activeKey: nextProps.defaultActiveKey
      });
    }
  }

  handleActive(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    const { dataSource, dataDimension, route } = this.props;
    return (
      <ul className={styles.recommendationGroup}>
        {
          dataSource && dataSource.length > 0 ?
            dataSource.map(item =>
              <li
                key={item[dataDimension.key]}
                onClick={() => this.handleActive(item[dataDimension.key])}
              >
                <Link
                  to={(() => {
                    if (route.params && route.params.length > 0) {
                      let url = route.pathname;
                      route.params.forEach((param) => {
                        url += `/${item[param]}`;
                      });
                      return url;
                    }
                    return `${route.pathname}`;
                  })()}
                  className={
                    this.state.activeKey === item[dataDimension.key] ? styles.active : null
                  }
                >
                  <em>{item[dataDimension.text]}</em>
                </Link>
              </li>) : <div style={{ textAlign: 'center', padding: 10 }}><Spin /></div>
        }
      </ul>
    );
  }
}

export default SimpleSideBar;
