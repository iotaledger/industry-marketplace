import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Link from 'next/link'
import Text from './Text'

import '../styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)    

    return (
        <div className="video-section-wrapper reverse">
            <div className="video-section-text-wrapper how-it-works">
                <Text className="title">How it works</Text>
                <Text>
                    See how the Semantic Market operates in our video, or explore for yourself {' '}
                    <Link prefetch href="/scalability">
                        by watching the tutorial
                    </Link>
                    {' '} and {' '}
                    <Link prefetch href="/scalability">
                        trying out the demo
                    </Link>
                </Text>
            </div>
            <img 
                className="desktop"
                role="button"
                onClick={() => setShowVideo(true)}
                src="../static/marketing_assets/video/video_section.svg" 
            />
            <img 
                className="mobile"
                role="button"
                onClick={() => setShowVideo(true)}
                src="../static/marketing_assets/video/mobile_play.svg" 
            />
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

