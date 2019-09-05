import React, { useState } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom';
import Text from './Text'

import '../assets/styles/chapters.scss'

export default ({ closeNav }) => {
    const [showSubmenu, setShowSubmenu] = useState(false)

    function hoverOn() {
        setShowSubmenu(true)
    }

    function hoverOff() {
        setShowSubmenu(false)
    }

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
                    <Link to="/scalability">
                        <div className="chapter">
                            <Text className="title">01</Text>
                            <Text className="subtitle">
                                IOTA as scalable DLT
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/post-coordinator">
                        <div className="chapter">
                            <Text className="title">02</Text>
                            <Text className="subtitle">
                                IOTA POST-COORDINATOR
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/modularity">
                        <div className="chapter">
                            <Text className="title">03</Text>
                            <Text className="subtitle">Modularity</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <div
                        className="submodules-wrapper"
                        onMouseEnter={hoverOn}
                        onMouseLeave={hoverOff}
                    >
                        <Link to="/modules">
                            <div className="chapter">
                                <Text className="title">04</Text>
                                <Text className="subtitle">The Modules</Text>
                                <Text className="read">Read</Text>
                            </div>
                        </Link>

                        <div
                            className={classNames('subtopics', {
                                enabled: showSubmenu
                            })}
                        >
                            <Link to="/module1">
                                <div className="subtopic">
                                    <Text className="title">1</Text>
                                    <Text className="subtitle">
                                        Node identities and mana
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module2">
                                <div className="subtopic">
                                    <Text className="title">2</Text>
                                    <Text className="subtitle">
                                        Secure Auto-peering
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module3">
                                <div className="subtopic">
                                    <Text className="title">3</Text>
                                    <Text className="subtitle">
                                        Spam protection
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module4">
                                <div className="subtopic">
                                    <Text className="title">4</Text>
                                    <Text className="subtitle">
                                        Tip Selection Algorithm
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module5">
                                <div className="subtopic">
                                    <Text className="title">5</Text>
                                    <Text className="subtitle">
                                        Proactive conflict resolution
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module5.1">
                                <div className="subtopic">
                                    <Text className="title">5.1</Text>
                                    <Text className="subtitle">Shimmer</Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module5.1.1">
                                <div className="subtopic">
                                    <Text className="title">5.1.1</Text>
                                    <Text className="subtitle">
                                        Cellular Consensus
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link to="/module5.1.2">
                                <div className="subtopic">
                                    <Text className="title">5.1.2</Text>
                                    <Text className="subtitle">
                                        Fast Probabilistic Consensus
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <Link to="/future">
                        <div className="chapter">
                            <Text className="title">05</Text>
                            <Text className="subtitle">The Future</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/conclusion">
                        <div className="chapter">
                            <Text className="title">06</Text>
                            <Text className="subtitle">Conclusion</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/glossary">
                        <div className="chapter">
                            <Text className="title"> </Text>
                            <Text className="subtitle">Glossary</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link to="/grants">
                        <div className="chapter">
                            <Text className="title"> </Text>
                            <Text className="subtitle">Grants</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
