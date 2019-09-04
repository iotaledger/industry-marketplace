import React from 'react'
import Link from 'next/link'

import '../styles/external-menu.scss'

const ExternalMenu = ({ pages }) => (
    <div className="external-menu">
        <div />
        <div className="external-menu-links">
            {pages.map(page => (
                <Link href={page.url} key={page.title}>
                    <a className="external-menu-link" target="_blank">
                        {page.title}
                    </a>
                </Link>
            ))}
        </div>
    </div>
)

export default ExternalMenu
