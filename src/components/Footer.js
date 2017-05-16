import React from 'react';
import { Popover } from 'antd';
import styles from './Footer.less';

const Footer = () =>
  <footer>
    <div className={styles.left}>
      Copyright &copy; 2016 &nbsp;&nbsp;
      南京才丰软件开发有限公司 &nbsp;&nbsp;
      All Rights Reserved &nbsp;&nbsp;
      苏ICP备10086号
    </div>
    <div className={styles.right}>
      <Popover content={<div>微信公众号二维码</div>}>
        <img src={require('../assets/wechat.png')} alt="weChat" height={40} width={40} />
      </Popover>
      <Popover content={<div>QQ二维码</div>}>
        <img src={require('../assets/qq.png')} alt="QQ" height={40} width={40} />
      </Popover>
      <Popover content={<div>电话号码：18751572057</div>}>
        <img src={require('../assets/telefono.png')} alt="tel" height={40} width={40} />
      </Popover>
    </div>
  </footer>;

export default Footer;
