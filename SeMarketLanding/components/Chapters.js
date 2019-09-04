import React, { useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import Text from './Text'

import '../styles/chapters.scss'

export default ({ closeNav }) => {
    const [showSubmenu, setShowSubmenu] = useState(false)
    const [background, setBackground] = useState(null)

    function hoverOn() {
        setShowSubmenu(true)
    }

    function hoverOff() {
        setShowSubmenu(false)
    }

    return (
        <div
            className={classNames('chapters-outer-wrapper', {
                [background]: background
            })}
        >
            <div className="chapters-overlay">
                <div className="close-nav" onClick={closeNav} />
                <Text className="subtitle label">Chapter</Text>
                <div className="chapters-wrapper">
                    <Link prefetch href="/">
                        <div
                            className="chapter intro"
                            onMouseEnter={() => setBackground('chapter1')}
                        >
                            <Text className="title"> </Text>
                            <Text className="subtitle">Introduction</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/scalability">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('chapter1')}
                        >
                            <Text className="title">01</Text>
                            <Text className="subtitle">
                                IOTA as scalable DLT
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/post-coordinator">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('chapter2')}
                        >
                            <Text className="title">02</Text>
                            <Text className="subtitle">
                                IOTA POST-COORDINATOR
                            </Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/modularity">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('chapter3')}
                        >
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
                        <Link prefetch href="/modules">
                            <div
                                className="chapter"
                                onMouseEnter={() => setBackground('chapter4')}
                            >
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
                            <Link prefetch href="/module1">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module1')
                                    }
                                >
                                    <Text className="title">1</Text>
                                    <Text className="subtitle">
                                        Node identities and mana
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module2">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module2')
                                    }
                                >
                                    <Text className="title">2</Text>
                                    <Text className="subtitle">
                                        Secure Auto-peering
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module3">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module3')
                                    }
                                >
                                    <Text className="title">3</Text>
                                    <Text className="subtitle">
                                        Spam protection
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module4">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module4')
                                    }
                                >
                                    <Text className="title">4</Text>
                                    <Text className="subtitle">
                                        Tip Selection Algorithm
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module5">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module5')
                                    }
                                >
                                    <Text className="title">5</Text>
                                    <Text className="subtitle">
                                        Proactive conflict resolution
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module5.1">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module51')
                                    }
                                >
                                    <Text className="title">5.1</Text>
                                    <Text className="subtitle">Shimmer</Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module5.1.1">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module511')
                                    }
                                >
                                    <Text className="title">5.1.1</Text>
                                    <Text className="subtitle">
                                        Cellular Consensus
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                            <Link prefetch href="/module5.1.2">
                                <div
                                    className="subtopic"
                                    onMouseEnter={() =>
                                        setBackground('module512')
                                    }
                                >
                                    <Text className="title">5.1.2</Text>
                                    <Text className="subtitle">
                                        Fast Probabilistic Consensus
                                    </Text>
                                    <Text className="read">Read</Text>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <Link prefetch href="/future">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('chapter5')}
                        >
                            <Text className="title">05</Text>
                            <Text className="subtitle">The Future</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/conclusion">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('chapter6')}
                        >
                            <Text className="title">06</Text>
                            <Text className="subtitle">Conclusion</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/glossary">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('glossary')}
                        >
                            <Text className="title"> </Text>
                            <Text className="subtitle">Glossary</Text>
                            <Text className="read">Read</Text>
                        </div>
                    </Link>
                    <Link prefetch href="/grants">
                        <div
                            className="chapter"
                            onMouseEnter={() => setBackground('grants')}
                        >
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
