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
                    <p>We want to invite enterprises, academics, and public entities to test the Industry Marketplace in joint environments and with respective industry partners. We want to demonstrate the feasibility of an autonomous machine economy in a co-creation ecosystem.</p>
                    <p>We've collected a few best practices for organizations interested in exploring IOTA's Industry Marketplace:</p>
                    <ul>
                        <li>Secure a mandate from management, aimed at exploring emerging digital technologies and non-incremental innovation</li>
                        <li>Secure necessary resources in time to ramp up your PoC towards a testbed pilot</li>
                        <li>Experiment in small but quick steps, start with a very simple PoC</li>
                        <li>Apply the principles of Open innovation. Be comfortable sharing your "problem worth solving" to find complementary partners sharing similar ambitions</li>
                    </ul>
                    <p>Please contact us at <a href="mailto:industry@iota.org">industry@iota.org</a> or visit industry.iota.org for more information. The IOTA Foundation’s consultation can help you to efficiently integrate your infrastructure as a first Proof-of-concept (PoC) to the Industry Marketplace.</p>
                    <ul>
                        <li>Accelerate learning about Distributed Ledger Technologies, standardization, machine contracts</li>
                        <li>Run a free-to-join and simple trial at your office to explore the potential of the Industry Marketplace</li>
                        <li>Catalyse the exploration of new business models with your colleagues via structured experimentation</li>
                        <li>Initiate open innovation initiatives with the rest of the IOTA and eCl@ss ecosystem</li>
                    </ul>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="project_partners" />
                <NextPage page="register_did" />
            </div>
        </Layout>
    )
}
