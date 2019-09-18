import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image1 from '../../assets/img/content/Page23.png';
import image2 from '../../assets/img/content/demo5.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/neoception_demonstrator'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Technical Demonstrator by eCl@ss & Neoception</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The technical demonstrator developed by eCl@ss and Neoception is depicted below. On the left hand side it shows a process (round table) monitored by several IO-Link capable industrial Sensors of Pepperl+Fuchs. The container filling levels are measured by ultrasonic and optical sensors. The presence of a container is detected by an RFID enabled sensor and a light barrier. The sensors are connected to the Industry Marketplace via an industrial gateway. The gateway enables the sensors to act as a service provider within the Industry Marketplace.</p>
                    <p>The IOTA Market Manager is fully compatible with the concept of the AAS (Asset Administration Shell). The AAS helps to describe the offerings of the sensors in a machine readable and Industry 4.0 compatible way. The meaning of the sensor data is clearly described through its integration of the eCl@ss semantic catalogue. This enables service requesters to discover the sensor data they need, negotiate on conditions to access the data, and pay the sensor for their service after successful negotiation.</p>
                    <p>With the Industry Marketplace, service providers are able to offer their data without manual interaction. For example, a sensor network operator could offer the data of each individual sensor via the Industry Marketplace. Service requesters who need the data to optimize industrial processes can discover the data they need for optimization, subscribe to the data and pay the sensor network provider for his service.</p>
                    <p>The presented demonstrator is a first step towards a sensor offering its data via the Industry Marketplace and earning a revenue autonomously. The sensor could later buy the energy it needs to operate via the marketplace as a service requester.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image1} style={{ width: '65vw' }} />
                </div>
                <div className="_markdown_">
                    <h2>Demonstration Scenario of eCl@ss and Neoception</h2>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image2} style={{ width: '45vw' }} />
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="technical_demonstrator" />
                <NextPage page="wewash_prototype" />
            </div>
        </Layout>
    )
}
