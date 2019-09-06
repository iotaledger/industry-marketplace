import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Link from 'next/link'
import Text from './Text'

import '../styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)    

    return (
        <div className="video-section-wrapper">
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
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">What they say</Text>
                <Text className="name">Dominik Schiener, IOTA Foundation</Text>
                <Text className="quote">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat</Text>
                <Link prefetch href="/scalability">
                    <Text className="link">See All Testimonioals</Text>
                </Link>
            </div>
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

