import { createElement, ComponentType } from 'react';
import { render } from 'react-dom';
import Notifications from './Notifications';
import { NotifierOptions, NotifierProps, NotificationProps } from './types';

const defaultAnimationClassNames = {
  enter: '',
  enterActive: '',
  exit: '',
  exitActive: '',
};

class Notifier<T> {
  private notifications: NotifierProps<T>[] = [];
  private component: ComponentType<NotificationProps<T>>;
  private options: NotifierOptions;
  private reactElement: Notifications<T> | null = null;

  constructor(component: ComponentType<NotificationProps<T>>, options?: Partial<NotifierOptions>) {
    this.setReactElement = this.setReactElement.bind(this);

    const {
      order = 'DESC',
      closeTimeout = 2000,
      translateDuration = 200,
      translateDelay = 100,
      animationDuration = 300,
      animationClassNames = defaultAnimationClassNames,
      zIndex = 9999,
    } = options ? options : {};
    this.component = component;
    this.options = {
      order,
      closeTimeout,
      translateDuration,
      translateDelay,
      animationDuration,
      animationClassNames,
      zIndex,
    };

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.right = '0';
    container.style.zIndex = `${zIndex}`;
    document.body.appendChild(container);
    this.renderReactElement(container);
  }

  private renderReactElement(container: HTMLDivElement) {
    const {
      translateDuration,
      translateDelay,
      animationClassNames,
      animationDuration,
      zIndex,
    } = this.options;

    const notificationElement = (
      <Notifications
        ref={this.setReactElement}
        component={this.component}
        translateDuration={translateDuration}
        translateDelay={translateDelay}
        animationClassNames={animationClassNames}
        animationDuration={animationDuration}
      />
    );

    render(notificationElement, container);
  }

  private setReactElement(ref: Notifications<T> | null) {
    this.reactElement = ref;
  }

  private updateNotifications(notifications: NotifierProps<T>[]) {
    this.notifications = notifications;

    if (this.reactElement) {
      this.reactElement.setState({ notifications: this.notifications });
    }
  }

  private createAutoCloseNotif(data: T, closeTimeout: number): NotifierProps<T> {
    const { animationDuration, animationClassNames } = this.options;
    const id = Date.now();
    const handleClose = () => this.close(id);

    let closeTimer = window.setTimeout(handleClose, closeTimeout);

    const handleMouseEnter = () => {
      window.clearTimeout(closeTimer);
    };
    const handleMouseLeave = () => {
      closeTimer = window.setTimeout(handleClose, closeTimeout);
    };

    return {
      id,
      handleClose,
      handleMouseEnter,
      handleMouseLeave,
      animationDuration,
      animationClassNames,
      data,
    };
  }

  private createManualCloseNotif(data: T): NotifierProps<T> {
    const { animationDuration, animationClassNames } = this.options;
    const id = Date.now();
    const handleClose = () => this.close(id);
    return { id, handleClose, animationDuration, animationClassNames, data };
  }

  private close(id: number) {
    const notificationIndex = this.notifications.findIndex(notification => notification.id === id);

    if (notificationIndex >= 0) {
      const notifications = [...this.notifications];
      notifications.splice(notificationIndex, 1);

      this.updateNotifications(notifications);
    }
  }

  create(data: T) {
    const { order, closeTimeout } = this.options;
    const newNotification = closeTimeout
      ? this.createAutoCloseNotif(data, closeTimeout)
      : this.createManualCloseNotif(data);

    if (order === 'ASC') {
      this.updateNotifications([...this.notifications, newNotification]);
    } else {
      this.updateNotifications([newNotification, ...this.notifications]);
    }
  }
}

export default Notifier;
