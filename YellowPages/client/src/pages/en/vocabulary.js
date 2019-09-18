import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image from '../../assets/img/content/Page30.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/vocabulary'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Vocabulary</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>eCl@ss is a worldwide, ISO/IEC-compliant data standard for the classification and unambiguous description of products and services by means of standardized ISO-compliant properties. It is an ideal candidate for the vocabulary in Industry 4.0 language.</p>
                    <p>In the I4.0 system, the I4-0 components interact and cooperate with each other within a company or across company boundaries. The meaning of the information must be available in the form of a machine-interpretable description for both the sender and receiver.</p>
                    <p>This can be achieved by modelling the parameters and states of machines as standardized properties. A standardized information model exists for the definition of properties (IEC 61360-1:2009 identical to ISO 13584-42:2010). This information model defines for each property a machine-readable identifier, a name, and a definition. Further information (meta-data) defines additional meaning carriers for the property, e.g. unit of measurement, data format, acronym, calculation equations or references to standards in which the characteristic is defined. Descriptions of machine data therefore become machine-processable information units, available in clearly defined data structures with a fixed assignment to their meaning.</p>
                    <p>The names for machine data are not necessarily unique, they can be named differently by different user groups (e.g. manufacturers), or because they have different names in different languages. For this reason, a unique identifier (ID) must be specified for each characteristic, referencing the machine-processable description of data elements.</p>
                    <p>This approach is used in IOTA transactions to give semantics to the exchanged data.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image} style={{ width: '85vw' }} />
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="industry4_language" />
                <NextPage page="message_structure" />
            </div>
        </Layout>
    )
}
