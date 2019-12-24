import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import botAvatar from '../static/img/botAvatar.png';
import userAvatar from '../static/img/userAvatar.jpg';
import { MoreVert, Send } from '@material-ui/icons';
import Nes from 'nes';
import Guid from 'guid';
import Collapsible from './Components/Collapsible';
import CollapsibleItem from './Components/CollapsibleItem';

import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { Menu, MenuItem, IconButton, Grid, Input } from '@material-ui/core';

export default class ArticulateChatbotWidget extends Component {

  constructor(props) {
    super(props);
    this.addNewUserMessage = this.addNewUserMessage.bind(this);
    this.addNewBotMessage = this.addNewBotMessage.bind(this);
    this.clearChat = this.clearChat.bind(this);
    this.restartSession = this.restartSession.bind(this);
    this.renderBotResponse = this.renderBotResponse.bind(this);
    this.state = {
      anchorEl: null,
      openMenu: false,
      showChatWindow: false,
      userMessage: '',
      botIsTyping: false,
      messages: [
        {
          bot: true,
          response: {
            type: 'plainText',
            textResponse: 'Hi this is a text response'
          }
        },
        {
          bot: true,
          response: {
            type: 'image',
            image: 'https://images.psg.media/media/67884/une-icardi.jpg'
          }
        },
        {
          bot: true,
          response: {
            type: 'buttons',
            buttons: [
              {
                payload: 'Hi',
                title: 'Option 1'
              },
              {
                payload: 'thanks',
                title: 'Option 2'
              },
              {
                payload: 'bye',
                title: 'Option 3'
              }
            ]
          }
        },
        {
          bot: true,
          response: {
            type: 'quickResponses',
            quickResponses: [
              'this is quick reply 1',
              'this is quick reply 2',
              'this is quick reply 3'
            ]
          }
        },
        {
          bot: true,
          response: {
            type: 'cardsCarousel',
            cards: [
              {
                title: 'PSG vs Saint Etienne',
                image: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg',
                rating: 3.5
              },
              {
                title: 'Le Mans vs PSG',
                image: 'https://images.psg.media/media/68249/diapo18.jpg',
                rating: 2
              },
              {
                title: 'PSG vs Galatasaray',
                image: 'https://images.psg.media/media/67884/une-icardi.jpg',
                rating: 5
              }
            ]
          }
        },
        {
          bot: true,
          response: {
            type: 'collapsible',
            items: [
              {
                title: 'PSG vs Saint Etienne',
                description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
              },
              {
                title: 'PSG vs Saint Etienne',
                description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
              },
              {
                title: 'PSG vs Saint Etienne',
                description: 'https://images.psg.media/media/66682/diapo-asse-30-mbappe.jpg'
              }
            ]
          }
        }
      ],
      client: null,
      socketClientConnected: false,
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
    }
    return sessionId;
  }

  componentWillMount() {
    const { socketUrl, socketPath } = this.props;
    if (!this.state.socketClientConnected) {
      const client = new Nes.Client(socketUrl, { timeout: 30000 });
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
        client.subscribe(`${socketPath}/${sessionId}`, handler);
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
      const { converseUrl } = this.props;
      const sessionId = this.getSessionId();
      const messageToUse = message || userMessage;
      const postPayload = {
        sessionId,
        text: messageToUse,
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
        messages,
        botIsTyping: true
      });
    }
  }

  restartSession() {
    const { connectionId } = this.props;
    const sessionId = this.getSessionId();
    fetch(`http://localhost:8080/api/context/${sessionId + connectionId}`, {
      method: 'delete'
    });
    this.clearChat();
  }

  clearChat() {
    this.setState({
      userMessage: '',
      messages: [],
      botIsTyping: false
    });
    this.handleClickMenu();
  }

  renderBotResponse(response, index) {
    const { botAvatarURL } = this.props;
    const botAvatarImage = botAvatarURL || botAvatar;
    switch (response.type) {
      case 'plainText':
        return (
          <React.Fragment key={`message_${index}`}>
            <img className="botAvatar" src={botAvatarImage} />
            <p className="botMsg">{response.textResponse}</p>
            <div className="clearfix" />
          </React.Fragment>
        );
      case 'image':
        return (
          <React.Fragment key={`message_${index}`}>
            <div className="singleCard">
              <a target="_blank" href={response.image}><img className="imgcard" src={response.image} /></a>
            </div>
            <div className="clearfix" />
          </React.Fragment>
        );
      case 'buttons':
        const buttons = response.buttons;
        return (
          <div key={`message_${index}`} className="singleCard">
            <div className="suggestions">
              <div className="button-group">
                {buttons.map((button, index) => {
                  return (
                    <div key={`button_${index}`} className="button-chip" onClick={() => { this.addNewUserMessage(button.payload) }}>
                      {button.title}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        );
      case 'quickResponses':
        const quickResponses = response.quickResponses;
        return (
          <React.Fragment key={`message_${index}`}>
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
      case 'cardsCarousel':
        const cards = response.cards;
        return (
          <div key={`message_${index}`} id="paginated_cards" className="cards">
            <div className="cards_scroller">
              {
                cards.map((card, index) => {
                  return (
                    <div key={`card_${index}`} className="carousel_cards in-left">
                      <img className="cardBackgroundImage" src={card.image} />
                      <div className="cardFooter">
                        <span className="cardTitle" title={card.title}>{card.title}</span>
                        <div className="cardDescription">
                          <div className="stars-outer">
                            <div className="stars-inner" style={{ width: `${Math.round((card.rating / 5) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              {
                cards.length > 2 ?
                  <React.Fragment>
                    <span onClick={() => { document.querySelector('.cards_scroller').scrollBy(-225, 0); }} className="arrow prev">
                      <FaChevronCircleLeft />
                    </span>
                    <span onClick={() => { document.querySelector('.cards_scroller').scrollBy(225, 0); }} className="arrow next" >
                      <FaChevronCircleRight />
                    </span>
                  </React.Fragment> :
                  null
              }
            </div>
          </div>
        );
      case 'collapsible':
        const items = response.items;
        return (
          <Collapsible accordion={false} key={`message_${index}`} className="collapsible-ul" defaultActiveKey={1}>
            {
              items.map((item, index) => {
                return (
                  <CollapsibleItem header={item.title} key={`item_${index}`}>
                    {item.description}
                  </CollapsibleItem>
                )
              })
            }
          </Collapsible>
        );
      case 'chart':
        return (
          <React.Fragment key={`message_${index}`}>
            <img className="botAvatar" src={botAvatarImage} />
            <p className="botMsg">{message.message}</p>
            <div className="clearfix" />
          </React.Fragment>
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

  getUserPosition(position) {
    response = `Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`;
    console.log('location: ', response);

    // here you add the intent which you want to trigger
    response = `/inform{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`;
    $('#userInput').prop('disabled', false);
    send(response);
    showBotTyping();
  }

  handleLocationAccessError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.')
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.')
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.')
        break;
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.')
        break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $('.usrInput').val('');
    $('#userInput').prop('disabled', false);
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
      botAvatarURL
    } = this.props;
    const botAvatarImage = botAvatarURL || botAvatar;
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
                      this.renderBotResponse(message.response, index)
                    :
                      <React.Fragment key={`message_${index}`}>
                        <img className="userAvatar" src={userAvatar} />
                        <p className="userMsg">{message.message}</p>
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
                      height: 'auto',
                      overflow: 'scroll'
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
  clearItemMenuLabel: PropTypes.string,
  restartItemMenuLabel: PropTypes.string,
  closeItemMenuLabel: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  botAvatarURL: PropTypes.string,
  connectionId: PropTypes.string,
  socketUrl: PropTypes.string,
  socketPath: PropTypes.string,
  converseUrl: PropTypes.string
};

ArticulateChatbotWidget.defaultProps = {
  name: 'Your Bot Name',
  clearItemMenuLabel: 'Clear',
  restartItemMenuLabel: 'Restart',
  closeItemMenuLabel: 'Close',
  inputPlaceholder: 'Type a message...',
  botAvatarURL: '',
};
