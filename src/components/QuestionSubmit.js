import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { RichEditor } from 'cf-rich-editor';
import 'cf-rich-editor/dist/CFRichEditor.min.css';
import styles from './QuestionSubmit.less';

const FormItem = Form.Item;

const QuestionSubmit = ({
                          form: {
                            getFieldDecorator,
                            validateFields,
                            getFieldsValue,
                            resetFields
                          },
                          onChange,
                          onImageUpload,
                          sniffer
                        }) => {
  const formItemLayout = {
    labelCol: {
      span: 22,
      offset: 1,
      style: {
        textAlign: 'left'
      }
    },
    wrapperCol: {
      span: 22,
      offset: 1,
    },
    colon: false
  };
  const sessionKey = window.location.href.split('?')[0]; // session名称
  const rowContentStorage = sessionStorage.getItem(sessionKey);
  const richEditorProps = {
    onChange,
    sniffer,
    onImageUpload,
    importHtml: false,
    initialRawContent: JSON.parse(rowContentStorage),
  };
  return (
    <div>
      <Form>
        <FormItem label={<a className={styles.labelTitle}>标题</a>} {...formItemLayout} hasFeedback>
          {
            getFieldDecorator('FAQTitle', {
              rules: [{ required: true, message: '请正确填写标题！' }],
            })(<Input />)
          }
        </FormItem>
        <FormItem label={<a className={styles.labelTitle}>内容</a>} {...formItemLayout}>
          {
            getFieldDecorator('FAQMessage', {
              rules: [{ required: true }],
            })(<RichEditor {...richEditorProps} />)
          }
        </FormItem>
      </Form>
    </div>
  );
};
QuestionSubmit.propTypes = {
  form: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  sniffer: PropTypes.object.isRequired,
};
export default Form.create()(QuestionSubmit);
