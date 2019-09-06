import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ExternalMenu from './ExternalMenu'
import Menu from './Menu'
import Chapters from './Chapters'
import Disclaimer from './Disclaimer'
import '../assets/styles/layout.scss'
import headerLogo from '../assets/img/landing/logo.svg';
import footerLogo from '../assets/img/landing/powered_by_iota.svg';

export const MenuContext = React.createContext({});

const externalPages = [
    { url: 'https://iota.org', title: 'iota' },
    { url: 'https://blog.iota.org', title: 'blog' },
    { url: 'https://docs.iota.org', title: 'docs' },
    { url: 'https://ecosystem.iota.org', title: 'ecosystem' }
]

export default ({ children }) => {
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
                            <img className="mobile-logo" src={headerLogo} />
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

                        <footer className="footer" id="footer">
                            <a href="https://iota.org" target="_blank">
                                <img className="footer-iota-logo" src={footerLogo} />
                            </a>
                        </footer>
                    </div>
                )
            }
            <Disclaimer />
        </MenuContext.Provider>
    )
}
