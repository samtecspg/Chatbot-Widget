import React from 'react'
import ReactDom from 'react-dom'
import ArticulateChatbotWidget from '../src/index'

ReactDom.render(
  <ArticulateChatbotWidget
    name='Lynx'
    articulateHost='localhost'
    articulatePort='8080'
    articulateWSPort='7500'
    connectionId='f7bbf110-2606-11ea-a5c2-f59e163fc7fb'
    botAvatarURL='https://i.ibb.co/FXmVCMp/lynx.png'
  />,
  document.getElementById('app')
)
