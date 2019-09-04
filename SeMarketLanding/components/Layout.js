import React, { useState } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'

import * as gtag from '../lib/gtag'
import ExternalMenu from './ExternalMenu'
import Menu from './Menu'
import Chapters from './Chapters'
import Disclaimer from './Disclaimer'
import '../styles/layout.scss'

export const MenuContext = React.createContext({});

Router.onRouteChangeComplete = url => {
    gtag.pageview(url)
}

const defaultTitle = 'Coordicide - Powered by IOTA'

const externalPages = [
    { url: 'https://iota.org', title: 'iota' },
    { url: 'https://blog.iota.org', title: 'blog' },
    { url: 'https://docs.iota.org', title: 'docs' },
    { url: 'https://ecosystem.iota.org', title: 'ecosystem' }
]

export default ({ children, title = defaultTitle }) => {
    const [showOverlay, toggleShowOverlay] = useState(false);

    function showNav() {
        toggleShowOverlay(true)
    }
    
    function closeNav() {
        toggleShowOverlay(false)
    }

    return (
        <MenuContext.Provider value={{ showMenu: showNav }}>
            {
                showOverlay ? <Chapters closeNav={closeNav} /> : (
                    <div className="page">
                        <Head>
                            <title>{title}</title>
                            <meta charSet="utf-8" />
                            <meta
                                name="viewport"
                                content="initial-scale=1.0, width=device-width"
                            />
                        </Head>

                        <Link prefetch href="/">
                            <img className="mobile-logo" src="/static/marketing_assets/landing/logo.svg" />
                        </Link>

                        <div className="show-nav" onClick={showNav} />
                        <div className="nav" id="nav">
                            <div className="close-nav" onClick={closeNav} />

                            <ExternalMenu
                                className="nav-external"
                                pages={externalPages}
                                Link={Link}
                            />

                            <Menu onClick={showNav} />
                        </div>

                        { children }

                        <footer className="footer" id="footer">
                            <a href="https://iota.org" target="_blank">
                                <img className="footer-iota-logo" src="/static/marketing_assets/landing/powered_by_iota.svg" />
                            </a>
                        </footer>
                    </div>
                )
            }
            <Disclaimer />
        </MenuContext.Provider>
    )
}
