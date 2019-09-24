import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Link } from 'react-router-dom'
import Button from './Button'
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
                    See how the Industry Marketplace operates in our video, or explore for yourself {' '}
                    <Link to="/use_cases">
                        <Button className="medium secondary">
                            Use cases
                        </Button> 
                    </Link>
                    <Link to="/demo">
                        <Button className="medium transparent">
                            try the demo
                        </Button>
                    </Link>
                </Text>
            </div>
            <div className="desktop-player">
                <img 
                    className="desktop" src={IMP_explainer} alt="" 
                    role="button"
                    onClick={() => setShowVideo(true)}
                />
                <div 
                    className="play"
                    role="button"
                    onClick={() => setShowVideo(true)}
                />
            </div>
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
