import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon, Button, Affix, Popover, Badge, Input } from 'antd';
import { Link } from 'dva/router';
import styles from './Menu.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Divider = Menu.Divider;
const Search = Input.Search;

const MenuAffix = ({
                     menu,
                     login,
                     user,
                     newMessage,
                     subject,
                     onShowModal,
                     onEditMotto,
                     onBlurMotto,
                     onEnterMotto,
                     onLogout,
                     loading
                   }) => {
  const userContent = (
    <div className={styles.userInfoPanel}>
      <div className={styles.panelBg} />
      <div className={styles.panelLogo}>
        <img
          src={
            user.avatar && user.avatar.trim() !== '' ?
              user.avatar : require('../assets/avatar_default.png')
          }
          title={user.username}
          alt={user.username}
        />
      </div>
      <div className={styles.panelUsername}>
        {user.username}
      </div>
      <div className={styles.panelMotto}>
        {
          loading ?
            (() =>
              <Badge status="processing" text="正在处理..." />)() :
            (() =>
              <div>
                <button
                  title="点击重新编辑"
                  onClick={onEditMotto}
                >
                  {user.description && user.description.trim() !== '' ? user.description : '[请编辑您的个性签名]'}
                </button>
                <Input
                  className={styles.hidden}
                  title="按Enter键保存"
                  type="text"
                  onBlur={onBlurMotto}
                  onKeyDown={onEnterMotto}
                  defaultValue={user.description && user.description.trim() !== '' ? user.description : '[请编辑您的个性签名]'}
                />
              </div>)()
        }
      </div>
      <div className={styles.panelOption}>
        <ul>
          <li><a title="私信"><Icon type="mail" /></a></li>
          <li><a title="我的收藏"><Icon type="star-o" /></a></li>
          <li><a title="账号设置"><Icon type="setting" /></a></li>
          <li><a title="退出" onClick={onLogout}><Icon type="logout" /></a></li>
        </ul>
      </div>
    </div>
  );
  const messageContent = (
    <div className={styles.messagePanel}>
      {
        newMessage && newMessage > 0 ?
          <a>您有{newMessage}条未查看消息！</a>
          : <p>暂无新消息！</p>
      }
    </div>
  );
  return (
    <Affix>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={menu.defaultSelectedKeys}
        selectedKeys={menu.selectedKeys}
        className={styles.navBar}
      >
        <Menu.Item key="home">
          <Link to="/home">
            <Icon type="home" />首 页
          </Link>
        </Menu.Item>
        <SubMenu title={<span><Icon type="appstore" />专 题</span>}>
          <Menu.Item key="subject">
            <Link to={`/subject/${subject && subject.length > 0 ? subject[0].knowledgerepositorycode : 0}`}>
              所有专题
            </Link>
          </Menu.Item>
          <Divider />
          <MenuItemGroup title={<span><Icon type="question-circle" /> 有疑问 </span>}>
            <Menu.Item key="ask">
              <Link to={`/ask/${subject && subject.length > 0 ? subject[0].knowledgerepositorycode : 0}`}>
                我要提问
              </Link>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title={<span><Icon type="info-circle" /> 有学问 </span>}>
            <Menu.Item key="reply">
              <Link to="/reply">
                我要回答
              </Link>
            </Menu.Item>
          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key="blog">
          <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
            <Icon type="solution" />论 坛
          </a>
        </Menu.Item>
        <Menu.Item key="FAQ">
          <Link to="/FAQ">
            <Icon type="book" />知识库
          </Link>
        </Menu.Item>
        <Menu.Item key="center">
          <Link to="/center">
            <Icon type="laptop" />后 院
          </Link>
        </Menu.Item>
        {
          login ?
            (() =>
              <Menu.Item key="user" className={styles.user}>
                <Popover
                  content={userContent}
                  trigger="hover"
                  placement="bottomLeft"
                  arrowPointAtCenter
                >
                  <div className={styles.avatar}>
                    <img
                      src={
                        user.avatar && user.avatar.trim() !== '' ?
                          user.avatar :
                          require('../assets/avatar_default.png')
                      }
                      title={user.username}
                      alt="用户头像"
                    />
                  </div>
                </Popover>
              </Menu.Item>)() :
            (() =>
              <Menu.Item key="login" style={{ float: 'right' }}>
                <Button type="primary" onClick={onShowModal}>
                  登录 / 注册
                </Button>
              </Menu.Item>)()
        }
        {
          login ?
            (() =>
              <Menu.Item key="message" className={styles.message}>
                <Popover
                  content={messageContent}
                  title="消息提醒"
                  trigger="hover"
                  placement="bottomRight"
                  arrowPointAtCenter
                >
                  <a>
                    <i className="fa fa-bell-o" style={{ fontSize: 18, verticalAlign: 'middle' }} />
                    <Badge className={styles.badge} dot={newMessage > 0}>&nbsp;</Badge>
                  </a>
                </Popover>
              </Menu.Item>)() : null
        }
        <Menu.Item className={styles.search}>
          <Search
            placeholder="关键字搜索"
            onSearch={value => console.log(value)}
          />
        </Menu.Item>
      </Menu>
    </Affix>
  );
};

MenuAffix.propTypes = {
  menu: PropTypes.object.isRequired,
  login: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  newMessage: PropTypes.number.isRequired,
  subject: PropTypes.array.isRequired,
  onShowModal: PropTypes.func.isRequired,
  onEditMotto: PropTypes.func.isRequired,
  onBlurMotto: PropTypes.func.isRequired,
  onEnterMotto: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MenuAffix;
