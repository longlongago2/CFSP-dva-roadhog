import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import request from 'cf-rich-editor/lib/Utils/request';
import Submit from '../../components/QuestionSubmit';

const QuestionSubmit = ({ dispatch, subject, tag }) => {
  function handleRichEditorChange(editorValue) {
    // console.log(editorValue);
    // dispatch();
  }

  function handleImageUpload(file) {
    const fileData = new FormData();
    fileData.append('fileDataFileName', file); // 后台接收的参数名（模拟 form 下 input[type='file'] 的 name）
    return request('http://192.168.1.245:8080/CFSP/workorders/uploadPicByFile', {
      method: 'POST',
      body: fileData
    });
  }

  const submitProps = {
    onImageUpload: handleImageUpload, // 上传图片
    onChange: handleRichEditorChange,
    sniffer: { check: true, url: 'http://192.168.1.245:8080/CFSP/web/checkUrl', param: 'urlStr' } // 网址嗅探
  };
  return (
    <div>
      <Submit {...submitProps} />
    </div>
  );
};
QuestionSubmit.propTypes = {
  subject: PropTypes.array,
  tag: PropTypes.array,
  dispatch: PropTypes.func
};
function mapStateToProps(state) {
  return {
    ...state.present.Subject,
    ...state.present.Tag,
  };
}
export default connect(mapStateToProps)(QuestionSubmit);
