import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Link } from 'react-router-dom';
import Text from './Text'
import videoDesktop from '../assets/img/video/video_section.svg';
import videoMobile from '../assets/img/video/mobile_play.svg';

import '../assets/styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)

    return (
        <div className="video-section-wrapper reverse">
            <div className="video-section-text-wrapper how-it-works">
                <Text className="title">How it works</Text>
                <Text>
                    See how the Industry Marketplace operates in our video, or explore for yourself {' '}
                    <Link to="/scalability">
                        by watching the tutorial
                    </Link>
                    {' '} and {' '}
                    <Link to="/scalability">
                        trying out the demo
                    </Link>
                </Text>
            </div>
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
            <ModalVideo
                channel='youtube'
                autoplay
                allowFullScreen
                isOpen={showVideo}
                videoId='Jnh_9nKkemM'
                onClose={() => setShowVideo(false)}
            />
        </div>
    )
}
