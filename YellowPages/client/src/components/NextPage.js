import React from 'react'
import { Link } from 'react-router-dom';
import Button from './Button'

export default ({ page, title }) => (
    <Link to={`/${page}`}>
        <button className="navigation-btn next icon-arrow-right">
            {title}
        </button>
    </Link>
)