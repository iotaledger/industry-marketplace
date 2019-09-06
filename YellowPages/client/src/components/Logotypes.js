import React from 'react'
import iota from '../assets/img/logos/iota.svg'
import eclass from '../assets/img/logos/eclass.svg';
import hsu from '../assets/img/logos/hsu.svg';
import neoception from '../assets/img/logos/neoception.svg';
import ovgu from '../assets/img/logos/ovgu.svg';
import wewash from '../assets/img/logos/wewash.svg';

import '../assets/styles/content.scss'

export default () => (
    <div className="logotypes-wrapper">
        <img src={eclass} alt="eclass" />
        <img src={neoception} alt="neoception" />
        <img src={ovgu} alt="ovgu" />
        <img src={hsu} alt="hsu" />
        <img src={wewash} alt="wewash" />
        <img src={iota} alt="IOTA" />
    </div>
)

