import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/wewash_prototype'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Prototype Implementation by	WeWash</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>Cooperation with real estate platforms is an important strategic building block for WeWash. These platforms provide services in ​​rented real estate and digital integration around the house i.e. facilitating an IoT Smart Home.</p>
                    <p>The Industry Marketplace provide an attractive alternative to a direct connection. They form a secure, standardized platform in which service providers and service promoters can offer services without close coupling or direct integration.</p>
                    <p>Our first step within this project is to advertise available WeWash machines on the Tangle within the framework of the Industry Marketplace.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="neoception_demonstrator" />
                <NextPage page="standards" />
            </div>
        </Layout>
    )
}
