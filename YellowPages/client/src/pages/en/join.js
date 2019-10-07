import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/join'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Join the Industry Marketplace</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The Industry Marketplace is an open-source project to advance and accelerate digital transformation.</p>
                    <p>We want to invite enterprises, academics, and public entities to test the Industry Marketplace in joint environments with industry partners.</p>
                    <p>We've collected a few best practices for organizations interested in exploring IOTA's Industry Marketplace:</p>
                    <ul>
                        <li>Run a free-to-join, simple trial at your office to explore the potential</li>
                        <li>Secure a mandate from management, aimed at exploring emerging digital technologies and non-incremental innovation</li>
                        <li>Experiment in small but quick steps, start with a very simple PoC</li>
                        <li>Secure the resources necessary to ramp up your PoC towards a testbed pilot</li>
                        <li>Apply the principles of Open innovation. Be comfortable sharing your "problem worth solving" to find complementary partners sharing similar ambitions</li>
                    </ul>
                    <p>Please contact us at <a href="mailto:industry@iota.org">industry@iota.org</a> or visit industry.iota.org for more information.</p>
                    <p>The IOTA Foundation can help you to efficiently integrate your infrastructure to the Industry Marketplace as a Proof-of-concept (PoC).</p>

                    <h2>Why join the industry marketplace?</h2>
                    <ul>
                        <li>Accelerate learning about Distributed Ledger Technologies, standardization, machine contracts</li>
                        <li>Explore new business models with your colleagues via structured experimentation</li>
                        <li>Initiate open innovation initiatives with the rest of the IOTA and eCl@ss ecosystem</li>
                    </ul>

                    <h2>How to join the Industry Marketplace?</h2>
                    <p>In order to become an entity of the Industry Marketplace, it is necessary to install and run the MarketManager component as a middleman between the user and the IOTA Tangle.</p> 
                    <p>To find out more about the core component of the Industry Marketplace and install, run and configure your own MarketManager instance please follow our <a href="https://blog.iota.org/how-to-get-started-with-the-iota-industry-marketplace-a-step-by-step-guide-90fa343e4e7e" target="_blank" rel="noopener noreferrer">step-by-step guide</a>.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="project_partners" />
                <NextPage page="register_did" />
            </div>
        </Layout>
    )
}
