import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import '../assets/styles/button.scss'

export default ({ className, onClick, children, icon, type }) => (
    <button
        onClick={onClick}
        className={classNames('btn', className)}
        type={type || 'button'}
    >
        {
            icon && icon === 'menu' ? <FontAwesomeIcon icon={faBars} /> : null
        }
        {children}
    </button>
)
