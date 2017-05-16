import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Spin } from 'antd';
import { Link } from 'dva/router';
import styles from './Sidebar.less';

const SubMenu = Menu.SubMenu;

const Sidebar = ({ params, subject, loading }) => {
  const firstSubject = subject && subject.length > 0 ? subject[0].knowledgerepositorycode : '';
  return (
    <Menu
      defaultOpenKeys={['sub1']}
      selectedKeys={[
        params.subjectCode == 0 ? firstSubject : params.subjectCode
      ]}
      mode="inline"
      className={styles.sidebar}
    >
      <SubMenu key="sub1" title={<span><Icon type="appstore" /><span>专题导航</span></span>}>
        {
          subject && subject.length > 0 ?
            subject.map(item =>
              <Menu.Item key={item.knowledgerepositorycode}>
                <Link to={`/subject/${item.knowledgerepositorycode}`}>
                  {item.knowledgerepositoryname}
                </Link>
              </Menu.Item>) : <Menu.Item key="sidebarLoading" className={styles.loading}><Spin /></Menu.Item>
        }
      </SubMenu>
      <SubMenu key="sub2" title={<span><Icon type="star" /><span>收藏专题</span></span>}>
        <Menu.Item key="1">暂未开放</Menu.Item>
      </SubMenu>
    </Menu>
  );
};

Sidebar.propTypes = {
  loading: PropTypes.object,
  subject: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
};

export default Sidebar;

