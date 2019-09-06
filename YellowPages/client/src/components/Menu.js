import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import React, { useContext } from 'react'
import Button from './Button'
import DropSelector from './DropSelector'
import LanguageContext from '../context/language-context';
import headerLogo from '../assets/img/landing/logo.svg';

import '../assets/styles/menu.scss'

const Menu = ({ onClick }) => {
    const { language, changeLanguage } = useContext(LanguageContext)


    return (
        <div className="menu">
            <div className="menu-logo">
                <Link to="/">
                    <img src={headerLogo} />
                </Link>
            </div>

            <div className="menu-links">
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
