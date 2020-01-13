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

var _botAvatar = require('./img/botAvatar.png');

var _botAvatar2 = _interopRequireDefault(_botAvatar);

var _userAvatar = require('./img/userAvatar.jpg');

var _userAvatar2 = _interopRequireDefault(_userAvatar);

var _MoreVert = require('@material-ui/icons/MoreVert');

var _MoreVert2 = _interopRequireDefault(_MoreVert);

var _ChevronLeft = require('@material-ui/icons/ChevronLeft');

var _ChevronLeft2 = _interopRequireDefault(_ChevronLeft);

var _ChevronRight = require('@material-ui/icons/ChevronRight');

var _ChevronRight2 = _interopRequireDefault(_ChevronRight);

var _Send = require('@material-ui/icons/Send');

var _Send2 = _interopRequireDefault(_Send);

var _nes = require('nes');

var _nes2 = _interopRequireDefault(_nes);

var _guid = require('guid');

var _guid2 = _interopRequireDefault(_guid);

var _Collapsible = require('./Components/Collapsible');

var _Collapsible2 = _interopRequireDefault(_Collapsible);

var _CollapsibleItem = require('./Components/CollapsibleItem');

var _CollapsibleItem2 = _interopRequireDefault(_CollapsibleItem);

var _Menu = require('@material-ui/core/Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('@material-ui/core/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _IconButton = require('@material-ui/core/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Grid = require('@material-ui/core/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Input = require('@material-ui/core/Input');

var _Input2 = _interopRequireDefault(_Input);

var _reactAudioPlayer = require('react-audio-player');

var _reactAudioPlayer2 = _interopRequireDefault(_reactAudioPlayer);

var _videoReact = require('video-react');

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
    _this.scrollToBottomOfChat = _this.scrollToBottomOfChat.bind(_this);
    _this.getUserPosition = _this.getUserPosition.bind(_this);
    _this.handleLocationAccessError = _this.handleLocationAccessError.bind(_this);
    _this.getWelcomeMessage = _this.getWelcomeMessage.bind(_this);
    _this.state = {
      anchorEl: null,
      openMenu: false,
      showChatWindow: false,
      userMessage: '',
      botIsTyping: false,
      messages: [],
      client: null,
      socketClientConnected: false,
      messagesCount: 6
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
        this.getWelcomeMessage();
      }
      return sessionId;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          articulateHost = _props.articulateHost,
          articulateWSPort = _props.articulateWSPort,
          connectionId = _props.connectionId;

      if (!this.state.socketClientConnected) {
        var client = new _nes2.default.Client('ws://' + articulateHost + ':' + articulateWSPort, { timeout: 30000 });
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
          client.subscribe('/connection/' + connectionId + '/external/' + sessionId, handler);
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
        var _props2 = this.props,
            articulateHost = _props2.articulateHost,
            articulatePort = _props2.articulatePort,
            connectionId = _props2.connectionId;

        var sessionId = this.getSessionId();
        var messageToUse = message || userMessage;
        var postPayload = {
          sessionId: sessionId,
          text: messageToUse
        };
        messages.push({
          message: messageToUse
        });
        fetch('http://' + articulateHost + ':' + articulatePort + '/api/connection/' + connectionId + '/external', {
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
    key: 'getWelcomeMessage',
    value: function getWelcomeMessage() {
      var _props3 = this.props,
          articulateHost = _props3.articulateHost,
          articulatePort = _props3.articulatePort,
          connectionId = _props3.connectionId;

      var sessionId = this.getSessionId();
      var postPayload = {
        sessionId: sessionId,
        text: 'Chat Widget request for Welcome Message',
        isWelcomeMessage: true
      };
      fetch('http://' + articulateHost + ':' + articulatePort + '/api/connection/' + connectionId + '/external', {
        method: 'post',
        body: JSON.stringify(postPayload)
      });
      this.setState({
        userMessage: '',
        botIsTyping: true
      });
    }
  }, {
    key: 'restartSession',
    value: function restartSession() {
      var _props4 = this.props,
          connectionId = _props4.connectionId,
          articulateHost = _props4.articulateHost,
          articulatePort = _props4.articulatePort;

      var sessionId = this.getSessionId();
      fetch('http://' + articulateHost + ':' + articulatePort + '/api/context/' + (sessionId + connectionId), {
        method: 'delete'
      });
      this.clearChat();
      this.getWelcomeMessage();
    }
  }, {
    key: 'clearChat',
    value: function clearChat() {
      this.setState({
        userMessage: '',
        messages: [],
        botIsTyping: false,
        messagesCount: 0
      });
      this.handleClickMenu();
    }
  }, {
    key: 'scrollToBottomOfChat',
    value: function scrollToBottomOfChat() {
      var terminalResultsDiv = document.getElementById("chats");
      terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight + 100;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _state2 = this.state,
          messagesCount = _state2.messagesCount,
          messages = _state2.messages;

      if (messagesCount < messages.length) {
        this.setState({
          messagesCount: messages.length
        });
        this.scrollToBottomOfChat();
      }
    }
  }, {
    key: 'renderBotResponse',
    value: function renderBotResponse(response, index, renderBotAvatar) {
      var _this3 = this;

      var botAvatarURL = this.props.botAvatarURL;

      var botAvatarImage = botAvatarURL || _botAvatar2.default;
      var responses = [];

      if (response.textResponse) {
        responses.push(_react2.default.createElement(
          _react2.default.Fragment,
          { key: 'message_' + index + '_textResponse' },
          renderBotAvatar && _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
          _react2.default.createElement(
            'p',
            { className: 'botMsg ' + (!renderBotAvatar && 'botMessageWithoutAvatar') },
            response.textResponse
          ),
          _react2.default.createElement('div', { className: 'clearfix' })
        ));
      }

      if (response.quickResponses && response.quickResponses.length > 0) {
        responses.push(_react2.default.createElement(
          _react2.default.Fragment,
          { key: 'message_' + index + '_quickResponses' },
          renderBotAvatar && _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
          _react2.default.createElement(
            'p',
            { className: 'botMsg ' + (!renderBotAvatar && 'botMessageWithoutAvatar') },
            response.textResponse
          ),
          _react2.default.createElement('div', { className: 'clearfix' }),
          _react2.default.createElement(
            'div',
            { className: 'quickReplies' },
            response.quickResponses.map(function (quickResponse, index) {
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
        ));
      }

      if (response.richResponses && response.richResponses.length > 0) {
        response.richResponses.forEach(function (richResponse, richResponseIndex) {
          switch (richResponse.type) {
            case 'audio':
              responses.push(_react2.default.createElement(_reactAudioPlayer2.default, {
                className: classes.audioMessage,
                key: 'message_' + index + '_richResponse_' + richResponseIndex,
                src: richResponse.data.audio,
                controls: true
              }));
              break;
            case 'video':
              responses.push(_react2.default.createElement(_videoReact.Player, {
                key: 'message_' + index + '_richResponse_' + richResponseIndex,
                playsInline: true,
                src: richResponse.data.video
              }));
              break;
            case 'image':
              responses.push(_react2.default.createElement(
                _react2.default.Fragment,
                { key: 'message_' + index + '_richResponse_' + richResponseIndex },
                _react2.default.createElement(
                  'div',
                  { className: 'singleCard' },
                  _react2.default.createElement(
                    'a',
                    { target: '_blank', href: richResponse.data.imageURL },
                    _react2.default.createElement('img', { className: 'imgcard', src: richResponse.data.imageURL })
                  )
                ),
                _react2.default.createElement('div', { className: 'clearfix' })
              ));
              break;
            case 'buttons':
              var buttons = richResponse.data;
              responses.push(_react2.default.createElement(
                'div',
                { key: 'message_' + index + '_richResponse_' + richResponseIndex, className: 'singleCard' },
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
                            window.open(button.linkURL, "_blank");
                          } },
                        button.label
                      );
                    })
                  )
                )
              ));
              break;
            case 'quickResponses':
              var quickResponses = richResponse.data.quickResponses;
              responses.push(_react2.default.createElement(
                _react2.default.Fragment,
                { key: 'message_' + index + '_richResponse_' + richResponseIndex },
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
              ));
              break;
            case 'cardsCarousel':
              var cards = richResponse.data;
              responses.push(_react2.default.createElement(
                'div',
                { key: 'message_' + index + '_richResponse_' + richResponseIndex, id: 'paginated_cards', className: 'cards' },
                _react2.default.createElement(
                  'div',
                  { className: 'cards_scroller' },
                  cards.map(function (card, index) {
                    return _react2.default.createElement(
                      'div',
                      { key: 'card_' + index, className: 'carousel_cards in-left', onClick: function onClick() {
                          window.open(card.linkURL, "_blank");
                        } },
                      _react2.default.createElement('img', { className: 'cardBackgroundImage', src: card.imageURL }),
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
                            'span',
                            null,
                            card.description
                          )
                        )
                      )
                    );
                  }),
                  cards.length > 1 ? _react2.default.createElement(
                    _react2.default.Fragment,
                    null,
                    _react2.default.createElement(
                      'span',
                      { onClick: function onClick() {
                          document.querySelector('.cards_scroller').scrollBy(-225, 0);
                        }, className: 'arrow prev' },
                      _react2.default.createElement(_ChevronLeft2.default, { style: { fontSize: "3rem" } })
                    ),
                    _react2.default.createElement(
                      'span',
                      { onClick: function onClick() {
                          document.querySelector('.cards_scroller').scrollBy(225, 0);
                        }, className: 'arrow next' },
                      _react2.default.createElement(_ChevronRight2.default, { style: { fontSize: "3rem" } })
                    )
                  ) : null
                )
              ));
              break;
            case 'collapsible':
              var items = richResponse.data;
              responses.push(_react2.default.createElement(
                _Collapsible2.default,
                { accordion: false, key: 'message_' + index + '_richResponse_' + richResponseIndex, className: 'collapsible-ul', defaultActiveKey: 1 },
                items.map(function (item, index) {
                  return _react2.default.createElement(
                    _CollapsibleItem2.default,
                    { header: item.title, key: 'item_' + index },
                    item.content
                  );
                })
              ));
              break;
            case 'chart':
              responses.push(_react2.default.createElement(
                _react2.default.Fragment,
                { key: 'message_' + index + '_richResponse_' + richResponseIndex },
                renderBotAvatar && _react2.default.createElement('img', { className: 'botAvatar', src: botAvatarImage }),
                _react2.default.createElement(
                  'p',
                  { className: 'botMsg ' + (!renderBotAvatar && 'botMessageWithoutAvatar') },
                  message.message
                ),
                _react2.default.createElement('div', { className: 'clearfix' })
              ));
              break;
            case 'location':
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_this3.getUserPosition, _this3.handleLocationAccessError);
              } else {
                response = 'Geolocation is not supported by this browser.';
              }
              break;
            default:
              break;
          }
        });
      }
      return responses;
    }
  }, {
    key: 'getUserPosition',
    value: function getUserPosition(position) {
      var textResponse = 'Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude;

      this.addNewUserMessage(textResponse);
      // here you add the intent which you want to trigger
      /*response = `/inform{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`;
      $('#userInput').prop('disabled', false);
      send(response);
      showBotTyping();*/
    }
  }, {
    key: 'handleLocationAccessError',
    value: function handleLocationAccessError(error) {
      console.error("AN ERROR OCURRED??: ", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error('User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          console.error('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          console.error('The request to get user location timed out.');
          break;
        case error.UNKNOWN_ERROR:
          console.error('An unknown error occurred.');
          break;
      }

      /*response = '/inform{"user_location":"deny"}';
      send(response);
      showBotTyping();
      $('.usrInput').val('');
      $('#userInput').prop('disabled', false);*/
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state3 = this.state,
          showChatWindow = _state3.showChatWindow,
          anchorEl = _state3.anchorEl,
          openMenu = _state3.openMenu,
          messages = _state3.messages,
          userMessage = _state3.userMessage,
          botIsTyping = _state3.botIsTyping;
      var _props5 = this.props,
          name = _props5.name,
          clearItemMenuLabel = _props5.clearItemMenuLabel,
          restartItemMenuLabel = _props5.restartItemMenuLabel,
          closeItemMenuLabel = _props5.closeItemMenuLabel,
          inputPlaceholder = _props5.inputPlaceholder,
          botAvatarURL = _props5.botAvatarURL,
          userAvatarURL = _props5.userAvatarURL;

      var botAvatarImage = botAvatarURL || _botAvatar2.default;
      var userAvatarImage = userAvatarURL || _userAvatar2.default;
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
              _IconButton2.default,
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
              _react2.default.createElement(_MoreVert2.default, null)
            ),
            _react2.default.createElement(
              _Menu2.default,
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
                _MenuItem2.default,
                { onClick: this.clearChat },
                _react2.default.createElement(
                  'span',
                  { className: 'menu-item' },
                  clearItemMenuLabel
                )
              ),
              _react2.default.createElement(
                _MenuItem2.default,
                { onClick: this.restartSession },
                _react2.default.createElement(
                  'span',
                  { className: 'menu-item' },
                  restartItemMenuLabel
                )
              ),
              _react2.default.createElement(
                _MenuItem2.default,
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
              return message.bot ? _this4.renderBotResponse(message.response, index, index === 0 || !messages[index - 1].bot) : _react2.default.createElement(
                _react2.default.Fragment,
                { key: 'message_' + index },
                index === 0 || messages[index - 1].bot ? _react2.default.createElement('img', { className: 'userAvatar', src: userAvatarImage }) : null,
                _react2.default.createElement(
                  'p',
                  { className: 'userMsg ' + (index > 0 && !messages[index - 1].bot && 'userMessageWithoutAvatar') },
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
            _Grid2.default,
            {
              className: 'user-input-container'
            },
            _react2.default.createElement(_Input2.default, {
              id: 'userInput',
              placeholder: inputPlaceholder,
              className: 'user-input',
              disableUnderline: true,
              multiline: true,
              inputProps: {
                style: {
                  height: '38px',
                  overflowY: 'scroll'
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
              _IconButton2.default,
              { onClick: this.addNewUserMessage },
              _react2.default.createElement(_Send2.default, null)
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
  articulateHost: _propTypes2.default.string.isRequired,
  articulatePort: _propTypes2.default.string.isRequired,
  articulateWSPort: _propTypes2.default.string.isRequired,
  connectionId: _propTypes2.default.string.isRequired,
  botAvatarURL: _propTypes2.default.string,
  userAvatarURL: _propTypes2.default.string,
  clearItemMenuLabel: _propTypes2.default.string,
  restartItemMenuLabel: _propTypes2.default.string,
  closeItemMenuLabel: _propTypes2.default.string,
  inputPlaceholder: _propTypes2.default.string
};

ArticulateChatbotWidget.defaultProps = {
  name: 'Your Bot Name',
  clearItemMenuLabel: 'Clear',
  restartItemMenuLabel: 'Restart',
  closeItemMenuLabel: 'Close',
  inputPlaceholder: 'Type a message...',
  botAvatarURL: '',
  userAvatarURL: ''
};
module.exports = exports['default'];