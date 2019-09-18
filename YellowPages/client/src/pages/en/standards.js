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
                <Text className="title extra-large">Why are standards important for Industry 4.0?</Text>
                <Text className="subtitle">eCl@ss – Standard for master data and semantics for digitization</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>eCl@ss is the only worldwide ISO/IEC-compliant data standard for goods and services. eCl@ss contains tens of thousands of product classes and unique properties. This lets users  standardize procurement, storage, production, and distribution activities in and between companies, across sectors, countries and languages. The standard enables organisations to form novel collaborations, realise sales potential, reduce costs, and increase the efficiency of merchandise and data management.</p>
                    <p>Thousands of companies - including many global players - already depend on eCl@ss. The eCl@ss master-data standard is used both inside companies and when dealing with customers and suppliers.</p>
                    <p>Standards are an essential part of industry, enabling:</p>
                    <ul>
                        <li><strong>Revenue growth:</strong> Exploiting significant sales potential through electronic catalogs</li>
                        <li><strong>Cost reduction:</strong> Rationalizing purchasing, inventory management, and distribution by combining volume orders and streamlining portfolios</li>
                        <li><strong>Time savings:</strong> Handling procurement and supplier-management functions more effectively, strengthening operational processes</li>
                        <li><strong>Productivity:</strong> Improving performance, ROI, and time-to-market through the use of continuous processes, automated interfaces, and standardized product information</li>
                        <li><strong>Secure planning:</strong> Improving strategic decision-making by using data that is meaningfully processed, and exchanged with customers and partners</li>
                    </ul>
                    <p>Learn more about eCl@ss on the eCl@ss-website <a href="https://www.eclass.eu/en.html" target="_blank" rel="noopener noreferrer">https://www.eclass.eu/en.html</a></p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="wewash_prototype" />
                <NextPage page="plattform_industrie4" />
            </div>
        </Layout>
    )
}
