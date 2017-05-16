import React, { Component } from 'react';
import $ from 'jquery';

/**
 * 高阶组件：使得 li 模块始终居中，适用模式：<div><li/><li/></div>
 * @param elm：包含li的父元素
 * @param liWidth：li长度（包括margin,padding,border）
 * @return newComponent
 */
export default function centerLi(elm, liWidth) {
  if (!elm || !liWidth) {
    const error = { text: '高阶组件报错：centerLi(elm,liWidth),elm或liWidth 参数不存在！', componentType: 'HOC' };
    throw error.text;
  }
  return Comp =>
    class CenterLi extends Component {
      constructor(props) {
        super(props);
      }

      componentDidMount() {
        $(document).ready(() => {
          const subject = $(elm);
          const center = () => {
            subject.css({ padding: '0' });
            const subjectWidth = subject.width();
            const liNum = parseInt(subjectWidth / liWidth, 0);
            const ALineLiWidth = liWidth * liNum; // 一行 li 的总长度
            const subjectPadding = parseFloat(subjectWidth - ALineLiWidth) * 0.5;
            subject.css({ paddingLeft: subjectPadding, paddingRight: subjectPadding });
          };
          center();
          $(window).resize(() => {
            center();
          });
        });
      }

      render() {
        const props = this.props;
        return <Comp {...props} />;
      }
    };
}

