import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image1 from '../../assets/img/content/Page04.png';
import image2 from '../../assets/img/content/Page05.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/introduction_to_industry4'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Introduction to Industry 4.0</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>Industry 4.0 (I4.0) promises substantial changes in  organizational and manufacturing management. Interaction between “intelligent” manufacturing components (i.e. cyber physical systems) will yield dynamic, self-organizing, self-optimizing, cross-company value chains.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image1} style={{ width: '95vw' }} />
                </div>
                <div className="_markdown_">
                    <p>The Plattform Industrie 4.0 offers a concrete technical specification for I4.0. The Plattform Industrie 4.0 is the central network in Germany for advancing digital transformation in manufacturing. It was founded as a joint project of the German industrial associations BITKOM, VDMA, and ZVEI and parties across business, science, and research to further develop and implement the Federal Government’s High-Tech Strategy.The focus of the Plattform Industrie 4.0’s work lies in bundling I4.0 expertise in a way that makes it easily-accessible  to companies.</p>
                    <p>One of Plattform Industrie 4.0’s most important concepts for I4.0 is a so-called asset administration shell (AAS). An AAS is a form of digital twin that provides a standardized virtual representation of a tangible asset, such as a machine, equipment unit, or software. The basic idea is that an AAS contains an asset’s description and provides a bridge between that asset and the Internet of Things (IoT), thereby making it available to interact in a machine-interpretable form.Together, an AAS and an asset form an I4.0 component, uniquely identifiable and able to communicate with other I4.0 components.</p>
                    <p>Using proactive decision and optimisation algorithms, I4.0 components can then engage in goal-oriented behaviours, as independent economic agents, together cooperating under market economy principles. Such interactions will lead to highly-flexible value creation networks, in which companies can cooperate in novel ways at both a national and global level.</p>
                    <p>At the core of I4.0, will be a global communication and computing infrastructure that facilitates economic relationships between machines. This is where IOTA comes in.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image2} style={{ width: '65vw' }}/>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="executive_summary" />
                <NextPage page="benefits_of_iota" />
            </div>
        </Layout>
    )
}
