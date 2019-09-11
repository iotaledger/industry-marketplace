import React, { PureComponent } from 'react';
import { TabsContainer, Tabs, Tab } from 'react-md';

class AssetTabs extends PureComponent {
  state = {
    activeTabIndex: 0,
  };

  onTabChange = newActiveTabIndex => {
    this.setState({ activeTabIndex: newActiveTabIndex });
    this.props.onTabChange(newActiveTabIndex);
  };

  render() {
    return (
        <TabsContainer
            activeTabIndex={this.state.activeTabIndex}
            onTabChange={this.onTabChange}
        >
            <Tabs tabId="request-details">
                <Tab label="Calls for Proposal" className="cfp" />
                <Tab label="Proposals" className="proposal" />
                <Tab label="Accepted Proposals" className="acceptProposal" />
            </Tabs>
        </TabsContainer>
    );
  }
}

export default AssetTabs;