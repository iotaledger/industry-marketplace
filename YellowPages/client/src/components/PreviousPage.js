import React from 'react'
import { Link } from 'react-router-dom';
import Button from './Button'

export default ({ page, title }) => (
    <Link to={`/${page}`}>
        <button className="navigation-btn back icon-arrow-left">
            {title}
        </button>
    </Link>
)