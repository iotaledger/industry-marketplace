import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/market_manager'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">The Market Manager</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The Industry Marketplace results from the interactions between asset administration shells and their so-called Market Managers. The Market Manager plays the role of the middleman between AAS and the IOTA Tangle. Depending on the role of the AAS, the Market Manager will search for providers of required services or try to sell certain services.</p>
                    <p>The Market Manager manages IOTA transactions and performs the logical mapping between the Service Requester (SR) and Service Provider (SP). Its role includes:</p>
                    <ul>
                        <li>Translation of the I4.0 language messages from the SR and SP into IOTA transactions sent to a node.</li>
                        <li>Translation of received IOTA transactions into I4.0 language messages and filtering those relevant for the connected SR and SP.</li>
                        <li>Authentication of interacting parties by creating and verifying proof of decentralized authentication and identification (DID) ownership.</li>
                    </ul>
                    <p>By utilizing an open source-developed semantic language, specifically developed by academic bodies for I4.0 (<a href="https://www.plattform-i40.de/PI40/Redaktion/DE/Downloads/Publikation/hm-2018-sprache.html" target="_blank" rel="noopener noreferrer">https://www.plattform-i40.de/PI40/Redaktion/DE/Downloads/Publikation/hm-2018-sprache.html<a/>), standardized machine readable properties from eCl@ss (https://www.eclass.eu/en.html), together withIOTA’s distributed ledger technology and a DID solution, the Industry Marketplace provides an open, easily accessible, secure, and trusted platform. It enables all industries to handle calls for proposal, proposals, and payments and thus enables the direct negotiation and economic relations between autonomous systems.</p>
                    <p>Payments in the Industry Marketplace utilize the integrated IOTA token. The token is a native part of the protocol, free to transfer without any fees. It can therefore be used in the purchase of larger goods or digital services, as well as in micropayments for small amounts of data (e.g. from weather stations).</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="" />
                <NextPage page="" />
            </div>
        </Layout>
    )
}
