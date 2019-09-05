import React from 'react'
import Text from './Text'
import vendor_neutral from '../assets/img/features/vendor_neutral.svg';
import machine_interaction from '../assets/img/features/machine_interaction.svg';
import semantic_language from '../assets/img/features/semantic_language.svg';
import decentralized from '../assets/img/features/decentralized.svg';
import integrated_id from '../assets/img/features/integrated_id.svg';
import integrated_payment from '../assets/img/features/integrated_payment.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="features-wrapper">
        <div className="features-heading-wrapper">
            <Text className="title">Features</Text>
            <Text>Industry 4.0 (I4.0) delivers a new levels of manufacturing management, enabling advanced automated machine to machine operation.</Text>
            <Text>By utilising The Tangle and eCl@ss together, all actors in the value chain are supported with increased trust and security, truly enabling I4.0</Text>
        </div>
        <div className="key-topic-wrapper">
            <div className="key-topic">
                <img src={vendor_neutral} />
                <Text className="subtitle">Vendor neutral</Text>
                <Text>Completely neutral communication conditions for all participants</Text>
            </div>
            <div className="key-topic">
                <img src={machine_interaction} />
                <Text className="subtitle">Machine Interaction</Text>
                <Text>M2M communication for contracts, product data, purchasing, bids, orders, services</Text>
            </div>
            <div className="key-topic">
                <img src={semantic_language} />
                <Text className="subtitle">Semantic language</Text>
                <Text>Based on open standards, developed by academic institutes</Text>
            </div>
            <div className="key-topic">
                <img src={decentralized} />
                <Text className="subtitle">Decentralized</Text>
                <Text>Decentralized and globally accessible protocol with paramount security</Text>
            </div>
            <div className="key-topic">
                <img src={integrated_id} />
                <Text className="subtitle">Integrated ID</Text>
                <Text>Decentralized Identity, to ensure the authenticity of all participants</Text>
            </div>
            <div className="key-topic">
                <img src={integrated_payment} />
                <Text className="subtitle">Integrated payment</Text>
                <Text>Payment option for goods and services, without transaction fees</Text>
            </div>
        </div>
    </div>
)

