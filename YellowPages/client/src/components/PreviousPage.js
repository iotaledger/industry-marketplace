import React from 'react'
import { Link } from 'react-router-dom';

export default ({ page }) => (
    <Link to={`/${page}`}>
        <button className="navigation-btn back icon-arrow-left">
            back
        </button>
    </Link>
)
