import React from 'react'
import Link from 'next/link'
import Text from './Text'
import Button from './Button'

import '../styles/content.scss'

export default () => (
    <div className="callToAction-wrapper">
        <Text className="title">Explore for yourself</Text>
        <Text>To see how the Semantic Marketplace operates, try our demo, or dive into the extended documentation to get started</Text>
        <div className="callToAction-buttons-wrapper">
            <Link prefetch href="/scalability">
                <img className="intro-page-btn secondary" src="../static/marketing_assets/landing/try_the_demo.svg"/>
            </Link>
            <Link prefetch href="/scalability">
                <Button className="medium primary">
                    Get started
                </Button>
            </Link>
        </div>
    </div>
)
