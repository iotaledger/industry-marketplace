import React from 'react'
// import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import Button from './Button'
// import DropSelector from './DropSelector'
// import LanguageContext from '../context/language-context'
import headerLogo from '../assets/img/landing/logo.svg'

import '../assets/styles/menu.scss'

const Menu = ({ onClick }) => {
    // const { language, changeLanguage } = useContext(LanguageContext)

    return (
        <div className="menu">
            <div className="menu-logo">
                <Link to="/">
                    <img src={headerLogo} alt="logo" />
                </Link>
            </div>

            <div className="menu-links">
                // <DropSelector
                //     items={['en', 'de']}
                //     selected={language}
                //     callback={changeLanguage}
                // />

                <Link className="btn mini primary menu-link mobile-only" to="/">
                    Join
                </Link>
                <Link className="btn mini primary menu-link mobile-hidden" to="#">
                    Join & Participate
                </Link>
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
