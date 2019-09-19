import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';
import ExternalMenu from './ExternalMenu'
import Menu from './Menu'
import Chapters from './Chapters'
import Disclaimer from './Disclaimer'
import Footer from './Footer'
import '../assets/styles/layout.scss'
import headerMobileLogo from '../assets/img/landing/logo_mobile.svg';

export const MenuContext = React.createContext({});

const externalPages = [
    { url: 'https://iota.org', title: 'iota' },
    { url: 'https://blog.iota.org', title: 'blog' },
    { url: 'https://docs.iota.org', title: 'docs' },
    { url: 'https://ecosystem.iota.org', title: 'ecosystem' }
]

export default ({ children }) => {
    if (window.location.pathname !== '/demo') {
        ReactGA.pageview(window.location.pathname);
    }
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
                        <Link to="/">
                            <img className="mobile-logo" src={headerMobileLogo} alt="logo" />
                        </Link>

                        <div className="show-nav" onClick={showNav} />
                        <div className="nav" id="nav">
                            <div className="close-nav" onClick={closeNav} />

                            <ExternalMenu
                                className="nav-external"
                                pages={externalPages}
                            />

                            <Menu onClick={showNav} />
                        </div>

                        { children }

                        <Footer />
                    </div>
                )
            }
            <Disclaimer />
        </MenuContext.Provider>
    )
}
