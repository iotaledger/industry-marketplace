import React from 'react'
import Link from 'next/link'
import Button from './Button'

export default ({ page, title }) => (
    <Link prefetch href={`/${page}`}>
        <Button className="large secondary">
            {title}
        </Button>
    </Link>
)