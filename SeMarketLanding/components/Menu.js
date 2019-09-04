import Link from 'next/link'
import { withRouter } from 'next/router'
import React, { useContext } from 'react'
import Button from './Button'
import DropSelector from './DropSelector'
import LanguageContext from '../context/language-context';

import '../styles/menu.scss'

const Menu = ({ onClick, router }) => {
    const { language, changeLanguage } = useContext(LanguageContext)


    return (
        <div className="menu">
            <div className="menu-logo">
                <Link prefetch href="/">
                    <img src="/static/marketing_assets/landing/logo.svg" />
                </Link>
            </div>

            <div className="menu-links">
                {
                    // router.pathname !== '/' ? (
                    //     <Link prefetch href="/">
                    //         <a className="menu-link intro">
                    //             Introduction
                    //         </a>
                    //     </Link>
                    // ) : null
                }
                {
                    // <Link prefetch href="/">
                    //     <a className="menu-link-mobile intro">Intro</a>
                    // </Link>
                }
                <DropSelector
                    items={['en', 'de']}
                    selected={language}
                    callback={changeLanguage}
                />
                <a
                    className="btn mini primary menu-link"
                    href="#"
                >
                    Join & Participate
                </a>
                <Button
                    icon="menu"
                    className="menu-link contents"
                    onClick={onClick}
                >
                    <span>Menu</span>
                </Button>
            </div>
        </div>
    )
}

export default withRouter(Menu)
