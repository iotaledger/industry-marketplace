import React from 'react'
import Text from './Text'
import aas from '../assets/img/key_components/aas.svg';
import eclass from '../assets/img/key_components/eclass.svg';
import tangle from '../assets/img/key_components/tangle.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="key-components-wrapper">
        <div className="key-components-description">
            <Text className="title">Key Components</Text>
            <Text>Industry 4.0 components must be able to talk to each other, offer services and, if necessary, negotiate tasks and offer payment.</Text>
            <Text>Through the Industry Marketplace components, Industry 4.0 machine components act as independent service provider and consumer, who pay or are paid for the provided services supported by a common infrastructure.</Text>
        </div>
        <div className="key-components-list">
            <div className="key-component">
                <img src={aas} alt="Asset Administration Shell" />
                <div className="key-component-description">
                    <Text className="subtitle">Asset Administration Shell (AAS)</Text>
                    <Text>An AAS is a standardized virtual representation of an asset, providing storage of asset information. Examples of assets are machines, equipment units, software etc. AAS and Asset form together an Industry 4.0 component communication interface.</Text>
                </div>
            </div>
            <div className="key-component">
                <img src={eclass} alt="eCl@ss" />
                <div className="key-component-description">
                    <Text className="subtitle">eCl@ss</Text>
                    <Text>eCl@ss is the worldwide, ISO/IEC-compliant data standard for the classification and unambiguous description of products and services. eCl@ss descriptions provide clear data structure in a M2M environment. Machines can identify and understand themselves or a counterpart’s capabilities.</Text>
                </div>
            </div>
            <div className="key-component">
                <img src={tangle} alt="IOTA Tangle" />
                <div className="key-component-description">
                    <Text className="subtitle">IOTA Tangle</Text>
                    <Text>The IOTA Tangle is a distributed ledger technology (DLT), recording data exchange in a secure and immutable log. A tamper-proof, single source of truth. Payments can be done globally and instantly after purchased goods have been received, a contract has been negotiated, or a bid is won.</Text>
                </div>
            </div>
        </div>
    </div>
)
