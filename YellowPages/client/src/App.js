import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GlobalState from './context/globalState'
import { ServiceFactory } from './factories/serviceFactory';
import { ApiClient } from './services/apiClient';
import HomePage from './pages/intro';
import DemoPage from './pages/demo';
import ExecutiveSummary from './pages/en/executive_summary';
import IntroductionToIndustry4 from './pages/en/introduction_to_industry4';
import BenefitsOfIota from './pages/en/benefits_of_iota';
import IndustryMarketplace from './pages/en/industry_marketplace';
import WhatIsIndustryMarketplace from './pages/en/what_is_industry_marketplace';
import Architecture from './pages/en/architecture';
import UseCases from './pages/en/use_cases';
import DecentralizedIdentification from './pages/en/decentralized_identification';
import TechnicalDemonstrator from './pages/en/technical_demonstrator';
import NeoceptionDemonstrator from './pages/en/neoception_demonstrator';
import WeWashPrototype from './pages/en/wewash_prototype';
import Standards from './pages/en/standards';
import PlattformIndustrie4 from './pages/en/plattform_industrie4';
import Industry4Language from './pages/en/industry4_language';
import Vocabulary from './pages/en/vocabulary';
import MessageStructure from './pages/en/message_structure';
import SemanticInteractionProtocols from './pages/en/semantic_interaction_protocols';
import ProjectPartners from './pages/en/project_partners';
import Eclass from './pages/en/eclass';
import Neoception from './pages/en/neoception';
import OvGU from './pages/en/ovgu';
import HSU from './pages/en/hsu';
import WeWash from './pages/en/wewash';
import IOTAFoundation from './pages/en/iota_foundation';
import Join from './pages/en/join';
import RegisterDID from './pages/en/register_did';
import IOTATangle from './pages/en/iota_tangle';
import config from './config.json';
import './assets/styles/content-page.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this._configuration = {};

        this.state = {
            isBusy: true,
            status: 'Loading Configuration...',
            statusColor: 'info'
        };
    }

    async componentDidMount() {
        try {
            ServiceFactory.register('api', () => new ApiClient(config.domain));

            this._configuration = config;

            this.setState({
                isBusy: false,
                status: '',
                statusColor: 'success'
            });
        } catch (err) {
            this.setState({
                isBusy: false,
                status: err.message,
                statusColor: 'danger'
            });
        }
    }

    render() {
        return (
            <GlobalState>
                <BrowserRouter>
                    {!this.state.status && (
                        <Switch>
                            <Route path="/" component={HomePage} exact />
                            <Route path="/demo" component={DemoPage} />
                            <Route path="/executive_summary" component={ExecutiveSummary} />
                            <Route path="/introduction_to_industry4" component={IntroductionToIndustry4} />
                            <Route path="/benefits_of_iota" component={BenefitsOfIota} />
                            <Route path="/industry_marketplace" component={IndustryMarketplace} />
                            <Route path="/what_is_industry_marketplace" component={WhatIsIndustryMarketplace} />
                            <Route path="/architecture" component={Architecture} />
                            <Route path="/use_cases" component={UseCases} />
                            <Route path="/decentralized_identification" component={DecentralizedIdentification} />
                            <Route path="/technical_demonstrator" component={TechnicalDemonstrator} />
                            <Route path="/neoception_demonstrator" component={NeoceptionDemonstrator} />
                            <Route path="/wewash_prototype" component={WeWashPrototype} />
                            <Route path="/standards" component={Standards} />
                            <Route path="/plattform_industrie4" component={PlattformIndustrie4} />
                            <Route path="/industry4_language" component={Industry4Language} />
                            <Route path="/vocabulary" component={Vocabulary} />
                            <Route path="/message_structure" component={MessageStructure} />
                            <Route path="/semantic_interaction_protocols" component={SemanticInteractionProtocols} />
                            <Route path="/project_partners" component={ProjectPartners} />
                            <Route path="/eclass" component={Eclass} />
                            <Route path="/neoception" component={Neoception} />
                            <Route path="/ovgu" component={OvGU} />
                            <Route path="/hsu" component={HSU} />
                            <Route path="/wewash" component={WeWash} />
                            <Route path="/iota_foundation" component={IOTAFoundation} />
                            <Route path="/join" component={Join} />
                            <Route path="/register_did" component={RegisterDID} />
                            <Route path="/iota_tangle" component={IOTATangle} />
                            <Route component={HomePage} />
                        </Switch>
                    )}
                </BrowserRouter>
            </GlobalState>
        );
    }
}

export default App;
