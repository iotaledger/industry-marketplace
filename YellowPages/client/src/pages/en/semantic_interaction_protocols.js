import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/semantic_interaction_protocols'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Semantic interaction protocols</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>Semantic interaction protocols are used to define a sequence of exchanged messages for some application scenario. One example is the organizing of cooperation between Cyber-Physical Systems with the "bidding process" interaction protocol.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>The interaction protocol "Bidding process" presented in VDI/VDE 2193-2 makes highly flexible cooperation relationships possible between I4.0 components, especially if the tasks have to be distributed. The aim is to achieve legally binding value chains across company boundaries, in which each participating I4.0 component assumes a task as agreed in the tendering procedure. A legal study on the use of the tendering procedure proposed in VDI/VDE 2193-2 has shown that a legally valid contract is concluded if the terms and conditions of business are mutually accepted. Special details that can be machine-interpreted in the form of features (e.g. technical description of a service, delivery period, price, fulfilment of certain standards, guarantee period) are then subject to negotiation. This makes the interaction pattern suitable for use in value chains.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="message_structure" />
                <NextPage page="project_partners" />
            </div>
        </Layout>
    )
}
