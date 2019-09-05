import classNames from 'classnames';
import React from 'react';
import ClickOutside from './ClickOutside';

import '../assets/styles/drop-selector.scss'

class DropSelector extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };

        this.handleExpand = this.handleExpand.bind(this);
    }

    handleExpand() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    render() {
        return (
            <ClickOutside onClickOutside={this.state.isExpanded ? this.handleExpand : undefined}>
                <div className={classNames(
                    'drop-selector',
                    { 'drop-selector__expanded': this.state.isExpanded }
                )}
                style={this.props.style}>
                    <div className="drop-selector-title" onClick={this.handleExpand}>
                        <div className="drop-selector-title__text">{this.props.selected}</div>
                        <div className="drop-selector-title__icon"></div>
                    </div>
                    <ul className="drop-selector-list">
                        {this.props.items.filter(item => item !== this.props.selected).map(item => (
                            <li key={item} className={classNames(
                                'drop-selector-list-item',
                                { 'drop-selector-list-item__selected': item === this.props.selected }
                            )}>
                                <a role="button" onClick={() => this.props.callback(item)}>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </ClickOutside>);
    }
}

export default DropSelector;