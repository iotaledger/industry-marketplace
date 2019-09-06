import React from 'react'
import Text from './Text'
import illustration from '../assets/img/landing/illustration.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="marketplace-wrapper">
        <img src={illustration} />
        <div className="marketplace-text-wrapper">
            <Text className="title">What is the <br />Industry Marketplace?</Text>
            <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna.</Text>
            <Text>Aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd.</Text>
        </div>
    </div>
)

