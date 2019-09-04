import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Text from './Text'

import '../styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)    

    return (
        <div className="video-section-wrapper">
            <img 
                role="button"
                onClick={() => setShowVideo(true)}
                src="../static/marketing_assets/video/video_section.svg" 
            />
            <div className="video-section-text-wrapper">
                <Text className="title">Watch it live</Text>
                <Text>See how the Semantic Market operates in our video below, or explore for yourself by trying out the demo</Text>
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

