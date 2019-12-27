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
    userAvatarURL='https://images.squarespace-cdn.com/content/v1/5accd58989c17259a7bc8808/1567774856523-4AU5CG7TK1EH74BKGLBM/ke17ZwdGBToddI8pDm48kAf-OpKpNsh_OjjU8JOdDKBZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpwkCFOLgzJj4yIx-vIIEbyWWRd0QUGL6lY_wBICnBy59Ye9GKQq6_hlXZJyaybXpCc/placeholder-m+%281%29.png'
  />,
  document.getElementById('app')
)
