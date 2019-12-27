import React from 'react';
import ReactDOM from 'react-dom';
import { ArticulateChatbotWidget } from './index_for_react_app';

const plugin = {
  init: (args) => {
    ReactDOM.render(
      <ArticulateChatbotWidget
        name={args.name}
        articulateHost={args.articulateHost}
        articulatePort={args.articulatePort}
        articulateWSPort={args.articulateWSPort}
        connectionId={args.connectionId}
        botAvatarURL={args.botAvatarURL}
        userAvatarURL={args.userAvatarURL}
        clearItemMenuLabel={args.clearItemMenuLabel}
        restartItemMenuLabel={args.restartItemMenuLabel}
        closeItemMenuLabel={args.closeItemMenuLabel}
        inputPlaceholder={args.inputPlaceholder}
      />, document.querySelector(args.selector)
    );
  }
};

export {
  plugin as default,
  ArticulateChatbotWidget
};

