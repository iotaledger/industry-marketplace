import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/standards'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">XXX</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>XXX</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>XXX</p>
                    <p>XXX</p>
                    <ul>
                        <li>XXXXX</li>
                        <li>XXXXXX</li>
                    </ul>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="" />
                <NextPage page="" />
            </div>
        </Layout>
    )
}
