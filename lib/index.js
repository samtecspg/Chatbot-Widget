'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./style.css');

var _botAvatar = require('../static/img/botAvatar.png');

var _botAvatar2 = _interopRequireDefault(_botAvatar);

var _userAvatar = require('../static/img/userAvatar.jpg');

var _userAvatar2 = _interopRequireDefault(_userAvatar);

var _icons = require('@material-ui/icons');

var _nes = require('nes');

var _nes2 = _interopRequireDefault(_nes);

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

var _Collapsible = require('./Components/Collapsible');

var _Collapsible2 = _interopRequireDefault(_Collapsible);

var _CollapsibleItem = require('./Components/CollapsibleItem');

var _CollapsibleItem2 = _interopRequireDefault(_CollapsibleItem);

var _fa = require('react-icons/fa');

var _core = require('@material-ui/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticulateChatbotWidget = function (_Component) {
  _inherits(ArticulateChatbotWidget, _Component);

  function ArticulateChatbotWidget(props) {
    _classCallCheck(this, ArticulateChatbotWidget);

    var _this = _possibleConstructorReturn(this, (ArticulateChatbotWidget.__proto__ || Object.getPrototypeOf(ArticulateChatbotWidget)).call(this, props));

    _this.addNewUserMessage = _this.addNewUserMessage.bind(_this);
    _this.addNewBotMessage = _this.addNewBotMessage.bind(_this);
    _this.clearChat = _this.clearChat.bind(_this);
    _this.restartSession = _this.restartSession.bind(_this);
    _this.renderBotResponse = _this.renderBotResponse.bind(_this);
    _this.state = {
      anchorEl: null,
      openMenu: false,
      showChatWindow: false,
      userMessage: '',
      botIsTyping: false,
      messages: [{
        bot: true,
        response: {
          type: 'plainText',
          textResponse: 'Hi this is a text response'
        }
      }, {
        bot: true,
        response: {
          type: 'image',
          image: 'https://images.psg.media/media/67884/une-icardi.jpg'
        }
      }, {
        bot: true,
        response: {
          type: 'buttons',
          buttons: [{
            payload: 'Hi',
            title: 'Option 1'
          }, {
            payload: 'thanks',
            title: 'Option 2'
          }, {
            payload: 'bye',
            title: 'Option 3'
          }]
        }
      }, {
        bot: true,
        response: {
          type: 'quickResponses',
          quickResponses: ['this is quick reply 1', 'this is quick reply 2', 'this is quick reply 3']
        }
      }, {
        bot: true,
        response: {
          type: 'cardsCarousel',
          cards: [{
            title: 'PSG vs Saint Etienne',
            image: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg',
            rating: 3.5
          }, {
            title: 'Le Mans vs PSG',
            image: 'https://images.psg.media/media/68249/diapo18.jpg',
            rating: 2
          }, {
            title: 'PSG vs Galatasaray',
            image: 'https://images.psg.media/media/67884/une-icardi.jpg',
            rating: 5
          }]
        }
      }, {
        bot: true,
        response: {
          type: 'collapsible',
          items: [{
            title: 'PSG vs Saint Etienne',
            description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
          }, {
            title: 'PSG vs Saint Etienne',
            description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
          }, {
            title: 'PSG vs Saint Etienne',
            description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
          }]
        }
      }],
      client: null,
      socketClientConnected: false
    };
    return _this;
  }

  _createClass(ArticulateChatbotWidget, [{
    key: 'getSessionId',
    value: function getSessionId() {
      var storedSessionId = localStorage.getItem('sessionId');
      var sessionId = void 0;
      if (storedSessionId) {
        sessionId = storedSessionId;
      } else {
        var newSessionId = _guid2.default.create().toString();
        sessionId = newSessionId;
        localStorage.setItem('sessionId', newSessionId);
      }
      return sessionId;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var _props = this.props,
          socketUrl = _props.socketUrl,
          socketPath = _props.socketPath;

      if (!this.state.socketClientConnected) {
        var client = new _nes2.default.Client(socketUrl, { timeout: 30000 });
        client.onConnect = function () {
          _this2.setState({
            client: client,
            socketClientConnected: true
          });

          var handler = function handler(response) {
            if (response) {
              _this2.addNewBotMessage(response);
            }
          };

          var sessionId = _this2.getSessionId();
          client.subscribe(socketPath + '/' + sessionId, handler);
        };
        client.connect();
      }
    }
  }, {
    key: 'handleClickMenu',
    value: function handleClickMenu(evt) {
      this.setState({
        anchorEl: evt ? evt.currentTarget : null,
        openMenu: !!evt
      });
    }
  }, {
    key: 'addNewBotMessage',
    value: function addNewBotMessage(response) {
      var messages = this.state.messages;

      messages.push({
        bot: true,
        response: response
      });
      this.setState({
        messages: messages,
        botIsTyping: false
      });
    }
  }, {
    key: 'addNewUserMessage',
    value: function addNewUserMessage(message) {
      var _state = this.state,
          userMessage = _state.userMessage,
          messages = _state.messages;

      if (userMessage || message) {
        var converseUrl = this.props.converseUrl;

        var sessionId = this.getSessionId();
        var messageToUse = message || userMessage;
        var postPayload = {
          sessionId: sessionId,
          text: messageToUse
        };
        messages.push({
          message: messageToUse
        });
        fetch(converseUrl, {
          method: 'post',
          body: JSON.stringify(postPayload)
        });
        this.setState({
          userMessage: '',
          messages: messages,
          botIsTyping: true
        });
      }
    }
  }, {
    key: 'restartSession',
    value: function restartSession() {
      var connectionId = this.props.connectionId;

      var sessionId = this.getSessionId();
      fetch('http://localhost:8080/api/context/' + (sessionId + connectionId), {
        method: 'delete'
      });
      this.clearChat();
    }
  }, {
    key: 'clearChat',
    value: function clearChat() {
      this.setState({
        userMessage: '',
        messages: [],
        botIsTyping: false
      });
      this.handleClickMenu();
    }
  }, {
    key: 'renderBotResponse',
    value: function renderBotResponse(response, index) {
      var _this3 = this;

      var botAvatarURL = this.props.botAvatarURL;

      var botAvatarImage = botAvatarURL || _botAvatar2.default;
      switch (response.type) {
        case 'plainText':
          return _react2.default.createElement(
            _react2.default.Fragment,
            { key: 'message_' + index },
            _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
            _react2.default.createElement(
              'p',
              { className: 'botMsg' },
              response.textResponse
            ),
            _react2.default.createElement('div', { className: 'clearfix' })
          );
        case 'image':
          return _react2.default.createElement(
            _react2.default.Fragment,
            { key: 'message_' + index },
            _react2.default.createElement(
              'div',
              { className: 'singleCard' },
              _react2.default.createElement(
                'a',
                { target: '_blank', href: response.image },
                _react2.default.createElement('img', { className: 'imgcard', src: response.image })
              )
            ),
            _react2.default.createElement('div', { className: 'clearfix' })
          );
        case 'buttons':
          var buttons = response.buttons;
          return _react2.default.createElement(
            'div',
            { key: 'message_' + index, className: 'singleCard' },
            _react2.default.createElement(
              'div',
              { className: 'suggestions' },
              _react2.default.createElement(
                'div',
                { className: 'button-group' },
                buttons.map(function (button, index) {
                  return _react2.default.createElement(
                    'div',
                    { key: 'button_' + index, className: 'button-chip', onClick: function onClick() {
                        _this3.addNewUserMessage(button.payload);
                      } },
                    button.title
                  );
                })
              )
            )
          );
        case 'quickResponses':
          var quickResponses = response.quickResponses;
          return _react2.default.createElement(
            _react2.default.Fragment,
            { key: 'message_' + index },
            _react2.default.createElement(
              'div',
              { className: 'quickReplies' },
              quickResponses.map(function (quickResponse, index) {
                return _react2.default.createElement(
                  'div',
                  { key: 'quickResponse' + index, className: 'chip', onClick: function onClick() {
                      _this3.addNewUserMessage(quickResponse);
                    } },
                  quickResponse
                );
              })
            ),
            _react2.default.createElement('div', { className: 'clearfix' })
          );
        case 'cardsCarousel':
          var cards = response.cards;
          return _react2.default.createElement(
            'div',
            { key: 'message_' + index, id: 'paginated_cards', className: 'cards' },
            _react2.default.createElement(
              'div',
              { className: 'cards_scroller' },
              cards.map(function (card, index) {
                return _react2.default.createElement(
                  'div',
                  { key: 'card_' + index, className: 'carousel_cards in-left' },
                  _react2.default.createElement('img', { className: 'cardBackgroundImage', src: card.image }),
                  _react2.default.createElement(
                    'div',
                    { className: 'cardFooter' },
                    _react2.default.createElement(
                      'span',
                      { className: 'cardTitle', title: card.title },
                      card.title
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'cardDescription' },
                      _react2.default.createElement(
                        'div',
                        { className: 'stars-outer' },
                        _react2.default.createElement('div', { className: 'stars-inner', style: { width: Math.round(card.rating / 5 * 100) + '%' } })
                      )
                    )
                  )
                );
              }),
              cards.length > 2 ? _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                  'span',
                  { onClick: function onClick() {
                      document.querySelector('.cards_scroller').scrollBy(-225, 0);
                    }, className: 'arrow prev' },
                  _react2.default.createElement(_fa.FaChevronCircleLeft, null)
                ),
                _react2.default.createElement(
                  'span',
                  { onClick: function onClick() {
                      document.querySelector('.cards_scroller').scrollBy(225, 0);
                    }, className: 'arrow next' },
                  _react2.default.createElement(_fa.FaChevronCircleRight, null)
                )
              ) : null
            )
          );
        case 'collapsible':
          var items = response.items;
          return _react2.default.createElement(
            _Collapsible2.default,
            { accordion: false, key: 'message_' + index, className: 'collapsible-ul', defaultActiveKey: 1 },
            items.map(function (item, index) {
              return _react2.default.createElement(
                _CollapsibleItem2.default,
                { header: item.title, key: 'item_' + index },
                item.description
              );
            })
          );
        case 'chart':
          return _react2.default.createElement(
            _react2.default.Fragment,
            { key: 'message_' + index },
            _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
            _react2.default.createElement(
              'p',
              { className: 'botMsg' },
              message.message
            ),
            _react2.default.createElement('div', { className: 'clearfix' })
          );
        case 'location':
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getUserPosition, handleLocationAccessError);
          } else {
            response = 'Geolocation is not supported by this browser.';
          }
          break;
      }
    }
  }, {
    key: 'getUserPosition',
    value: function getUserPosition(position) {
      response = 'Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude;
      console.log('location: ', response);

      // here you add the intent which you want to trigger
      response = '/inform{"latitude":' + position.coords.latitude + ',"longitude":' + position.coords.longitude + '}';
      $('#userInput').prop('disabled', false);
      send(response);
      showBotTyping();
    }
  }, {
    key: 'handleLocationAccessError',
    value: function handleLocationAccessError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log('User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          console.log('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          console.log('The request to get user location timed out.');
          break;
        case error.UNKNOWN_ERROR:
          console.log('An unknown error occurred.');
          break;
      }

      response = '/inform{"user_location":"deny"}';
      send(response);
      showBotTyping();
      $('.usrInput').val('');
      $('#userInput').prop('disabled', false);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state2 = this.state,
          showChatWindow = _state2.showChatWindow,
          anchorEl = _state2.anchorEl,
          openMenu = _state2.openMenu,
          messages = _state2.messages,
          userMessage = _state2.userMessage,
          botIsTyping = _state2.botIsTyping;
      var _props2 = this.props,
          name = _props2.name,
          clearItemMenuLabel = _props2.clearItemMenuLabel,
          restartItemMenuLabel = _props2.restartItemMenuLabel,
          closeItemMenuLabel = _props2.closeItemMenuLabel,
          inputPlaceholder = _props2.inputPlaceholder,
          botAvatarURL = _props2.botAvatarURL;

      var botAvatarImage = botAvatarURL || _botAvatar2.default;
      return _react2.default.createElement(
        'div',
        { className: 'container' },
        showChatWindow ? _react2.default.createElement(
          'div',
          { className: 'widget' },
          _react2.default.createElement(
            'div',
            { className: 'chat_header' },
            _react2.default.createElement(
              'span',
              { className: 'chat_header_title' },
              name
            ),
            _react2.default.createElement(
              _core.IconButton,
              {
                'aria-label': 'more',
                'aria-controls': 'long-menu',
                'aria-haspopup': 'true',
                onClick: function onClick(evt) {
                  _this4.handleClickMenu(evt);
                },
                className: 'menu',
                style: {
                  color: '#fff'
                }
              },
              _react2.default.createElement(_icons.MoreVert, null)
            ),
            _react2.default.createElement(
              _core.Menu,
              {
                id: 'long-menu',
                anchorEl: anchorEl,
                keepMounted: true,
                open: openMenu,
                onClose: function onClose() {
                  _this4.handleClickMenu();
                }
              },
              _react2.default.createElement(
                _core.MenuItem,
                { onClick: this.clearChat },
                _react2.default.createElement(
                  'span',
                  { className: 'menu-item' },
                  clearItemMenuLabel
                )
              ),
              _react2.default.createElement(
                _core.MenuItem,
                { onClick: this.restartSession },
                _react2.default.createElement(
                  'span',
                  { className: 'menu-item' },
                  restartItemMenuLabel
                )
              ),
              _react2.default.createElement(
                _core.MenuItem,
                { onClick: function onClick() {
                    _this4.setState({ showChatWindow: false });_this4.handleClickMenu();
                  } },
                _react2.default.createElement(
                  'span',
                  { className: 'menu-item' },
                  closeItemMenuLabel
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'chats', id: 'chats' },
            _react2.default.createElement('div', { className: 'clearfix' }),
            messages.map(function (message, index) {
              return message.bot ? _this4.renderBotResponse(message.response, index) : _react2.default.createElement(
                _react2.default.Fragment,
                { key: 'message_' + index },
                _react2.default.createElement('img', { className: 'userAvatar', src: _userAvatar2.default }),
                _react2.default.createElement(
                  'p',
                  { className: 'userMsg' },
                  message.message
                ),
                _react2.default.createElement('div', { className: 'clearfix' })
              );
            }),
            botIsTyping && _react2.default.createElement(
              _react2.default.Fragment,
              null,
              _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
              _react2.default.createElement(
                'div',
                { className: 'botTyping' },
                _react2.default.createElement('div', { className: 'bounce1' }),
                _react2.default.createElement('div', { className: 'bounce2' }),
                _react2.default.createElement('div', { className: 'bounce3' })
              )
            )
          ),
          _react2.default.createElement(
            _core.Grid,
            {
              className: 'user-input-container'
            },
            _react2.default.createElement(_core.Input, {
              id: 'userInput',
              placeholder: inputPlaceholder,
              className: 'user-input',
              disableUnderline: true,
              multiline: true,
              inputProps: {
                style: {
                  height: 'auto',
                  overflow: 'scroll'
                }
              },
              value: userMessage,
              onChange: function onChange(evt) {
                _this4.setState({ userMessage: evt.target.value });
              },
              onKeyDown: function onKeyDown(evt) {
                if (evt.keyCode === 13) {
                  evt.preventDefault();
                  _this4.addNewUserMessage();
                }
              }
            }),
            _react2.default.createElement(
              _core.IconButton,
              { onClick: this.addNewUserMessage },
              _react2.default.createElement(_icons.Send, null)
            )
          )
        ) : _react2.default.createElement(
          'div',
          { className: 'profile_div', onClick: function onClick() {
              _this4.setState({ showChatWindow: true });
            }, id: 'profile_div' },
          _react2.default.createElement('img', { className: 'imgProfile', src: botAvatarImage })
        )
      );
    }
  }]);

  return ArticulateChatbotWidget;
}(_react.Component);

exports.default = ArticulateChatbotWidget;


ArticulateChatbotWidget.propTypes = {
  name: _propTypes2.default.string,
  clearItemMenuLabel: _propTypes2.default.string,
  restartItemMenuLabel: _propTypes2.default.string,
  closeItemMenuLabel: _propTypes2.default.string,
  inputPlaceholder: _propTypes2.default.string,
  botAvatarURL: _propTypes2.default.string,
  connectionId: _propTypes2.default.string,
  socketUrl: _propTypes2.default.string,
  socketPath: _propTypes2.default.string,
  converseUrl: _propTypes2.default.string
};

ArticulateChatbotWidget.defaultProps = {
  name: 'Your Bot Name',
  clearItemMenuLabel: 'Clear',
  restartItemMenuLabel: 'Restart',
  closeItemMenuLabel: 'Close',
  inputPlaceholder: 'Type a message...',
  botAvatarURL: ''
};
module.exports = exports['default'];