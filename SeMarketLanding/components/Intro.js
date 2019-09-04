import React, { useContext } from 'react'
import Link from 'next/link'
import Text from './Text'
import Button from './Button'

import '../styles/content.scss'

export default () => {
    return (
        <React.Fragment>
            <div className="intro-wrapper">
                <div className="intro">
                    <Text className="subtitle">The first autonomous</Text>
                    <Text className="title">Industry Marketplace</Text>
                    <Text>Discover how the Sematic Marketplace acts as an integrated hub to enable the Industry 4.0 vision.</Text>
                </div>
                <div className="intro-buttons-wrapper">
                    <Link prefetch href="/scalability">
                        <img className="intro-page secondary" src="../static/marketing_assets/landing/try_the_demo.svg"/>
                    </Link>
                    <Link prefetch href="/scalability">
                        <Button className="intro-page medium primary">
                            Get started
                        </Button>
                    </Link>
                </div>
            </div>
            <img className="asset heading" src="../static/marketing_assets/landing/header_illustration.svg"/>
        </React.Fragment>
    )
}

