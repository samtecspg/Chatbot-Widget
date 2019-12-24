'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _materializeCss = require('materialize-css');

var _materializeCss2 = _interopRequireDefault(_materializeCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collapsible = function (_Component) {
  _inherits(Collapsible, _Component);

  function Collapsible(props) {
    _classCallCheck(this, Collapsible);

    var _this = _possibleConstructorReturn(this, (Collapsible.__proto__ || Object.getPrototypeOf(Collapsible)).call(this, props));

    _this.state = {
      activeKey: props.defaultActiveKey
    };

    _this.renderItem = _this.renderItem.bind(_this);
    _this.handleSelect = _this.handleSelect.bind(_this);
    return _this;
  }

  _createClass(Collapsible, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (typeof _materializeCss2.default !== 'undefined') {
        this.instance = _materializeCss2.default.Collapsible.init(this.collapsibleRef, Object.assign({
          accordion: this.props.accordion
        }, this.props.options));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.instance) {
        this.instance.destroy();
      }
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(key) {
      var keyValue = key;
      var onSelect = this.props.onSelect;


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
  }, {
    key: 'renderItem',
    value: function renderItem(child, key) {
      if (!child) return null;
      var props = {
        onSelect: this.handleSelect
      };

      // Extend with props if child is a react component
      if (typeof child.type === 'function') {
        Object.assign(props, {
          expanded: this.state.activeKey === key || child.props.expanded,
          eventKey: key
        });
      }

      return _react2.default.cloneElement(child, props);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          accordion = _props.accordion,
          popout = _props.popout,
          className = _props.className,
          children = _props.children,
          defaultActiveKey = _props.defaultActiveKey,
          onSelect = _props.onSelect,
          options = _props.options;


      var collapsible = accordion ? 'accordion' : 'expandable';
      var classes = {
        collapsible: collapsible,
        expandable: accordion !== true,
        popout: popout
      };

      return _react2.default.createElement(
        'ul',
        {
          ref: function ref(node) {
            _this2.collapsibleRef = node;
          },
          className: (0, _classnames2.default)(className, classes),
          'data-collapsible': collapsible,
          defaultactivekey: defaultActiveKey,
          onSelect: onSelect,
          options: options
        },
        _react2.default.Children.map(children, this.renderItem)
      );
    }
  }]);

  return Collapsible;
}(_react.Component);

Collapsible.propTypes = {
  /**
   * There are two ways a collapsible can behave.
   * It can either allow multiple sections to stay open,
   * or it can only allow one section to stay open at a time,
   * which is called an accordion.
   * @default true
   */
  accordion: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  children: _propTypes2.default.node,
  /**
   * Enable popout style
   */
  popout: _propTypes2.default.bool,
  /**
   * The default CollapsibleItem that should be expanded. This value should match the specified
   * item's eventKey value. Ignored if accordion is false.
   */
  defaultActiveKey: _propTypes2.default.any,
  onSelect: _propTypes2.default.func,
  /**
   * Options passed to initializer
   */
  options: _propTypes2.default.any
};

Collapsible.defaultProps = {
  accordion: true
};

exports.default = Collapsible;
module.exports = exports['default'];