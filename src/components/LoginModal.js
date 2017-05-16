import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Icon, Button, Checkbox, Tooltip } from 'antd';
import styles from './LoginModal.less';

const FormItem = Form.Item;
const LoginModal = ({
  visible, loading, onOk, onCancel, bindKeyPress, capsLock, form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
  resetFields,
}
}) => {
  function submit() {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = { ...getFieldsValue() }; // 新增对象数据
      onOk(data);
    });
  }

  function afterClose() {
    resetFields(); // 重置表单数据
  }

  const modalOpts = {
    title: '欢迎来到才丰服务平台，请登录！',
    width: 600,
    visible,
    onCancel,
    afterClose,
    footer: [
      <Button
        id="btnLogin" key="submit"
        type="primary" size="large"
        style={{ width: 120, marginRight: 20 }}
        loading={loading} onClick={submit}
      >
        登录
      </Button>,
      <Button key="cancel" type="ghost" size="large" onClick={onCancel}>
        取消
      </Button>,
    ]
  };

  return (
    <Modal {...modalOpts} >
      <Form layout="vertical" className={styles.loginForm}>
        <FormItem>
          {
            getFieldDecorator('userName', {
              rules: [
                { required: true, message: '请您填写登录账号！' },
              ],
            })(<Input type="text" size="large" prefix={<Icon type="user" />} placeholder="账号" />)
          }
        </FormItem>
        <FormItem>
          <Tooltip placement="right" title="您已开启大写锁定" trigger="focus" visible={capsLock && visible}>
            {
              getFieldDecorator('passWord', {
                rules: [
                  { required: true, message: '请您输入密码！' },
                ],
              })(
                <Input
                  type="password"
                  size="large"
                  prefix={<Icon type="lock" />}
                  placeholder="密码"
                  onKeyPress={bindKeyPress}
                />
              )
            }
          </Tooltip>
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>7天内自动登录</Checkbox>)
          }
          <a className={styles.forget}>忘记密码？</a>
        </FormItem>
        <div className={styles.register}>还没有账户？<a>新用户注册</a></div>
      </Form>
    </Modal>
  );
};

LoginModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  bindKeyPress: PropTypes.func.isRequired,
  capsLock: PropTypes.bool.isRequired,
  form: PropTypes.object
};

// Form.create() 包装过的组件会传入 form: { getFieldDecorator, validateFields,getFieldsValue } 属性
export default Form.create()(LoginModal);
