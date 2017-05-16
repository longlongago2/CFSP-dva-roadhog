/**
 * 专题模块的公共业务逻辑
 * 1、收藏/取消收藏动作
 * 2、关注/取消关注动作
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import { parse } from 'qs';

export default function subjectOperationConnect() {
  return Comp =>
    class SubjectOperation extends Component {
      constructor(props) {
        super(props);
        this.handleStar = this.handleStar.bind(this);
      }

      static propTypes = {
        dispatch: PropTypes.func
      };

      /**
       * 收藏或取消收藏
       * @param collectMsgCode  [string:收藏主体的编码]
       * @param collectMsgTitle [string:收藏主体的标题]
       * @param starState       [number:星标状态：1，收藏；2，取消收藏]
       * @param collectType     [string:收藏类型：1，常见问题收藏；2，专题收藏]
       */
      handleStar(collectMsgCode, collectMsgTitle, starState, collectType) {
        const { dispatch } = this.props;
        const collectUserId = parseInt(parse(Cookie.get('user')).userid, 0);
        if (starState == 1) {
          dispatch({
            type: 'Subject/addCollection',
            payload: {
              collectUserId,     // 收藏人userid
              collectType,       // 收藏类型，1:常见问题收藏；2：专题收藏
              collectMsgCode,    // 收藏内容编码
              collectMsgTitle,   // 收藏内容标题
            }
          });
        } else if (starState == 0) {
          dispatch({
            type: 'Subject/removeCollection',
            payload: {
              collectUserId,    // 收藏人userId
              collectType,      // 收藏类型
              collectMsgCode,   // 收藏内容编码
            }
          });
        }
      }

      render() {
        const newProps = {
          ...this.props, // 继承新组件的属性
          handleStar: this.handleStar,
        };
        return <Comp {...newProps} />;
      }
    };
}
