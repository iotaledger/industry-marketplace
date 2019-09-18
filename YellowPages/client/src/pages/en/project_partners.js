import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/project_partners'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Project Partners</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <h2>About eCl@ss</h2>
                    <p>eCl@ss is internationally established as the only ISO/IEC-compliant industry standard, and is thus the worldwide reference-data standard for the classification and unambiguous description of products and services. More than 3,500 customers are already successfully using the 44,000 classes and 17,000 features in 16 languages from eCl@ss for digital data exchange. In addition to traditional applications in procurement, controlling, production and distribution, eCl@ss demonstrates its particular strengths when used for cross-enterprise process-data management and in engineering functions. A standardized master-data system is the key to enterprise-wide improvements, producing benefits along the entire value chain. <a href="https://www.eclass.eu/" target="_blank" rel="noopener noreferrer">https://www.eclass.eu/</a></p>

                    <h2>About Neoception</h2>
                    <p>Neoception is your partner for secure digitalization and optimization processes of your company. Generating flexible, intuitive and dynamic software solutions perfectly adjusted to the needs and challenges of your company is our goal. This aim is also expressed in our slogan: "Think digital, add value" – we want to create sustainable benefits for our customers.</p>
                    <p>We develop individualized IoT services for small- and medium-sized businesses as well as international companies. During our projects, we work closely together with our clients. This ensures that both sides can share insights and opinions and thereby contribute to the development of the project.</p>
                    <p>Next to programming and developing software four you, we assess which undiscovered opportunities lie in your company and help you to realize the best version of it. It is important for us to ensure a fluid cooperation in every step of the way. However, our work is not done once the project is completed. Thanks to the flexible and dynamic structure of our software solutions, we continuously work on new applications, features and updates for you.</p>
                    <p>Together, we ensure the secure digitalization of your company.</p>

                    <h2>About OvGU</h2>
                    <p>The Chair of Integrated Automation at the Otto-von-Guericke-University Magdeburg (Head: Prof. Dr.-Ing. Christian Diedrich) focuses on engineering methods for automation systems, information and knowledge management, formalized structure and behavior descriptions, as well as device and product data descriptions. The team of Chair of Integrated Automation works on the conception and development of concepts for Industry 4.0, especially AAS.</p>
                    <p>Employees of the chair are active in or lead the following committees, among others:</p>
                    <ul>
                        <li>Platform I4.0/ Subgroup "Semantics and Interactions of I4.0 Components" - headed by Prof. Christian Diedrich</li>
                        <li>ZVEI - German Electrical and Electronic Manufacturers' Association SG2 "Models and Standards"</li>
                        <li>Standardization Council Industry 4.0</li>
                        <li>eCl@ss e.V.: Scientific Advisory Board, Digitalisation Expert Group</li>
                    </ul>

                    <h2>About HSU</h2>
                    <p>The Institute of Automation Technology (IfA) in the Faculty of Mechanical Engineering of the Helmut Schmidt University (HSU) currently employs 20 scientists. Basic research focuses on models and methods for the systematic engineering of automated plants. Applied research currently focuses on the introduction of digitalization technologies in production and logistics. The head of the IfA, Prof. Dr.-Ing. Alexander Fay, is a member of the scientific advisory board and the AG 2 "Research and Innovation" of the Platform Industry 4.0 and brings knowledge about technologies and solutions for Industry 4.0 into the project. The IfA is a respected test environment for Industry 4.0 and consortium partner in the "Kompetenzzentrum Mittelstand 4.0 Hamburg". Further information is to be found under <a href="www.hsu-hh.de/aut" target="_blank" rel="noopener noreferrer">www.hsu-hh.de/aut</a></p>

                    <h2>About WeWash</h2>
                    <p>WeWash is a service that makes the shared use of washing machines and dryers attractive to everyone involved. WeWash can be used via phone, website, or smartphone app (iOS, Android). Since April 2017, consumers can easily, safely, and conveniently book the next free washing machine or dryer - e.g. in the laundry room of apartment buildings or hotels. Waiting times or unnecessary walks to the laundry room are just as much a thing of the past  as the collection of coins or tokens, thanks to WeWash,. In principle, every commercially available washing machine or dryer is WeWash-ready: the Munich-based start-up, which was launched as a spin-off of the BSH home appliance group at the beginning of 2016, offers a cost-effective and easy-to-install retrofit kit. For landlords and tenants, WeWash is the clever and cost-effective entry into the smart home market. WeWash is led by Philip Laukart (CEO) and Dr. Ing. Rafael Kirschner (COO), who previously worked for BSH Hausgeräte. Further information at <a href="www.we-wash.com" target="_blank" rel="noopener noreferrer">www.we-wash.com</a></p>

                    <h2>About IOTA Foundation</h2>
                    <p>IOTA is a global not-for-profit foundation incorporated and headquartered in Germany. The IOTA Foundation’s mission is to support the research and development of new distributed ledger technologies (DLT), including the IOTA Tangle. The Foundation encourages the education and adoption of distributed ledger technologies through the creation of ecosystems and the standardization of these new protocols.</p>
                    <p>The IOTA Tangle moves beyond blockchain by providing the world’s first scalable, fee-less, and fully-decentralized distributed ledger technology. The Tangle uses its own unique technology to solve three fundamental problems with blockchain technology: high fees, scaling, and centralization. It is an open-source protocol connecting the human economy with the machine economy by facilitating novel Machine-to-Machine (M2M) interactions, including secure data transfer, fee-less micropayments, and secure access control for devices.</p>
                    <p>Visit <a href="www.iota.org" target="_blank" rel="noopener noreferrer">www.iota.org</a> for more information. Follow IOTA on Twitter: @iotatoken and YouTube: <a href="https://www.youtube.com/channel/UClxDa0qkOqxIguokXPhnuOA?view_as=subscriber" target="_blank" rel="noopener noreferrer">IOTA Foundation</a></p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="semantic_interaction_protocols" />
                <NextPage page="join" />
            </div>
        </Layout>
    )
}
