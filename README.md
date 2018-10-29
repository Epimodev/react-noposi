# react-noposi
A notification system using react for render

## Install

```bash
yarn add react-noposi

# or with npm

npm install --save react-noposi
```

## Basic example
```jsx
import Notifier from 'react-noposi';

const notificationAnimationClassNames = {
  enter: 'notification_enter',
  enterActive: 'notification_enter-active',
  exit: 'notification_exit',
  exitActive: 'notification_exit-active',
};

function NotificationComponent({ data, handleClose }) {
  return (
    <div className="notification">
      {data.label}
      <button onClick={handleClose}>Close</button>
    </div>
  );
}

const notifier = new Notifier(NotificationComponent, {
  animationDuration: 300,
  animationClassNames,
});

// create a notification at top right each time notifier.create is call
notifier.create({ label: 'Hello World' });
notifier.create({ label: 'Hello Again' });
```

css file :
```css
.notification_enter {
  transform: translateX(100%);
}
.notification_enter-active {
  transform: translateX(0);
  transition: 300ms;
}
.notification_exit {
  transform: translateX(0);
}
.notification_exit-active {
  transform: translateX(100%);
  transition: 300ms;
}
```

## Documentation

### Notifier

constructor params :
- component `ReactComponent`  
The component to render a notification. The component has 2 props :
  - data `object`: notification data
  - handleClose `function (): void`: function to close notification
- options: `object`
  - order `'ASC' | 'DESC'`: define the order of notification (default to 'DESC')
  - closeTimeout `number`: duration in milliseconds before auto-close the notification. If the notification is over by user, the timeout is reset. You can set it `null` if you want notification which will not close automatically. (default to 2000)
  - translateDuration `number`: duration in milliseconds of translate animation when a notification above is close or a new notification appear above (default to 200)
  - translateDelay `number`: delay in millisecond of the vertical translate animation when a notification above is close or a new notification appear above (default to 100)
  - animationDuration `number | { enter: number; exit: number }`: duration of enter/exit animation (default to 300)
  - animationClassNames `{ enter: string; enterActive: string; exit: string; exitActive: string }`: class to apply on notification for enter and exit animations
  - zIndex `number`: you can chose an appropriate z-index to fit with your expected behavior with other components using portal (default to 9999)

notifier instance method :
- create `function(data: object): void`: create a new notification displayed at top right
