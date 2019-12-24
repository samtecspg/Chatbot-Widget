import React from 'react'
import ReactDom from 'react-dom'
import ArticulateChatbotWidget from '../src/index'

ReactDom.render(
  <ArticulateChatbotWidget
    name='Lynx'
    socketUrl='ws://localhost:7500'
    connectionId='f7bbf110-2606-11ea-a5c2-f59e163fc7fb'
    socketPath='/connection/f7bbf110-2606-11ea-a5c2-f59e163fc7fb/external'
    converseUrl='http://localhost:8080/api/connection/f7bbf110-2606-11ea-a5c2-f59e163fc7fb/external'
    botAvatarURL='https://i.ibb.co/FXmVCMp/lynx.png'
  />,
  document.getElementById('app')
)
