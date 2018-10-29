import { createElement, Component, Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import Notifier from '../../index';
import * as style from './style.scss';

interface NotifProps {
  handleClose: () => void;
  data: {
    label: string;
  };
}

const animationClassNames = {
  enter: style.notificationEnter,
  enterActive: style.notificationEnterActive,
  exit: style.notificationExit,
  exitActive: style.notificationExitActive,
};

function Notif({ data, handleClose }: NotifProps) {
  return (
    <div style={{ padding: 10 }}>
      <div className={style.notification1}>
        {data.label}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

let messageIndex = 0;
const messages = ['Hello', 'Bonjour', 'Ola', 'Hi', 'Salut'];
function getMessage(): string {
  const message = messages[messageIndex];
  if (messageIndex === messages.length - 1) messageIndex = 0;
  else messageIndex += 1;
  return message;
}

storiesOf('Modal', module)
  .add('default', () => {
    const notifier = new Notifier(Notif, {
      animationDuration: 300,
      animationClassNames,
    });
    return (
      <button className={style.button} onClick={() => notifier.create({ label: getMessage() })}>
        Create Notification
      </button>
    );
  })
  .add('older stay at top', () => {
    const notifier = new Notifier(Notif, {
      order: 'ASC',
      animationDuration: 300,
      animationClassNames,
    });
    return (
      <button className={style.button} onClick={() => notifier.create({ label: getMessage() })}>
        Create Notification
      </button>
    );
  })
  .add('without auto-close', () => {
    const notifier = new Notifier(Notif, {
      closeTimeout: null,
      animationDuration: 300,
      animationClassNames,
    });
    return (
      <button className={style.button} onClick={() => notifier.create({ label: getMessage() })}>
        Create Notification
      </button>
    );
  });
