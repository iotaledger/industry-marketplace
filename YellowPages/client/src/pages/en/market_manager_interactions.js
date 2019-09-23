import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image1 from '../../assets/img/content/Page11.png';
import image2 from '../../assets/img/content/Page10.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/market_manager'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">The Market Manager's interaction with the Tangle</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The interactions between AAS need an infrastructure that provides all means for registry, discovery, communication of messages, and trust. Each AAS is therefore connected to an IOTA node. Each message forms a transaction on the Tangle. The transaction’s tag and data fields are specific to the related interaction pattern of the I4.0 system. The eCl@ss properties are part of the transaction data.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image1} style={{ width: '95vw' }} />
                </div>
                <div className="_markdown_">
                    <p>The figure above shows the service requester (SR) and service provider (SP) negotiating with each other through the IOTA Tangle. They are connected with an IOTA node. The description of services is serialized by JavaScript Object Notation (JSON). The logical mapping between the algorithms in the SR and SP and the IOTA transactions is deployed by the Market Manager (MaMa). The MaMa has the following tasks:</p>
                    <ul>
                        <li>translates the SR and SP message into the JSON transaction to be sent to the node</li>
                        <li>translates the transaction messages into SR and SP messages</li>
                        <li>creates a custom transaction tag for the related interaction pattern of the I4.0 system</li>
                        <li>sends messages as transactions with custom tags to an IOTA node</li>
                        <li>filters transactions from the IOTA Tangle that are relevant for the connected SR and SP</li>
                        <li>controls the time span of one bidding process</li>
                        <li>creates MAM channels to collect the outcomes of each bidding process for audit purposes</li>
                    </ul>
                    <p>In addition, the Yellow Pages (YP) add-on listens to the I4.0-related transactions, to provide a visualization of past and ongoing proposals, won/lost bids and payment.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image2} style={{ width: '95vw' }} />
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="market_manager" />
                <NextPage page="service_requester" />
            </div>
        </Layout>
    )
}
