import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/message_structure'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Chapter 1</Text>
                <Text className="subtitle">IOTA as scalable DLT</Text>
            </div>
            <div className="content scalability">
                <div className="_markdown_">
                    <p>IOTA’s goal is to establish a <strong>DLT for the Internet of Things</strong> (IoT). The following characteristics are fundamental to this vision:</p>
                    <ul>
                        <li><strong>Scalable.</strong> Process a substantial number of transactions per second across a large network of nodes, with fast confirmation times.</li>
                        <li><strong>Lightweight.</strong> Low-power devices should be able to directly participate in the network.</li>
                        <li><strong>Feeless.</strong> Sending transactions should not require payment of network fees.</li>
                    </ul>
                    <p>Traditional DLTs have limiting factors that make them unsuitable for attaining IOTA’s goal.</p>
                    <ol>
                        <li><strong>The blockchain data structure.</strong> The inherent limitation on the speed of blockchain networks is commonly referred to as the <a data-tip="true" data-for="blockchain_bottleneck" currentitem="false">“blockchain bottleneck.”</a> In blockchain, there is only one site where new transactions can be attached — the end of the chain. The resulting negative effect on network throughput is demonstrated in this simple visual:</li>
                    </ol>
                    <div className="animation-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>In contrast, the core <strong>data structure</strong> in IOTA is <strong>highly scalable.</strong> This is made possible with one simple rule: each <a data-tip="true" data-for="transaction" currentitem="false">transaction</a> references and approves two existing transactions. This rule defines IOTA’s underlying data structure — the Tangle — which, in mathematical terms, is known as a directed acyclic graph (DAG).</p>
                    <p>Rather than being limited by a single site for attaching new transactions, DAGs offer multiple sites where transactions can be attached. Users can continue to attach new transactions on various parts of the Tangle without waiting for other transactions to confirm:</p>

                    <div className="animation-wrapper">
                        <img src="../static/scalability/tangle_bottleneck.gif"/>
                    </div>
                    <ol start="2">
                        <li><strong>The <a data-tip="true" data-for="consensus" currentitem="false">consensus</a> mechanism.</strong> In Blockchain, <a data-tip="true" data-for="nakamoto_consensus" currentitem="false">Nakamoto consensus</a> splits the network into miners and users. Miners consume large amounts of computing power completing the <a data-tip="true" data-for="proof_of_work" currentitem="false">Proof-of-Work</a> (PoW) required to chain the blocks together. Miners are incentivized by the fees users are willing to pay to have their transaction included in a block. This fee-based incentive structure would be a significant barrier in a machine-to-machine economy, in which micropayment values between machines may be lower than the fees incurred.</li>
                    </ol>

                    <p>In IOTA there is no distinction between miners and users. All nodes can participate in consensus. This means that an IOTA node has a completely different role than a Bitcoin miner. IOTA nodes only perform basic operations that do not require much computational power (e.g. storing the ledger, validating transactions). Users can set up a node with minimal cost and actively participate in network consensus, and thereby bolster the security of the network.</p>
                    <p>The definition of a <strong>consensus layer</strong> — describing how nodes agree on which transactions are trustworthy — is at the core of IOTA. In the current IOTA implementation, nodes trust transactions which are referenced and approved by <a data-tip="true" data-for="milestones" currentitem="false">milestones</a>, issued by the Coordinator. The use of this centralized “<a data-tip="true" data-for="finality" currentitem="false">finality</a> device” has been necessary to provide security during the network’s infancy.</p>

                    <div className="animation-wrapper">
                        <img src="../static/scalability/milestones.gif"/>
                    </div>
                    <p>The solution to Coordicide will ensure that the network remains feeless, while preserving decentralisation and security, and promoting unprecedented scalability.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="" title="Introduction" />
                <NextPage page="post-coordinator" title="Chapter 2" />
            </div>
        </Layout>
    )
}
