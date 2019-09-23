import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/iota_tangle'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">What is The IOTA Tangle?</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p><strong>The IOTA Tangle</strong> is a secure data communication protocol and zero-fee microtransaction system utilizing distributed ledger technology. This allows participants in the IOTA network ("the Tangle") to transfer immutable data and value among each other, and achieve consensus on the data and value transactions in the network. The Tangle provides a single source of truth and trust in data, with a goal of being the backbone of (every)thing in a highly networked world. It can be used to generate machine-to-machine (M2M) micropayments and share data across the ecosystem of devices, generating data, producing results, and co-creating new business models.</p>
                    <p>The Tangle is open source, with the full benefits of transparency and visibility into the code base, better reliability, security, and freedom from becoming locked-in by vendor or technology. A thriving global community is constantly challenging the status quo, improving solutions, and introducing new concepts to accelerate IOTA's maturity.</p>
                    <p>The Tangle is designed to be <strong>permissionless</strong> (there is no central authority or miners) and <strong>distributed</strong> (public available network).</p>
                    <p>In order to cater to the future internet of things, the Tangle is designed with the following principles in mind:</p>
                    <ol>
                        <li><strong>Very high scalability</strong>: Increasing network activity with more nodes actually decreases transaction settlement times, unlike in a traditional blockchain.</li>
                        <li><strong>Zero-fee transactions</strong>: If a device sends .001 cent the intended recipient receives .001 cent. If a person or organization sends $1,000,000, the intended recipient receives $1,000,000.</li>
                        <li><strong>Real-Time</strong>: No block times, or lengthy validation periods. Transactions and data can be published, validated, and processed within milliseconds.</li>
                        <li><strong>Low resource requirements</strong>: Designed for micro and IoT devices (eg, sensors and microprocessors), allows for securing the data at the source of aggregation. Also, factors in low energy requirements for sustainable IoT growth and data proliferation.</li>
                        <li><strong>Secure data transfer</strong>: All data can be encrypted, allowing secure data transfer, storage, and referencing. Data can also be organized in data streams for easier querying, authorization allocation, and use.</li>
                        <li><strong>Offline transactions</strong>: Devices never need perfect connectivity, and can be validated when connectivity is available.</li>
                        <li><strong>Quantum computing resistance</strong>: Using special signatures, the IOTA Tangle is resilient to the next generation of computing.</li>
                    </ol>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="register_did" />
                <NextPage page="" />
            </div>
        </Layout>
    )
}
