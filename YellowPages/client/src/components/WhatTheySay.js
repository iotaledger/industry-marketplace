import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import Text from './Text'
import Carousel from './Carousel';
import videoMobile from '../assets/img/video/mobile_play.svg';
import person1 from '../assets/img/video/person1.png';
import person2 from '../assets/img/video/person2.png';
import person3 from '../assets/img/video/person3.png';
import person4 from '../assets/img/video/kroke.jpg';
import person5 from '../assets/img/video/nagel.jpg';
import person6 from '../assets/img/video/allenberg.jpg';

import '../assets/styles/content.scss'

export default () => {
    const [videoId, setVideoId] = useState(null)

    const items = [
        <React.Fragment>
            <div className="desktop-player">
                <img 
                    className="desktop" src={person4} alt="" 
                    role="button"
                    onClick={() => setVideoId('MHlok4zkKgM')}
                />
                <div 
                    className="play"
                    role="button"
                    onClick={() => setVideoId('MHlok4zkKgM')}
                />
            </div>
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('MHlok4zkKgM')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Thorsten Kroke</Text>
                <Text className="name">General Manager, eCl@ss</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <div className="desktop-player">
                <img 
                    className="desktop" src={person5} alt="" 
                    role="button"
                    onClick={() => setVideoId('qcLwdCem8mg')}
                />
                <div 
                    className="play"
                    role="button"
                    onClick={() => setVideoId('qcLwdCem8mg')}
                />
            </div>
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('qcLwdCem8mg')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Dr. Jörg Nagel</Text>
                <Text className="name">Managing Director, Neoception</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <div className="desktop-player">
                <img 
                    className="desktop" src={person6} alt="" 
                    role="button"
                    onClick={() => setVideoId('o_bkmuqeQjc')}
                />
                <div 
                    className="play"
                    role="button"
                    onClick={() => setVideoId('o_bkmuqeQjc')}
                />
            </div>
            <img
                className="mobile"
                role="button"
                onClick={() => setVideoId('o_bkmuqeQjc')}
                src={videoMobile}
                alt=""
            />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Dr. Jan Allenberg</Text>
                <Text className="name">Head of Development, WeWash</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person3} alt="Prof. Dr.-Ing. Christian Diedrich, Institute for Automation Engineering, Otto von Guericke University Magdeburg" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Prof. Dr.-Ing. Christian Diedrich</Text>
                <Text className="name">Institute for Automation Engineering, Otto von Guericke University Magdeburg</Text>
                <Text className="quote">Our physical demonstrator shows a bidding process where several machines offers their service and the requester selects the best one. The demonstrator apply the I4.0 language which is published as VDI guideline 2193. This bidding process can now be handled via the IOTA Tangle, so that on the one hand I4.0 language dialog let the products and machines understand each other and on the other hand IOTA is used as trusted and reproducible and decentralized acting middleware.</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person1} alt="Alexander Balyaev, Research Assistant, University of Magdeburg" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Alexander Belyaev</Text>
                <Text className="name">Research Assistant, Otto von Guericke University Magdeburg</Text>
                <Text className="quote">The Industry Marketplace opens up a new world of opportunities for industrial machine to machine communication. After connecting to the industry marketplace, machines have their own wallets and can offer their services. The Tangle acts as a secure, trusted data and payment transfer layer enabling direct machine to machine exchanges.</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person2} alt="Alexander Fay, Professor and Head of the Institute of Automation Technology, Helmut Schmidt University Hamburg" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">Alexander Fay</Text>
                <Text className="name">Professor and Head of the Institute of Automation Technology, Helmut Schmidt University Hamburg</Text>
                <Text className="quote">In order for machines in a value chain to communicate with each other, each machine needs to have a common understanding of the orders and needs of other machines. This is why we need semantic descriptions of the machines, orders, processes and services involved. The Industry Marketplace, shows how a common semantic understanding can be implemented based on specific standards such as e-class. Together with IOTA's underlying data and payment layer, machines can communicate autonomously using standard semantics.</Text>
            </div>
        </React.Fragment>,
    ];

    return (
        <div className="video-section-wrapper what-they-say">
            <Text className="title">Hear from Participants</Text>
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
