import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import LanguageContext from '../../context/language-context'
import TranslatedPage from '../de/executive_summary'

export default () => {
    window.scrollTo(0, 0);
    // try {
    //     window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    // } catch (error) {
    //     window.scrollTo(0, 0);
    // }
    const { language } = useContext(LanguageContext);
    return language === 'de' ? <TranslatedPage /> : (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Executive Summary</Text>
            </div>
            <div className="content scalability">
                <div className="_markdown_">
                    <p>The next generation of industrial automation, Industry 4.0 (I4.0), is rapidly approaching. In tomorrow's world, devices will contain not only asset information, but proactive decision and optimization algorithms to enable goal-oriented behavior among their components. Such I4.0 devices can be viewed  as autonomous independent economic agents that cooperate according to market economy principles.</p>
                    <p>The highly flexible value creation networks that result from I4.0 will require new forms of collaboration between companies - both at the national and global level.  And the successful implementation of I4.0 will depend on the creation of a common global communication and computing infrastructure that allows economic relationships between machines.</p>
                    <p>By combining the latest technology with established standards and openly-developed specifications, the Industry Marketplace will provide this platform and enable the economy of things.</p>
                    <p>The Industry Marketplace will serve as a vendor- and industry-neutral platform, automating the trading of physical and digital goods / services. Building on specifications developed by the Plattform Industrie 4.0 (Germany’s central network for the advancement of digital transformation in manufacturing), the Industry Marketplace combines distributed ledger technology, immutable audit logs, and standardized, machine-readable contracts with an integrated decentralized identity system, to ensure the authenticity of all participants and enable secure communication and payments across the industry landscape.</p>
                    <p>The Industry Marketplace has been developed as an open source initiative and is free to join. A simple trial can be run at your office to explore its potential. We encourage open innovation with other industry partners to explore new business models and the many possibilities of industrial automation.</p>

                    <h3>Key features</h3>
                    <ul>
                        <li>Vendor- and industry-neutral platform and communication </li>
                        <li>Standardised communication for contracts, product data, purchasing, bids, orders, services</li>
                        <li>Implementation of the I4.0 principles for driving forward digitalization and manufacturing</li>
                        <li>Semantic language, based on open specifications, developed by Plattform Industrie 4.0 and academic institutes</li>
                        <li>Decentralized and globally accessible protocol with paramount security</li>
                        <li>Low system requirements</li>
                        <li>Integrated, decentralized ID, to ensure the authenticity of all participants</li>
                        <li>Integrated payment option for goods and services, without transaction fees </li>
                        <li>Payment queue to execute outgoing payments in high frequency environments, e.g. buying many individual data sets, like weather data</li>
                        <li>Immutable audit log for every step (including payments) to be compliant with regulatory aspects</li>
                        <li>Digital trust as design principle through the IOTA Tangle</li>
                    </ul>
                    <div className="image-wrapper">
                        <img alt="" src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="" />
                <NextPage page="introduction_to_industry4" />
            </div>
        </Layout>
    )
}
