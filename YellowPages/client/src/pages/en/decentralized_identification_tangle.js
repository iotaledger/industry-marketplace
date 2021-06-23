import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image from '../../assets/img/content/Page19.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/decentralized_identification'

//TODO: Migrate DID; Text about IOTA Identity
export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Decentralized Identification and the Tangle</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The DID method used within the Industry Marketplace is liberally based on BiiLabs' <a href="https://github.com/TangleID/TangleID/blob/develop/did-method-spec.md" target="_blank" rel="noopener noreferrer">TangleID DID method specification</a>. It will later become a separate, official Tangle-based DID method specification. The chosen DID method namestring is “iota”. DID Documents are stored and managed in MAM channels, and the initial channel ID is used as the DID method-specific identifier.</p>
                    <p>It is important that DIDs are globally resolvable within the chosen decentralized system. The Tangle DID creation process is shown in the following figure. First, a seed is generated and a MAM channel is created associated with that seed. Together with the prefix of the DID of the asset administration shell, the Initial channel ID forms: “did:iota.”. A DID document is created and stored as a MAM message on the Tangle. Each later revision of the DID document is added as a new document on the same MAM channel. Only the last entry in the MAM channel is valid.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image} style={{ width: '95vw' }} />
                </div>
                <div className="_markdown_">
                    <p>DIDs enable the use of a concept developed by the W3C Verifiable Claims Working Group known as of verifiable claims. Claims are statements (e.g. qualifications, services, qualities, or background information) about identities (e.g. person, organization, concept, or device). For example, verifiable claims can be useful in proving one is over a certain age or that a device originates from a certain manufacturer. From verifiable claims, verifiable credentials are formed, which serve as tamper-proof credentials on the basis of digital signatures.</p>
                    <p>Verifiable Credentials offer a medium to prove which other actors have identified an actor as trusted. All DIDs of the participants of the Industry Marketplace have received a Verifiable Credential stating they are a trusted actor from the IOTA Foundation’s DID. This feature can later be extended to not only identify actors as trustworthy, but to  also prove the attributes of a machine and its ability to fulfill a request.</p>
                    <p>For more information about verifiable credentials and verifiable claims, please visit <a href="https://www.twentyse7en.ch/" target="_blank" rel="noopener noreferrer">Verifiable Credentials Data Model</a>.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="decentralized_identification" />
                <NextPage page="technical_demonstrator" />
            </div>
        </Layout>
    )
}
