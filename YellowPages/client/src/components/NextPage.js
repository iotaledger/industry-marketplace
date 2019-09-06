import React from 'react'
import { Link } from 'react-router-dom';
import Button from './Button'

export default ({ page, title }) => (
    <Link to={`/${page}`}>
        <Button  icon="next" className="large primary">
            <span>{title}</span>
        </Button>
    </Link>
)