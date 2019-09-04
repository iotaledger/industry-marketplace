import React from 'react'
import Text from './Text'

import '../styles/content.scss'

export default () => (
    <React.Fragment>
        <div className="video-section-wrapper">
            <img src="../static/marketing_assets/video/video_section.svg" />
            <div className="video-section-text-wrapper">
                <Text className="title">Watch it live</Text>
                <Text>See how the Semantic Market operates in our video below, or explore for yourself by trying out the demo</Text>
            </div>
        </div>
        <img className="asset video" src="../static/marketing_assets/video/video_section_desktop_background.svg"/>
    </React.Fragment>
)

