import React from 'react'
// import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image from '../../assets/img/content/Page12.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/market_manager'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">The Service Requester Role</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The Service Requester (SR) initiates a new “Call for Proposal” (CfP). The CfP is a request to buy a certain good or service from another participant. Examples can be found in the <Link to={'/use_cases'}>Use-Case section</Link>.</p>
                    <p>The Industry Marketplace includes a decentralized identity system (DID) to ensure the authentication of participants and separate trusted business requests from spam or fake bids.</p>
                    <p>For demonstration purposes we have created a set of example proposals. The description of a CfP follows the Industry 4.0 language specification, developed by Plattform Industrie 4.0 (<a href="https://www.vdi.de/richtlinien/details/vdivde-2193-blatt-1-sprache-fuer-i40-komponenten-struktur-von-nachrichten" target="_blank" rel="noopener noreferrer">VDI/VDE-2193</a> Part 1 Guideline), to ensure compatibility with other devices and frameworks.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image} style={{ width: '95vw' }} />
                </div>
                <div className="_markdown_">
                    <p>The CfP is sent to the IOTA Tangle and is documented in an immutable audit log. The CfP is now public and a service provider (SP) can place a corresponding proposal to offer the requested good or service.</p>
                    <p>After the proposal has been made by the SP, the SR has the option to accept or reject the proposal and its associated price. After the bid has been accepted and the service provided, the requester confirms the service provision and issues the payment from its wallet.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="market_manager_interactions" />
                <NextPage page="service_provider" />
            </div>
        </Layout>
    )
}
