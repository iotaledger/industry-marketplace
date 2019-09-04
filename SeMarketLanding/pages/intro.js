import Layout from '../components/Layout'
import Intro from '../components/Intro'
import Features from '../components/Features'
import ContactForm from '../components/ContactForm'
import Logotypes from '../components/Logotypes';
import WhatIsMarketplace from '../components/WhatIsMarketplace';
import KeyComponents from '../components/KeyComponents';
import Video from '../components/Video';
import CallToAction from '../components/CallToAction';

export default () => {
    return (
        <Layout>
            <div className="intro-page">
                <section className="content-main">
                    <Intro />
                    <Logotypes />
                    <WhatIsMarketplace />
                    <Features />
                    <Video />
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
