import React from 'react'
import { Link } from 'react-router-dom';
import get from 'lodash-es/get';
import Text from './Text'
import tryIt from '../assets/img/landing/try_the_demo.svg';
import Map from '../components/map';
import Zmq from '../components/zmq';
import { getAll, removeExpired, writeToStorage } from '../utils/storage';
import { prepareData } from '../utils/card';
import '../assets/styles/content.scss'

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allAssets: [],
    };

    this.newMessage = this.newMessage.bind(this);
    this.checkExpired = this.checkExpired.bind(this);
    this.timer = null;
  }

  async componentDidMount() {
    await this.checkExpired();
    this.timer = setInterval(() => this.checkExpired(), 600000);
  }

  async checkExpired() {
    await removeExpired('callForProposal');
    const allAssets = await getAll();
    this.setState({ allAssets });
  }

  async newMessage(message) {
    const card = await prepareData(get(message, 'data'));
    console.log('card', card);
    await writeToStorage(card);
    await this.checkExpired();
  }

  render() {
    return (
        <div className="request-map-wrapper">
            <div className="text-wrapper">
                <Text className="title">Active Request Map</Text>
                <Text>Click on a pin to view the request information</Text>
            </div>
            <Zmq callback={this.newMessage} />
            <Map assets={this.state.allAssets} />
            <Link to="/demo">
                <img className="map-cta intro-page-btn secondary" src={tryIt} />
            </Link>
        </div>
    );
  }
}
