import React, { PureComponent } from 'react';
import sizeMe from 'react-sizeme';
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
            className="tabsWrapper"
            activeTabIndex={this.state.activeTabIndex}
            onTabChange={this.onTabChange}
        >
            <Tabs tabId="item-details" mobile={this.props.size.width <= 768}>
                <Tab label="Calls for Proposal" className="cfp" />
                <Tab label="Proposals" className="proposal" />
                <Tab label="Accepted Proposals" className="acceptProposal" />
            </Tabs>
        </TabsContainer>
    );
  }
}

export default sizeMe({ monitorHeight: false })(AssetTabs);