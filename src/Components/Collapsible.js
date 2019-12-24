import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import M from 'materialize-css';

class Collapsible extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: props.defaultActiveKey
    };

    this.renderItem = this.renderItem.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    if (typeof M !== 'undefined') {
      this.instance = M.Collapsible.init(this.collapsibleRef, Object.assign({
        accordion: this.props.accordion
      }, this.props.options));
    }
  }

  componentWillUnmount() {
    if (this.instance) {
      this.instance.destroy();
    }
  }

  handleSelect(key) {
    let keyValue = key;
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(keyValue);
    }

    if (this.state.activeKey === key) {
      keyValue = null;
    }

    if (this.props.accordion) {
      this.setState({ activeKey: keyValue });
    }
  }

  renderItem(child, key) {
    if (!child) return null;
    const props = {
      onSelect: this.handleSelect
    };

    // Extend with props if child is a react component
    if (typeof child.type === 'function') {
      Object.assign(props, {
        expanded: this.state.activeKey === key || child.props.expanded,
        eventKey: key
      });
    }

    return React.cloneElement(child, props);
  }

  render() {
    const {
      accordion, popout, className, children,
      defaultActiveKey, onSelect, options
    } = this.props;

    const collapsible = accordion ? 'accordion' : 'expandable';
    const classes = {
      collapsible,
      expandable: accordion !== true,
      popout
    };

    return (
      <ul
        ref={node => {
          this.collapsibleRef = node;
        }}
        className={cx(className, classes)}
        data-collapsible={collapsible}
        defaultactivekey={defaultActiveKey}
        onSelect={onSelect}
        options={options}
      >
        {React.Children.map(children, this.renderItem)}
      </ul>
    );
  }
}

Collapsible.propTypes = {
  /**
   * There are two ways a collapsible can behave.
   * It can either allow multiple sections to stay open,
   * or it can only allow one section to stay open at a time,
   * which is called an accordion.
   * @default true
   */
  accordion: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  /**
   * Enable popout style
   */
  popout: PropTypes.bool,
  /**
   * The default CollapsibleItem that should be expanded. This value should match the specified
   * item's eventKey value. Ignored if accordion is false.
   */
  defaultActiveKey: PropTypes.any,
  onSelect: PropTypes.func,
  /**
   * Options passed to initializer
   */
  options: PropTypes.any
};

Collapsible.defaultProps = {
  accordion: true
};

export default Collapsible;
