import React from 'react';
import Slider from 'react-slick';
import next from '../assets/img/video/arrow-right.svg';
import prev from '../assets/img/video/arrow-left.svg';

export default class extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <img className="slider next" src={next} alt="" />,
      prevArrow: <img className="slider prev" src={prev} alt="" />
    };
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {this.props.items.map((item, index) => (
            <div key={index} className="slider-content">
              {item}
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
