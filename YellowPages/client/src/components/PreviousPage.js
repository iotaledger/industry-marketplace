import React from 'react'
import { Link } from 'react-router-dom';
import Button from './Button'

export default ({ page, title }) => (
    <Link to={`/${page}`}>
        <Button className="large secondary">
            {title}
        </Button>
    </Link>
)