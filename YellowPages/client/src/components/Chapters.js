import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Text from './Text'
import '../assets/styles/chapters.scss'

export default ({ closeNav }) => {
    return (
        <div className="chapters-outer-wrapper">
            <div className="chapters-overlay">
                <div className="close-nav" onClick={closeNav} />
                <Text className="subtitle label">Chapter</Text>
                <div className="chapters-wrapper">
                    <Link to="/">
                        <div className="chapter intro">
                            <Text className="title"> </Text>
                            <Text className="subtitle">Introduction</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/executive_summary">
                        <div className="chapter">
                            <Text className="title">01</Text>
                            <Text className="subtitle">
                                Executive Summary
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/introduction_to_industry4">
                        <div className="chapter">
                            <Text className="title">02</Text>
                            <Text className="subtitle">
                                Introduction to Industry 4.0
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/benefits_of_iota">
                        <div className="chapter">
                            <Text className="title">03</Text>
                            <Text className="subtitle">
                                The benefits of IOTA for Industry 4.0
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <div className="submodules-wrapper">
                        <Link to="/industry_marketplace">
                            <div className="chapter">
                                <Text className="title">04</Text>
                                <Text className="subtitle">
                                    The Industry Marketplace
                                </Text>
                                <Text className="read">Read</Text>
                            </div>
                        </Link>

                        <div className="subtopics enabled">
                            <Link to="/what_is_industry_marketplace">
                                <div className="subtopic">
                                    <Text className="title">1</Text>
                                    <Text className="subtitle">
                                        What is the Industry Marketplace?
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/architecture">
                                <div className="subtopic">
                                    <Text className="title">2</Text>
                                    <Text className="subtitle">
                                        Industry Marketplace Architecture
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/use_cases">
                                <div className="subtopic">
                                    <Text className="title">3</Text>
                                    <Text className="subtitle">
                                        Use-Cases
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/decentralized_identification">
                                <div className="subtopic">
                                    <Text className="title">4</Text>
                                    <Text className="subtitle">
                                        Decentralized Identification
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/technical_demonstrator">
                                <div className="subtopic">
                                    <Text className="title">5</Text>
                                    <Text className="subtitle">
                                        Technical demonstrator for Service Requester and Service Provider
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/neoception_demonstrator">
                                <div className="subtopic">
                                    <Text className="title">6</Text>
                                    <Text className="subtitle">
                                        Technical Demonstrator by eCl@ss & Neoception
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/wewash_prototype">
                                <div className="subtopic">
                                    <Text className="title">7</Text>
                                    <Text className="subtitle">
                                        Prototype Implementation by	WeWash
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <Link to="/standards">
                        <div className="chapter">
                            <Text className="title">05</Text>
                            <Text className="subtitle">
                                eCl@ss - why are standards important for I4.0?
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <div className="submodules-wrapper">
                        <Link to="/plattform_industrie4">
                            <div className="chapter">
                                <Text className="title">06</Text>
                                <Text className="subtitle">
                                    Information on Plattform Industrie 4.0
                                </Text>
                                <Text className="read">Read</Text>
                            </div>
                        </Link>

                        <div className="subtopics enabled">
                            <Link to="/industry4_language">
                                <div className="subtopic">
                                    <Text className="title">1</Text>
                                    <Text className="subtitle">
                                        Industry 4.0 language
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/vocabulary">
                                <div className="subtopic">
                                    <Text className="title">2</Text>
                                    <Text className="subtitle">
                                        Vocabulary
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/message_structure">
                                <div className="subtopic">
                                    <Text className="title">3</Text>
                                    <Text className="subtitle">
                                        Structure of the messages
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/semantic_interaction_protocols">
                                <div className="subtopic">
                                    <Text className="title">4</Text>
                                    <Text className="subtitle">
                                        Semantic interaction protocols
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Link to="/project_partners">
                        <div className="chapter">
                            <Text className="title">07</Text>
                            <Text className="subtitle">
                                Project Partners
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <div className="submodules-wrapper">
                        <Link to="/join">
                            <div className="chapter">
                                <Text className="title">08</Text>
                                <Text className="subtitle">
                                    Join the Industry Marketplace
                                </Text>
                                <Text className="read">Read</Text>
                            </div>
                        </Link>

                        <div className="subtopics enabled">
                            <Link to="/register_did">
                                <div className="subtopic">
                                    <Text className="title">1</Text>
                                    <Text className="subtitle">
                                        Register your Decentralized ID
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <Link to="/iota_tangle">
                        <div className="chapter">
                            <Text className="title">09</Text>
                            <Text className="subtitle">
                                What is The IOTA Tangle?
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
