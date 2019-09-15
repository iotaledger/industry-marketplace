import React from 'react'
import { Link } from 'react-router-dom';

export default ({ page }) => (
    <Link to={`/${page}`}>
        <button className="navigation-btn next icon-arrow-right">
            next page
        </button>
    </Link>
)
