import React, { useState } from 'react'
import ModalVideo from 'react-modal-video'
import { Link } from 'react-router-dom';
import Text from './Text'
import Carousel from './Carousel';
import videoDesktop from '../assets/img/video/video_section.svg';
import videoMobile from '../assets/img/video/mobile_play.svg';
import person1 from '../assets/img/video/person1.png';
import person2 from '../assets/img/video/person2.png';

import '../assets/styles/content.scss'

export default () => {
    const [showVideo, setShowVideo] = useState(false)

    const items = [
        // <React.Fragment>
        //     <img
        //         className="desktop"
        //         role="button"
        //         onClick={() => setShowVideo(true)}
        //         src={videoDesktop}
        //         alt=""
        //     />
        //     <img
        //         className="mobile"
        //         role="button"
        //         onClick={() => setShowVideo(true)}
        //         src={videoMobile}
        //         alt=""
        //     />
        //     <div className="video-section-text-wrapper what-they-say">
        //         <Text className="title">What they say</Text>
        //         <Text className="name">Patrick Placeholder, IOTA Foundation</Text>
        //         <Text className="quote">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat</Text>
        //         <Link to="/scalability">
        //             <Text className="link">See All Testimonioals</Text>
        //         </Link>
        //     </div>
        // </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person1} alt="Alexander Balyaev, Research Assistant, University of Magdeburg" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">What they say</Text>
                <Text className="name">Alexander Balyaev, Research Assistant, University of Magdeburg</Text>
                <Text className="quote">The Industry Marketplace opens up a new world of opportunities for industrial machine to machine communication. After connecting to the industry marketplace, machines have their own wallets and can offer their services. The Tangle acts as a secure, trusted data and payment transfer layer enabling direct machine to machine exchanges.</Text>
            </div>
        </React.Fragment>,
        <React.Fragment>
            <img className="desktop face" src={person2} alt="Alexander Fay, Professor and Head of the Institute of Automation Technology, Helmut Schmidt University" />
            <div className="video-section-text-wrapper what-they-say">
                <Text className="title">What they say</Text>
                <Text className="name">Alexander Fay, Professor and Head of the Institute of Automation Technology, Helmut Schmidt University</Text>
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
                isOpen={showVideo}
                videoId='guNNqEeu6gY'
                onClose={() => setShowVideo(false)}
            />
        </div>
    )
}
