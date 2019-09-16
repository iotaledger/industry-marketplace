import React from 'react';
import Slider from 'react-slick';
import next from '../assets/img/video/arrow-right.svg';
import prev from '../assets/img/video/arrow-left.svg';

export default ({ items }) => {
    const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
      <img {...props} src={prev} alt="" />
    );

    const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
      <img {...props} src={next} alt="" />
    );

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: <SlickArrowLeft />,
      nextArrow: <SlickArrowRight />,
    };
    
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {items.map((item, index) => (
            <div key={index} className="slider-content">
              {item}
            </div>
          ))}
        </Slider>
      </div>
    );
}
