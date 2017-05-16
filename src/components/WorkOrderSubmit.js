import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import styles from './WorkOrderSubmit.less';

const FormItem = Form.Item;

const WorkOrderSubmit = ({
                           form: {
                             getFieldDecorator,
                             validateFields,
                             getFieldsValue,
                             resetFields
                           },
                         }) => {
  const formItemLayout = {
    wrapperCol: {
      span: 16,
    },
    labelCol: {
      span: 5,
    }
  };
  return (
    <Form layout="horizontal">
      <FormItem label={<a>工单主题</a>} hasFeedback {...formItemLayout}>
        {
          getFieldDecorator('WOTitle', {
            rules: [{ required: true, message: '请正确填写工单主题！' }],
          })(<Input />)
        }
      </FormItem>
      <FormItem label={<a>工单类型</a>} hasFeedback {...formItemLayout}>
        {
          getFieldDecorator('WOType', {
            rules: [{ required: true, message: '请正确填写工单类型！' }],
          })(<Input />)
        }
      </FormItem>
      <FormItem label={<a>服务种类</a>} hasFeedback {...formItemLayout}>
        {
          getFieldDecorator('WOKind', {
            rules: [{ required: true, message: '请正确填写服务种类！' }],
          })(<Input />)
        }
      </FormItem>
      <FormItem label={<a>所述产品</a>} hasFeedback {...formItemLayout}>
        {
          getFieldDecorator('WOPro', {
            rules: [{ required: true, message: '请正确填写所述产品！' }],
          })(<Input />)
        }
      </FormItem>
    </Form>
  );
};
WorkOrderSubmit.propTypes = {
  form: PropTypes.object.isRequired,
};
export default Form.create()(WorkOrderSubmit);
