import React from 'react'
// import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import PreviousPage from '../../components/PreviousPage'
import NextPage from '../../components/NextPage'
import Text from '../../components/Text'
import image1 from '../../assets/img/content/Page13.png';
import image2 from '../../assets/img/content/Page18.png';
// import LanguageContext from '../../context/language-context'
// import TranslatedPage from '../de/decentralized_identification'

export default () => {
    window.scrollTo(0, 0);
    // const { language } = useContext(LanguageContext);
    // return language === 'de' ? <TranslatedPage /> : (
    return (
        <Layout>
            <div className="content-header">
                <Text className="title extra-large">Decentralized Identification</Text>
            </div>
            <div className="content">
                <div className="_markdown_">
                    <p>The execution of business transactions in a virtual marketplace requires a highly secure and trustworthy infrastructure. Methods for establishing identity are essential in ensuring greater security and reliability for the actors involved in the value chain. A well-known concept within the DLT community is DID-based (Decentralized Identifier) identification of identities, published by the W3C Credential Community Group. DID enables cryptographic authentication and certification of digital identities, that is independent of any central party (identity providers, certificate authorities, etc.).</p>
                    <p>Accordingly, the asset administration shell (AAS) has been extended to include a method of establishing identity through digital certificates. The goal of which is to create a meshed network of trust, also known as the Web of Trust model, where actors mutually certify each other's identities.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image1} style={{ width: '75vw' }} />
                </div>
                <div className="_markdown_">
                    <p>Every actor decides which other actors they trust. One’s network of trust can be extended by communicating with others to find a common actor that you both trust. In the current model, the IOTA Foundation provides digital certificates to all participating parties, and those parties initially trust the DID of the IOTA Foundation. Eventually, these participants can start to create digital certificates for their own actors, growing their network of trust towards an increasingly decentralized trust model.</p>
                </div>
                <div className="image-wrapper">
                    <img alt="" src={image2} style={{ width: '85vw' }} />
                </div>
                <div className="_markdown_">
                    <p>The DID is a URL composed of three parts: the URL scheme identifier (DID), the identifier for the DID method, and the DID method-specific identifier. The DID references a persistent and unchangeable DID document on a distributed ledger e.g. the Tangle. The DID Document contains metadata (e.g. context information, public keys, service endpoints, timestamps) to authenticate its owner and prove their association with the DID. Service endpoints in the DID document enable trusted interaction with the identity.</p>
                    <p>To protect privacy, identity owners can create and control an unlimited number of DIDs and achieve their desired separation of identity information. The methods for creating, reading, updating and deactivating the DIDs and the associated DID documents are described in the respective specification (DID method) of the decentralized system. A list of all known DID methods and their associated specifications can  be found in the <a href="https://w3c-ccg.github.io/did-method-registry/" target="_blank" rel="noopener noreferrer">DID method registry</a>. For more information about DIDs and DID method specifications, please see the <a href="https://github.com/WebOfTrustInfo/rwot5-boston/blob/master/topics-and-advance-readings/did-primer.md" target="_blank" rel="noopener noreferrer">DID Primer</a> and <a href="https://w3c-ccg.github.io/did-spec/" target="_blank" rel="noopener noreferrer">DID</a>.</p>
                </div>
            </div>
            <div className="content-footer">
                <PreviousPage page="use_cases" />
                <NextPage page="decentralized_identification_tangle" />
            </div>
        </Layout>
    )
}
