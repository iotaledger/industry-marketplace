import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Link } from 'react-router-dom';
import Text from './Text'
import videoMobile from '../assets/img/video/mobile_play.svg';
import IMP_explainer from '../assets/img/video/IMP_explainer.jpg';

import '../assets/styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)

    return (
        <div className="video-section-wrapper reverse">
            <div className="video-section-text-wrapper how-it-works">
                <Text className="title">How it works</Text>
                <Text>
                    See how the Industry Marketplace operates in our video, {' '}
                    <Link to="/use_cases">
                        use-cases
                    </Link>
                    {' '} or explore for yourself by watching the tutorial and {' '}
                    <Link to="/demo">
                        trying out the demo
                    </Link>
                </Text>
            </div>
            <img
                className="desktop"
                role="button"
                onClick={() => setShowVideo(true)}
                src={IMP_explainer}
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
