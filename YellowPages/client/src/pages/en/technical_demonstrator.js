import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/technical_demonstrator'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Technical demonstrator for Service Requester and Service Provider</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The team behind the Chair of Integrated Automation at the Otto-von-Guericke University (OVGU) in Magdeburg is participating within the Industry Marketplace. Their I4.0 demonstrator consists of multiple I4.0 components connected to the IOTA Tangle.</p>
                    <p>The implemented I4.0 components comprise several drilling and rotary machines, a transportation robot and a product. Each asset is equipped with a digital twin in the form of an Asset Administration Shell (AAS). Together with their AAS the assets form autonomous goal-oriented service units.</p>
                    <p>After connection to the Industry Marketplace, machines receive their own wallets and can offer their manufacturing capabilities. The AAS of the product knows its production steps and searches for the services from the drill, rotary tool or transportation robot. <br />After the service provider is found, what follows is the transportation, provision of a service and the payment.</p>
                    <ul>
                        <li>Each active I4.0 component participating in the bidding process of the OVGU demonstrator can either take over the role of the Service Requester (SR) or the Service Provider (SP)</li>
                        <li>The Digital Twin (AAS) of the product acts as Service Requester (SR)</li>
                        <li>The SR is the initiator of the bidding process and demands a service by sending a "Call for Proposal" (CfP) with a detailed technical and commercial description of the required service</li>
                        <li>The SP responds to the CfP and sends a proposal to provide the requested service within the given time</li>
                        <li>After the SR receives the proposals, it evaluates them and chooses its favoured option</li>
                        <li>The SP sends an acceptance message, confirming the contract and order placement</li>
                        <li>After the proposal was accepted, the SP provides the service. After the service was provided the SP sends the confirmation message to the SR</li>
                        <li>The SR compares the description of the provided Service with the description of the ordered service. If they match, the payment with MIOTA is made</li>
                        <li>All Information exchanged within the bidding process of the I4.0 demonstrator follows the semantic interaction protocol described in the VDI/VDE 2193 Part 1 Guideline</li>
                    </ul>
                    <p>In this demonstrator, the IOTA Tangle is considered a common vendor neutral, trusted and secure communication and computing infrastructure for the interactions of I4.0 components.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>Demonstration Scenario at the Otto-von-Guericke-Universität, Magdeburg</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="decentralized_identification_tangle" />
                <NextPage page="neoception_demonstrator" />
            </div>
        </Layout>
    )
}
