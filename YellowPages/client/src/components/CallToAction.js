import React from 'react'
import { Link } from 'react-router-dom';
import Text from './Text'
import Button from './Button'
import tryIt from '../assets/img/landing/try_the_demo.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="callToAction-wrapper">
        <Text className="title">Explore for yourself</Text>
        <Text>To see how the Industry Marketplace operates, try our demo, or dive into the extended documentation to get started</Text>
        <div className="callToAction-buttons-wrapper">
            <Link to="/demo">
                <img className="intro-page-btn secondary" alt="Try the demo" src={tryIt} />
            </Link>
            <Link to="/executive_summary">
                <Button className="medium primary">
                    Get started
                </Button>
            </Link>
        </div>
    </div>
)
