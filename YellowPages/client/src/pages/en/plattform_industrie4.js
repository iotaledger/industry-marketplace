import React from 'react'
// import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/plattform_industrie4'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Information on Plattform Industrie 4.0</Text>
                <Text className="subtitle">What is the Asset Administration Shell (AAS)?</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The AAS ensures digital integration of assets (machines and their components, supply materials, parts and products, exchanged documents, contracts, orders) into Industry 4.0 communication. It enables controlled access to all asset information, providing a standardised and secure communication interface. The AAS can also integrate “passive“ assets without a communication interface, e.g. via barcodes or QR codes, to become addressable in the network. (Source: <a href="https://www.plattform-i40.de/I40/Redaktion/EN/Downloads/Publikation/vws-in-detail-presentation.pdf?__blob=publicationFile&v=7" target="_blank" rel="noopener noreferrer">Details of the Administration shell - from idea to implementation</a>)</p>
                    <p>The basic idea is to provide each asset (individual device or system) at least one AAS, which contains a minimal but sufficient description of the asset along its lifecycle. The AAS makes the asset available for interaction in a secure, standardized, and machine-interpretable form. Every AAS is uniquely identifiable and enables communication with other I4.0 components throughout the world. </p>
                    <p>The basic structure and elements of the administrative shell have already been specified under Plattform Industrie 4.0. In <a href="https://www.plattform-i40.de/PI40/Redaktion/DE/Downloads/Publikation/struktur-der-verwaltungsschale.html" target="_blank" rel="noopener noreferrer">[1]</a> the structure of the AAS is described. In <a href="https://www.plattform-i40.de/PI40/Redaktion/DE/Downloads/Publikation/2018-verwaltungsschale-im-detail.html" target="_blank" rel="noopener noreferrer">[2]</a> a metamodel of the administration shell is defined. <a href="https://www.plattform-i40.de/PI40/Redaktion/DE/Downloads/Publikation/2019-verwaltungsschale-in-der-praxis.html" target="_blank" rel="noopener noreferrer">[3]</a> identifies different forms of administrative shells, describing their components extensively.</p>
                    <p>AAS can be provided in different forms (7). A distinction can be made between passive and active AAS, referring to the role that the AAS plays in the value chain.</p>
                    <p>Active and passive AAS:</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>Passive AAS contain a description of properties, parameters, variables, and process capabilities in the form of submodels. This abstraction of assets can be accessed, read, and manipulated by other components. Passive AAS can only respond to external requests and commands; they are not able to take the initiative or make their own decisions.</p>
                    <p>Active AAS, on the other hand, can autonomously activate interaction with external AAS, on the basis of an objective (e.g. to act as economically as possible). The active AAS establish contact with each other and perform cooperative tasks without higher-level, centrally controlling, non-AAS-based applications.</p>
                    <p>I4.0 components with an active AAS can be considered as independent service providers. Similar to the process of creating companies on the traditional free market, the I4.0 components are considered as autonomous economic actors. These act as independent economic agents that cooperate according to market economy principles. The AAS thus forms the digital core for use cases in autonomous systems and automation.</p>
                    <p>The challenge: I4.0 components must be able to talk to each other, offer services, and, if necessary, negotiate tasks. In some application scenarios, the I4.0 components act as independent service providers and consumers who pay and are paid for provided services. In order to do so, they need a common communication infrastructure. <Link to={'/iota_tangle'}>The IOTA Tangle</Link> provides that communication infrastructure.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="standards" />
                <NextPage page="industry4_language" />
            </div>
        </Layout>
    )
}
