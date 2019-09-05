import Layout from '../components/Layout'
import Intro from '../components/Intro'
import Features from '../components/Features'
import ContactForm from '../components/ContactForm'
import Logotypes from '../components/Logotypes';
import WhatIsMarketplace from '../components/WhatIsMarketplace';
import KeyComponents from '../components/KeyComponents';
import CallToAction from '../components/CallToAction';
import WhatTheySay from '../components/WhatTheySay';
import HowItWorks from '../components/HowItWorks';

export default () => {
    return (
        <Layout>
            <div className="intro-page">
                <section className="content-main">
                    <Intro />
                    <Logotypes />
                    <WhatIsMarketplace />
                    <HowItWorks />
                    <Features />
                    <WhatTheySay />
                    <KeyComponents />
                    <CallToAction />

                    <div className="contact-form-wrapper">
                        <ContactForm />
                    </div>
                </section>
            </div>
        </Layout>
    )
}
