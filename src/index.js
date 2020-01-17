import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import botAvatar from './img/botAvatar.png';
import userAvatar from './img/userAvatar.jpg';
import MoreVert from '@material-ui/icons/MoreVert';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Send from '@material-ui/icons/Send';
import Nes from 'nes';
import Guid from 'guid';
import Collapsible from './Components/Collapsible';
import CollapsibleItem from './Components/CollapsibleItem';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';

import ReactAudioPlayer from 'react-audio-player';
import { Player } from 'video-react';

export default class ArticulateChatbotWidget extends Component {

  constructor(props) {
    super(props);
    this.addNewUserMessage = this.addNewUserMessage.bind(this);
    this.addNewBotMessage = this.addNewBotMessage.bind(this);
    this.clearChat = this.clearChat.bind(this);
    this.restartSession = this.restartSession.bind(this);
    this.renderBotResponse = this.renderBotResponse.bind(this);
    this.scrollToBottomOfChat = this.scrollToBottomOfChat.bind(this);
    this.getUserPosition = this.getUserPosition.bind(this);
    this.handleLocationAccessError = this.handleLocationAccessError.bind(this);
    this.getWelcomeMessage = this.getWelcomeMessage.bind(this);
    this.state = {
      anchorEl: null,
      openMenu: false,
      showChatWindow: false,
      userMessage: '',
      botIsTyping: false,
      messages: [],
      client: null,
      socketClientConnected: false,
      messagesCount: 6,
    }
  }

  getSessionId() {
    const storedSessionId = localStorage.getItem('sessionId');
    let sessionId;
    if (storedSessionId) {
      sessionId = storedSessionId;
    } else {
      const newSessionId = Guid.create().toString();
      sessionId = newSessionId;
      localStorage.setItem('sessionId', newSessionId);
      this.getWelcomeMessage();
    }
    return sessionId;
  }

  componentDidMount() {
    const { articulateHost, articulateWSPort, connectionId } = this.props;
    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(`ws://${articulateHost}:${articulateWSPort}`, { timeout: 30000 });
      client.onConnect = () => {
        this.setState({
          client,
          socketClientConnected: true,
        });

        const handler = response => {
          if (response) {
            this.addNewBotMessage(response);
          }
        };

        const sessionId = this.getSessionId();
        client.subscribe(`/connection/${connectionId}/external/${sessionId}`, handler);
      };
      client.connect();
    }
  }

  handleClickMenu(evt) {
    this.setState({
      anchorEl: evt ? evt.currentTarget : null,
      openMenu: !!evt
    });
  }

  addNewBotMessage(response) {
    const { messages } = this.state;
    messages.push({
      bot: true,
      response
    });
    this.setState({
      messages,
      botIsTyping: false
    });
  }

  addNewUserMessage(message) {
    const { userMessage, messages } = this.state;
    if (userMessage || message) {
      const { articulateHost, articulatePort, connectionId } = this.props;
      const sessionId = this.getSessionId();
      const messageToUse = message || userMessage;
      const postPayload = {
        sessionId,
        text: messageToUse,
      };
      messages.push({
        message: messageToUse
      });
      fetch(`http://${articulateHost}:${articulatePort}/api/connection/${connectionId}/external`, {
        method: 'post',
        body: JSON.stringify(postPayload)
      });
      this.setState({
        userMessage: '',
        messages,
        botIsTyping: true
      });
    }
  }

  getWelcomeMessage() {
    const { articulateHost, articulatePort, connectionId } = this.props;
    const sessionId = this.getSessionId();
    const postPayload = {
      sessionId,
      text: 'Chat Widget request for Welcome Message',
      isWelcomeMessage: true,
    };
    fetch(`http://${articulateHost}:${articulatePort}/api/connection/${connectionId}/external`, {
      method: 'post',
      body: JSON.stringify(postPayload)
    });
    this.setState({
      userMessage: '',
      botIsTyping: true
    });
  }

  restartSession() {
    const { connectionId, articulateHost, articulatePort } = this.props;
    const sessionId = this.getSessionId();
    fetch(`http://${articulateHost}:${articulatePort}/api/context/${sessionId + connectionId}`, {
      method: 'delete'
    });
    this.clearChat();
    this.getWelcomeMessage();
  }

  clearChat() {
    this.setState({
      userMessage: '',
      messages: [],
      botIsTyping: false,
      messagesCount: 0
    });
    this.handleClickMenu();
  }

  scrollToBottomOfChat() {
    const terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight + 100;
  }

  componentDidUpdate() {
    const { messagesCount, messages } = this.state;
    if (messagesCount < messages.length) {
      this.setState({
        messagesCount: messages.length
      });
      this.scrollToBottomOfChat();
    }
  }

  renderBotResponse(response, index, renderBotAvatar) {
    const { botAvatarURL } = this.props;
    const botAvatarImage = botAvatarURL || botAvatar;
    let responses = []

    if (response.textResponse && !response.disableTextResponse){
      responses.push(
        <React.Fragment key={`message_${index}_textResponse`}>
          {renderBotAvatar && <img className="botAvatar" src={botAvatarImage} />}
          <p className={`botMsg ${!renderBotAvatar && 'botMessageWithoutAvatar'}`}>{response.textResponse}</p>
          <div className="clearfix" />
        </React.Fragment>
      )
    }

    if (response.quickResponses && response.quickResponses.length > 0) {
      responses.push(
        <React.Fragment key={`message_${index}_quickResponses`}>
          {renderBotAvatar && <img className="botAvatar" src={botAvatarImage} />}
          <p className={`botMsg ${!renderBotAvatar && 'botMessageWithoutAvatar'}`}>{response.textResponse}</p>
          <div className="clearfix" />
          <div className="quickReplies">
            {response.quickResponses.map((quickResponse, index) => {
              return (
                <div key={`quickResponse${index}`} className="chip" onClick={() => { this.addNewUserMessage(quickResponse); }}>
                  {quickResponse}
                </div>
              )
            })}
          </div>
          <div className="clearfix" />
        </React.Fragment>
      );
    }

    if (response.richResponses && response.richResponses.length > 0){
      response.richResponses.forEach((richResponse, richResponseIndex) => {
        switch (richResponse.type) {
          case 'audio':
            responses.push(
              <ReactAudioPlayer
                className={'audio-message'}
                key={`message_${index}_richResponse_${richResponseIndex}`}
                src={richResponse.data.audio}
                controls
              />
            );
            break;
          case 'video':
            responses.push(
              <Player
                key={`message_${index}_richResponse_${richResponseIndex}`}
                playsInline
                src={richResponse.data.video}
              />
            )
            break;
          case 'image':
            responses.push(
              <React.Fragment key={`message_${index}_richResponse_${richResponseIndex}`}>
                <div className="singleCard">
                  <a target="_blank" href={richResponse.data.imageURL}><img className="imgcard" src={richResponse.data.imageURL} /></a>
                </div>
                <div className="clearfix" />
              </React.Fragment>
            );
            break;
          case 'buttons':
            const buttons = richResponse.data;
            responses.push(
              <div key={`message_${index}_richResponse_${richResponseIndex}`} className="singleCard">
                <div className="suggestions">
                  <div className="button-group">
                    {buttons.map((button, index) => {
                      return (
                        <div key={`button_${index}`} className="button-chip" onClick={() => { window.open(button.linkURL, "_blank"); }}>
                          {button.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            );
            break;
          case 'quickResponses':
            const quickResponses = richResponse.data.quickResponses;
            responses.push(
              <React.Fragment key={`message_${index}_richResponse_${richResponseIndex}`}>
                <div className="quickReplies">
                  {quickResponses.map((quickResponse, index) => {
                    return (
                      <div key={`quickResponse${index}`} className="chip" onClick={() => { this.addNewUserMessage(quickResponse); }}>
                        {quickResponse}
                      </div>
                    )
                  })}
                </div>
                <div className="clearfix" />
              </React.Fragment>
            );
            break;
          case 'cardsCarousel':
            const cards = richResponse.data;
            responses.push(
              <div key={`message_${index}_richResponse_${richResponseIndex}`} id="paginated_cards" className="cards">
                <div className="cards_scroller">
                  {
                    cards.map((card, index) => {
                      return (
                        <div key={`card_${index}`} className="carousel_cards in-left" onClick={() => { window.open(card.linkURL, "_blank"); }}>
                          <img className="cardBackgroundImage" src={card.imageURL} />
                          <div className="cardFooter">
                            <span className="cardTitle" title={card.title}>{card.title}</span>
                            <div className="cardDescription">
                              <span>{card.description}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                  {
                    cards.length > 1 ?
                      <React.Fragment>
                        <span onClick={() => { document.querySelector('.cards_scroller').scrollBy(-225, 0); }} className="arrow prev">
                          <ChevronLeftIcon style={{ fontSize: "3rem" }} />
                        </span>
                        <span onClick={() => { document.querySelector('.cards_scroller').scrollBy(225, 0); }} className="arrow next" >
                          <ChevronRightIcon style={{ fontSize: "3rem" }} />
                        </span>
                      </React.Fragment> :
                      null
                  }
                </div>
              </div>
            );
            break;
          case 'collapsible':
            const items = richResponse.data;
            responses.push(
              <Collapsible accordion={false} key={`message_${index}_richResponse_${richResponseIndex}`} className="collapsible-ul" defaultActiveKey={1}>
                {
                  items.map((item, index) => {
                    return (
                      <CollapsibleItem header={item.title} key={`item_${index}`}>
                        {item.content}
                      </CollapsibleItem>
                    )
                  })
                }
              </Collapsible>
            );
            break;
          case 'richText':
            responses.push(
              <React.Fragment key={`message_${index}_richResponse_${richResponseIndex}`}>
                {renderBotAvatar && <img className="botAvatar" src={botAvatarImage} />}
                <div className={`botMsg ${!renderBotAvatar && 'botMessageWithoutAvatar'}`} dangerouslySetInnerHTML={{ __html: richResponse.data.text }} />
                <div className="clearfix" />
              </React.Fragment>
            );
            break;
          case 'chart':
            responses.push(
              <React.Fragment key={`message_${index}_richResponse_${richResponseIndex}`}>
                {renderBotAvatar && <img className="botAvatar" src={botAvatarImage} />}
                <p className={`botMsg ${!renderBotAvatar && 'botMessageWithoutAvatar'}`}>{message.message}</p>
                <div className="clearfix" />
              </React.Fragment>
            );
            break;
          case 'location':
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(this.getUserPosition, this.handleLocationAccessError);
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

  getUserPosition(position) {
    const textResponse = `Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`;

    this.addNewUserMessage(textResponse);
    // here you add the intent which you want to trigger
    /*response = `/inform{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`;
    $('#userInput').prop('disabled', false);
    send(response);
    showBotTyping();*/
  }

  handleLocationAccessError(error) {
    console.error("AN ERROR OCURRED??: ", error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied the request for Geolocation.')
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location information is unavailable.')
        break;
      case error.TIMEOUT:
        console.error('The request to get user location timed out.')
        break;
      case error.UNKNOWN_ERROR:
        console.error('An unknown error occurred.')
        break;
    }

    /*response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $('.usrInput').val('');
    $('#userInput').prop('disabled', false);*/
  }

  render() {
    const {
      showChatWindow,
      anchorEl,
      openMenu,
      messages,
      userMessage,
      botIsTyping
    } = this.state;
    const {
      name,
      clearItemMenuLabel,
      restartItemMenuLabel,
      closeItemMenuLabel,
      inputPlaceholder,
      botAvatarURL,
      userAvatarURL
    } = this.props;
    const botAvatarImage = botAvatarURL || botAvatar;
    const userAvatarImage = userAvatarURL || userAvatar;
    return (
      <div className="container">
        {
          showChatWindow ?
            <div className="widget">
              <div className="chat_header">
                <span className="chat_header_title">{name}</span>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={(evt) => { this.handleClickMenu(evt) }}
                  className="menu"
                  style={{
                    color: '#fff'
                  }}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={openMenu}
                  onClose={() => { this.handleClickMenu() }}
                >
                  <MenuItem onClick={this.clearChat}>
                    <span className="menu-item">
                      {clearItemMenuLabel}
                    </span>
                  </MenuItem>
                  <MenuItem onClick={this.restartSession}>
                    <span className="menu-item">
                      {restartItemMenuLabel}
                    </span>
                  </MenuItem>
                  <MenuItem onClick={() => { this.setState({ showChatWindow: false }); this.handleClickMenu() }}>
                    <span className="menu-item">
                      {closeItemMenuLabel}
                    </span>
                  </MenuItem>
                </Menu>
              </div>

              <div className="chats" id="chats">
                <div className="clearfix" />
                {
                  messages.map((message, index) => {
                    return (
                      message.bot ?
                        this.renderBotResponse(message.response, index, index === 0 || !messages[index-1].bot )
                        :
                        <React.Fragment key={`message_${index}`}>
                          {index === 0 || messages[index-1].bot ? <img className="userAvatar" src={userAvatarImage} /> : null}
                          <p className={`userMsg ${(index > 0 && !messages[index-1].bot) && 'userMessageWithoutAvatar'}`}>{message.message}</p>
                          <div className="clearfix" />
                        </React.Fragment>
                    )
                  })
                }
                {
                  botIsTyping &&
                  <React.Fragment>
                    <img className="botAvatar" src={botAvatarImage} />
                    <div className="botTyping">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </React.Fragment>
                }
              </div>

              <Grid
                className="user-input-container"
              >
                <Input
                  id="userInput"
                  placeholder={inputPlaceholder}
                  className="user-input"
                  disableUnderline
                  multiline
                  inputProps={{
                    style: {
                      height: '38px',
                      overflowY: 'scroll'
                    }
                  }}
                  value={userMessage}
                  onChange={(evt) => {
                    this.setState({ userMessage: evt.target.value })
                  }}
                  onKeyDown={(evt) => {
                    if (evt.keyCode === 13) {
                      evt.preventDefault();
                      this.addNewUserMessage();
                    }
                  }}
                />
                <IconButton onClick={this.addNewUserMessage}>
                  <Send />
                </IconButton>
              </Grid>
            </div>
            : <div className="profile_div" onClick={() => { this.setState({ showChatWindow: true }) }} id="profile_div">
              <img className="imgProfile" src={botAvatarImage} />
            </div>
        }
      </div>
    );
  }
}

ArticulateChatbotWidget.propTypes = {
  name: PropTypes.string,
  articulateHost: PropTypes.string.isRequired,
  articulatePort: PropTypes.string.isRequired,
  articulateWSPort: PropTypes.string.isRequired,
  connectionId: PropTypes.string.isRequired,
  botAvatarURL: PropTypes.string,
  userAvatarURL: PropTypes.string,
  clearItemMenuLabel: PropTypes.string,
  restartItemMenuLabel: PropTypes.string,
  closeItemMenuLabel: PropTypes.string,
  inputPlaceholder: PropTypes.string
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
