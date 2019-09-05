import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Link from 'next/link'
import Text from './Text'

import '../styles/content.scss'

export default () => {
    return (
        <div className="request-map-wrapper">
            <div className="text-wrapper">
                <Text className="title">Active Request Map</Text>
                <Text>Click on a pin to view the request information</Text>
            </div>
            <img 
                className="desktop"
                src="../static/marketing_assets/video/video_section.svg" 
            />
            <Link prefetch href="/scalability">
                <img className="map-cta intro-page-btn secondary" src="../static/marketing_assets/landing/view_listings.svg"/>
            </Link>
        </div>
    )
}

