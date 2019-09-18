import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/benefits_of_iota'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (

    const videoSrc = `https://www.youtube.com/embed/Go-9-NN1qsk?autoplay=0&rel=0&modestbranding=1`
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">IOTA: the core of Industry 4.0</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The manufacturing industry is undergoing a new revolution. Smart factories will share data to improve efficiency, increase production, reduce waste, and develop trust. But with the ever increasing connectivity between internal and external cyber-physical systems, security is of the utmost importance. One crucial component of security is data integrity.</p>
                    <p>At the same time, an I4.0 system needs a common infrastructure so that other systems and devices in the production or service chain can find, trust and interact with each other under basic security protocols the corresponding specifications are an ongoing development under Platform Industrie 4.0 Program).</p>
                    <p>IOTA’s underlying network, the Tangle, provides a trusted vendor-independent computing infrastructure for secure data and value transfer. The Tangle will serve as the backbone for I4.0, enabling I4.0 components to interact, trade directly with each other, and engage in the machine economy.</p>
                </div>
                    <div className="video-container">
                        <iframe
                            title="iota"
                            className="player"
                            type="text/html"
                            width="65%"
                            height="550px"
                            frameBorder="0"
                            src={videoSrc}
                        />
                    </div>
                <div className="_markdown_">
                    <p>The Tangle forms the basis for the Industry Marketplace. It serves as a common communication and computing infrastructure able to support all actors involved in the value chain. It delivers trust and security by ensuring the reliable exchange of data and services provided by I4.0 components. A decentralized, immutable audit trail for asset offers, requests, and orders delivers increased trust among the transacting parties as well as full transparency and traceability for auditors.</p>
                    <p>The Tangle brings additional benefits:</p>
                    <ul>
                        <li>Immutable and transparent record keeping across the value chain</li>
                        <li>Network redundancy to avoid single points of failure</li>
                        <li>Elimination of a controlling intermediary: without an intermediary, it is possible to establish a direct relationship between interacting parties. The transactions can be triggered by machines themselves such as cars or production lines.</li>
                        <li>The fee-less microtransaction structure does not impose any extra cost; neither does it limit the amount of data and transactions that can be processed</li>
                        <li>The flexible transaction structure can accommodate various asset descriptions along with offer, request, and order data models</li>
                        <li>The permissionless nature means any stakeholder can host a node and a copy of the ledger, thus removing the need to rely on intermediary third parties for the marketplace "trust" layer</li>
                        <li>The use of restricted masked authenticated messaging (MAM) channels provides access controls thereby protecting the confidentiality of orders</li>
                        <li>The IOTA token provides an interoperable payment system</li>
                    </ul>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="introduction_to_industry4" />
                <NextPage page="industry_marketplace" />
            </div>
        </Layout>
    )
}
