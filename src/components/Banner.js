import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import styles from './Banner.less';

const Banner = ({ banner, visible }) => {
  const carouselSetting = {
    className: styles.carousel,
    autoplay: 'autoplay',
    autoplaySpeed: 8000,
    speed: 1500,
    infinite: true,
    draggable: true,
  };
  return (
    visible ?
      <div className={styles.banner}>
        <Carousel {...carouselSetting}>
          {
            banner && banner.length > 0 ?
              banner.map(item =>
                <ul className={styles.carouselImg} key={item.imgcode}>
                  <li style={{ background: `url(${item.src}) no-repeat center` }} title={item.description}>
                    <a href={item.link} target="view_window">{item.description}</a>
                  </li>
                </ul>) :
              <ul className={styles.carouselImg}>
                <li>
                  <a style={{ textDecoration: 'none' }}>无图片</a>
                </li>
              </ul>
          }
        </Carousel>
      </div> :
      null
  );
};

Banner.propTypes = {
  banner: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default Banner;
