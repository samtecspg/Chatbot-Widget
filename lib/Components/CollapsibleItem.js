'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CollapsibleItem = function CollapsibleItem(_ref) {
  var className = _ref.className,
      eventKey = _ref.eventKey,
      expanded = _ref.expanded,
      header = _ref.header,
      children = _ref.children,
      icon = _ref.icon,
      Node = _ref.node,
      onSelect = _ref.onSelect;
  return _react2.default.createElement(
    'li',
    { className: (0, _classnames2.default)(className, { active: expanded }) },
    _react2.default.createElement(
      Node,
      {
        className: (0, _classnames2.default)('collapsible-header', { active: expanded }),
        onClick: function onClick() {
          return onSelect(eventKey);
        }
      },
      icon,
      header
    ),
    _react2.default.createElement(
      'div',
      { className: 'collapsible-body' },
      children
    )
  );
};

CollapsibleItem.propTypes = {
  header: _propTypes2.default.any.isRequired,
  icon: _propTypes2.default.node,
  children: _propTypes2.default.node,
  onSelect: _propTypes2.default.func,
  /**
   * If the item is expanded by default. Overridden if the parent Collapsible is an accordion.
   * @default false
   */
  expanded: _propTypes2.default.bool,
  /**
   * The value to pass to the onSelect callback.
   */
  eventKey: _propTypes2.default.any,
  className: _propTypes2.default.string,
  /**
   * The node type of the header
   * @default a
   */
  node: _propTypes2.default.node
};

CollapsibleItem.defaultProps = {
  expanded: false,
  node: 'div'
};

exports.default = CollapsibleItem;
module.exports = exports['default'];