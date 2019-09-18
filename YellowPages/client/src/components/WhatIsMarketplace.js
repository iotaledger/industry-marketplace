import React from 'react'
import Text from './Text'
import illustration from '../assets/img/landing/illustration.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="marketplace-wrapper">
        <img src={illustration} alt="" />
        <div className="marketplace-text-wrapper">
            <Text className="title">What is the <br />Industry Marketplace?</Text>
            <Text>The Industry Marketplace is a vendor and industry-neutral platform, automating the trading of physical and digital goods and services.</Text>
            <Text>Building on specifications developed by the Plattform Industrie 4.0 (Germany's central network for the advancement of digital transformation in manufacturing), it combines distributed ledger technology, immutable audit logs and standardized, machine-readable contracts to accelerate industrial automation and enable the "economy of things".</Text>
        </div>
    </div>
)
