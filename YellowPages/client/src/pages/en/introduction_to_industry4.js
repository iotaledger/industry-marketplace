import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import LanguageContext from '../../context/language-context'
import TranslatedPage from '../de/introduction_to_industry4'

export default () => {
    window.scrollTo(0, 0);
    const { language } = useContext(LanguageContext);
    return language === 'de' ? <TranslatedPage /> : (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Introduction to Industry 4.0</Text>
            </div>
            <div className="content scalability">
                <div className="_markdown_">
                    <p>Industry 4.0 (I4.0) promises a new level of organization and manufacturing management. The interconnection among “intelligent” manufacturing components (cyber physical systems) results in dynamic, self-organizing, self-optimizing, and cross-company value chains.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                    <p>The Plattform Industrie 4.0 offers concrete technical concepts for these purposes. The Plattform Industrie 4.0 is the central network in Germany for advancing digital transformation in manufacturing. It was founded as a joint project of the German industry associations BITKOM, VDMA, and ZVEI and actors from business, science, and research for the further development and implementation of the High-Tech Strategy of the Federal Government. The focus of the work of the Plattform Industrie 4.0 lies in bundling I4.0 expertise and making it available to companies.</p>
                    <p>One of the most important concepts of I4.0 is a so-called asset administration shell (AAS). An AAS is a kind of digital twin that provides a standardized virtual representation of a tangible asset, such as a machine, equipment unit, software etc. The basic idea is that an AAS contains a description of an asset and provides a bridge between the asset and the Internet of Things (IoT), making it available to interact in a machine-interpretable form. AAS is uniquely identifiable worldwide and is able to communicate with other I4.0 components. AAS and asset together form an I4.0 component. AAS is worldwide uniquely identifiable and is able to communicate with other I4.0 components. The basic idea is that an AAS contains a description of an asset and makes it available to other interaction partners in a machine-interpretable form.</p>
                    <p>In addition to asset information, proactive AAS contain decision and optimization algorithms that ensure the goal-oriented autonomous behavior of I4.0 components. Therefore, such I4.0 components can be considered as independent economic agents that organize their cooperation according to market economy principles.</p>
                    <p>The resulting highly flexible value creation networks require new forms of cooperation from companies - at the national and global level. A common global communication and computing infrastructure that  allows economic relationships between machines is a necessary prerequisite for the successful implementation of I4.0.</p>
                    <div className="image-wrapper">
                        <img src="../static/scalability/blockchain_bottleneck.gif"/>
                    </div>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="executive_summary" />
                <NextPage page="benefits_of_iota" />
            </div>
        </Layout>
    )
}
