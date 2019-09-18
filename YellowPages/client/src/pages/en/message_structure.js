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
                <Text className="title extra-large">Structure of the messages</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>Information exchange between I4.0 components is message based. VDI/VDE 2193 defines the structure of these messages. This creates the prerequisites for a common understanding of messages between interacting partners.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="vocabulary" />
                <NextPage page="semantic_interaction_protocols" />
            </div>
        </Layout>
    )
}
