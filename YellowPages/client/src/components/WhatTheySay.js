import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Text from './Text'
import Carousel from './Carousel';
import videoDesktop from '../assets/img/video/video_section.svg';
import videoMobile from '../assets/img/video/mobile_play.svg';
import person1 from '../assets/img/video/person1.png';
import person2 from '../assets/img/video/person2.png';

import '../assets/styles/content.scss'

export default () => {
    const [videoId, setVideoId] = useState(null)

    const items = [
        <React.Fragment>
            <img
                className="desktop"
                role="button"
                onClick={() => setVideoId('MHlok4zkKgM')}
                src={videoDesktop}
                alt=""
            />
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('MHlok4zkKgM')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Hear from Industry Marketplace participants</Text>
                <Text className="name">Thorsten Kroke, General Manager, eCl@ss</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img
                className="desktop"
                role="button"
                onClick={() => setVideoId('qcLwdCem8mg')}
                src={videoDesktop}
                alt=""
            />
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('qcLwdCem8mg')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Hear from Industry Marketplace participants</Text>
                <Text className="name">Dr. Jörg Nagel, Managing Director, Neoception</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img
                className="desktop"
                role="button"
                onClick={() => setVideoId('HFO4cmHd1Ok')}
                src={videoDesktop}
                alt=""
            />
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('HFO4cmHd1Ok')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Hear from Industry Marketplace participants</Text>
                <Text className="name">Dr. Jan Allenberg, Head of Development, WeWash</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person1} alt="Alexander Balyaev, Research Assistant, University of Magdeburg" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Hear from Industry Marketplace participants</Text>
                <Text className="name">Alexander Belyaev, Research Assistant, Otto von Guericke University Magdeburg</Text>
                <Text className="quote">The Industry Marketplace opens up a new world of opportunities for industrial machine to machine communication. After connecting to the industry marketplace, machines have their own wallets and can offer their services. The Tangle acts as a secure, trusted data and payment transfer layer enabling direct machine to machine exchanges.</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person2} alt="Alexander Fay, Professor and Head of the Institute of Automation Technology, Helmut Schmidt University" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Hear from Industry Marketplace participants</Text>
                <Text className="name">Alexander Fay, Professor and Head of the Institute of Automation Technology, Helmut Schmidt University Hamburg</Text>
                <Text className="quote">In order for machines in a value chain to communicate with each other, each machine needs to have a common understanding of the orders and needs of other machines. This is why we need semantic descriptions of the machines, orders, processes and services involved. The Industry Marketplace, shows how a common semantic understanding can be implemented based on specific standards such as e-class. Together with IOTA's underlying data and payment layer, machines can communicate autonomously using standard semantics.</Text>
            </div>
        </React.Fragment>,
    ];

    return (
        <div className="video-section-wrapper">
            <Carousel items={items} />
            <ModalVideo
                channel='youtube'
                autoplay
                allowFullScreen
                isOpen={!!videoId}
                videoId={videoId}
                onClose={() => setVideoId(null)}
            />
        </div>
    )
}
