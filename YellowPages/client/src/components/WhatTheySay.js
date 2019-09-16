import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Link } from 'react-router-dom';
import Text from './Text'
import Carousel from './Carousel';
import videoDesktop from '../assets/img/video/video_section.svg';
import videoMobile from '../assets/img/video/mobile_play.svg';
import face from '../assets/img/video/face.svg';

import '../assets/styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)   
    
    const items = [
        <React.Fragment>
            <img 
                className="desktop"
                role="button"
                onClick={() => setShowVideo(true)}
                src={videoDesktop} 
                alt=""
            />
            <img 
                className="mobile"
                role="button"
                onClick={() => setShowVideo(true)}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">What they say</Text>
                <Text className="name">Patrick Placeholder, IOTA Foundation</Text>
                <Text className="quote">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat</Text>
                <Link to="/scalability">
                    <Text className="link">See All Testimonioals</Text>
                </Link>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={face} alt="Patrick Placeholder" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">What they say</Text>
                <Text className="name">Patrick Placeholder, IOTA Foundation</Text>
                <Text className="quote">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat</Text>
                <Link to="/scalability">
                    <Text className="link">See All Testimonioals</Text>
                </Link>
            </div>
        </React.Fragment>,
    ];

    return (
        <div className="video-section-wrapper">
            <Carousel items={items} />
            <ModalVideo 
                channel='youtube' 
                autoplay
                allowFullScreen
                isOpen={showVideo} 
                videoId='guNNqEeu6gY' 
                onClose={() => setShowVideo(false)} 
            />
        </div>
    )
}

