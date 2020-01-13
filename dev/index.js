import React from 'react'
import ReactDom from 'react-dom'
import ArticulateChatbotWidget from '../src/index'

ReactDom.render(
  <ArticulateChatbotWidget
    name='Generic Name'
    articulateHost='localhost'
    articulatePort='8080'
    articulateWSPort='7500'
    connectionId='d056c8e0-3630-11ea-aab3-976829e056cb'
  />,
  document.getElementById('app')
)
