import React from 'react'
import classNames from 'classnames'

import '../assets/styles/text.scss'

const Text = ({ className, children, text }) => (
    <span className={classNames('text', className)}>
        {text || children}
    </span>
)

export default Text
