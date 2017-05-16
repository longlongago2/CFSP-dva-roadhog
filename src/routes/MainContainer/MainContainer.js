import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackTop, Icon } from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { parse } from 'qs';
import $ from 'jquery';
import styles from './MainContainer.less';
import LoginModal from '../../components/LoginModal';
import MenuAffix from '../../components/Menu';
import Banner from '../../components/Banner';
import Footer from '../../components/Footer';

class IndexPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    children: PropTypes.object,
    location: PropTypes.object,
    banner: PropTypes.array,
    user: PropTypes.object,
    loading: PropTypes.object,
    login: PropTypes.bool,
    modalVisible: PropTypes.bool,
    menu: PropTypes.object,
    newMessage: PropTypes.number,
    subject: PropTypes.array,
    capsLock: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      loginFormVisible: props.modalVisible,
    };
    this.handleLoginCancel = this.handleLoginCancel.bind(this);
    this.handleLoginOk = this.handleLoginOk.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleBlurMotto = this.handleBlurMotto.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.loginKeyEventListener = this.loginKeyEventListener.bind(this);
    this.bindKeyPressCapsLock = this.bindKeyPressCapsLock.bind(this);
  }

  componentDidMount() {
    // Bind keyboard events for Login
    document.addEventListener('keydown', this.loginKeyEventListener);
  }

  componentWillReceiveProps(nextProps) {
    // 组件自己维护modalVisible,便于组件在componentDidMount中实时获取当前登录框显示状态
    if (this.props.modalVisible !== nextProps.modalVisible) {
      this.setState({ loginFormVisible: nextProps.modalVisible });
    }
  }

  handleLoginOk(data) {
    const { dispatch } = this.props;
    dispatch({
      type: 'User/login',
      payload: {
        ...data
      }
    });
  }

  handleLoginCancel() {
    const { dispatch } = this.props;
    dispatch({ type: 'User/hideModal' });
  }

  handleShowModal() {
    const { dispatch } = this.props;
    dispatch({ type: 'User/showModal' });
  }

  handleBlurMotto(e) {
    $(e.target).hide();
    $(e.target).prev('button').show();
    const { dispatch } = this.props;
    const userId = parse(Cookie.get('user')).userid;
    dispatch({
      type: 'User/updateMotto',
      payload: {
        userid: userId,
        description: e.target.value
      }
    });
  }

  handleLogout() {
    const { dispatch } = this.props;
    dispatch({
      type: 'User/logout'
    });
  }

  loginKeyEventListener(e) {
    const { loginFormVisible } = this.state;
    if (loginFormVisible && e.keyCode === 13) {
      $('#btnLogin').focus();
    }
  }

  bindKeyPressCapsLock(event) {
    const { dispatch } = this.props;
    const e = event || window.event;
    const keyCode = e.keyCode || e.which;
    const isShift = e.shiftKey || (keyCode === 16) || false;
    if (((keyCode >= 65 && keyCode <= 90) && !isShift) ||
      ((keyCode >= 97 && keyCode <= 122) && isShift)) {
      dispatch({
        type: 'User/onOffCapsLock',
        payload: {
          capsLock: true
        }
      });
    } else {
      dispatch({
        type: 'User/onOffCapsLock',
        payload: {
          capsLock: false
        }
      });
    }
  }

  render() {
    const {
      children,
      location,
      loading,
      banner,
      subject,
      user,
      login,
      modalVisible,
      menu,
      newMessage,
      capsLock,
    } = this.props;

    const currentRoute = location.pathname.split('/')[1];

    const bannerProps = {
      banner,
      visible: !currentRoute || currentRoute === 'home',
    };

    const menuAffixProps = {
      menu,
      login,
      user,
      newMessage,
      subject,
      onShowModal: this.handleShowModal,
      onEditMotto(e) {
        $(e.target).hide();
        $(e.target).next('input').show()
          .focus()
          .select();
      },
      onBlurMotto: this.handleBlurMotto,
      onEnterMotto(e) {
        if (e.keyCode === 13) {
          $(e.target).blur();
        }
      },
      onLogout: this.handleLogout,
      loading: loading.models.User
    };

    const loginModalProps = {
      visible: modalVisible,
      loading: loading.models.User,
      onOk: this.handleLoginOk,
      onCancel: this.handleLoginCancel,
      bindKeyPress: this.bindKeyPressCapsLock,
      capsLock,
    };

    return (
      <div className={styles.container}>
        <Banner {...bannerProps} />
        <MenuAffix {...menuAffixProps} />
        <LoginModal {...loginModalProps} />
        <div className={styles.children}>
          <div className={styles.childrenContent}>
            {children}
          </div>
        </div>
        <BackTop>
          <div className={styles.backTopInner} title="回到顶部">
            <Icon type="to-top" />
          </div>
        </BackTop>
        <Footer />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    ...state.present.User,
    ...state.present.Subject,
    loading: state.present.loading
  };
}
export default connect(mapStateToProps)(IndexPage);
