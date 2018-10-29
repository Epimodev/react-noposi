import { createElement, Component, ComponentType, CSSProperties } from 'react';
import { TransitionGroup, CssTransition } from 'sento-transition';
import { NotifierProps, NotificationProps } from './types';

interface NotifPosition {
  top: number;
  right: number;
  zIndex: number;
}

interface Props<T> {
  component: ComponentType<NotificationProps<T>>;
  translateDuration: number;
  translateDelay: number;
  animationDuration: number | { enter: number; exit: number };
  animationClassNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
}

interface State<T> {
  windowHeight: number;
  positions: NotifPosition[];
  notifications: NotifierProps<T>[];
  positionComputed: boolean;
}

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
};

function getElementPosition(
  elements: HTMLCollection,
  positions: NotifPosition[],
  windowHeight: number,
  index: number,
): NotifPosition {
  if (index === 0) {
    return { top: 0, right: 0, zIndex: 9999 };
  }

  const previousPosition = positions[index - 1];
  const previousChild = elements[index - 1];
  const child = elements[index];
  const previousHeight = previousChild.firstElementChild!.getBoundingClientRect().height;
  const childHeight = child.firstElementChild!.getBoundingClientRect().height;
  const top = previousPosition.top + previousHeight;
  const bottomPosition = windowHeight - (top + childHeight);
  const isInScreen = bottomPosition > 0;

  if (isInScreen) {
    return {
      top,
      right: 0,
      zIndex: previousPosition.zIndex,
    };
  }

  return {
    top: previousPosition.top + 5,
    right: previousPosition.right + 5,
    zIndex: previousPosition.zIndex - 1,
  };
}

function computePositions(container: HTMLDivElement, windowHeight: number): NotifPosition[] {
  const { children } = container;
  const positions: NotifPosition[] = [];
  const nbChildren = children.length;
  for (let i = 0; i < nbChildren; i += 1) {
    const position = getElementPosition(children, positions, windowHeight, i);
    positions.push(position);
  }

  return positions;
}

class Notifications<T> extends Component<Props<T>, State<T>> {
  state: State<T> = {
    windowHeight: window.innerHeight,
    positions: [],
    notifications: [],
    positionComputed: false,
  };
  container: HTMLDivElement | null = null;

  constructor(props: Props<T>) {
    super(props);

    this.updateWindowHeight = this.updateWindowHeight.bind(this);
    this.setContainer = this.setContainer.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowHeight);
  }

  componentDidUpdate(prevProps: Props<T>, prevState: State<T>) {
    this.setState(state => {
      if (this.container) {
        const notificationChanged = prevState.notifications !== state.notifications;
        const heightChanged = prevState.windowHeight !== state.windowHeight;

        if (notificationChanged || heightChanged) {
          return { positions: state.positions, positionComputed: false };
        }
        if (!state.positionComputed) {
          const positions = computePositions(this.container, state.windowHeight);
          return { positions, positionComputed: true };
        }
      }
      return null;
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowHeight);
  }

  updateWindowHeight() {
    this.setState({ windowHeight: window.innerHeight });
  }

  getLastNotifRect() {
    if (this.container) {
      const { children } = this.container;
      const lastChild = children[children.length - 1];
      if (lastChild) {
        return lastChild.firstElementChild!.getBoundingClientRect();
      }
    }

    return undefined;
  }

  getNotificationPosition(index: number): NotifPosition {
    const { positions } = this.state;

    if (positions[index] !== undefined) {
      return positions[index];
    }

    const lastChildRect = this.getLastNotifRect();
    if (lastChildRect) {
      return {
        top: lastChildRect.top + lastChildRect.height,
        right: 0,
        zIndex: 9999,
      };
    }

    const lastIndex = positions.length - 1;
    const lastPosition = lastIndex >= 0 ? positions[lastIndex] : { top: 0, right: 0, zIndex: 9999 };
    return lastPosition;
  }

  getNotificationStyle(index: number): CSSProperties {
    const { translateDuration, translateDelay } = this.props;
    const { top, right, zIndex } = this.getNotificationPosition(index);

    return {
      position: 'relative',
      zIndex,
      transform: `translate3d(${right}px, ${top}px, 0)`,
      transition: `${translateDuration}ms`,
      transitionDelay: `${translateDelay}ms`,
    };
  }

  setContainer(element: HTMLDivElement | null) {
    this.container = element;
  }

  render() {
    const { component, animationDuration, animationClassNames } = this.props;
    const { notifications } = this.state;

    return (
      <div ref={this.setContainer}>
        <TransitionGroup>
          {notifications.map((notification, index) => {
            return (
              <CssTransition
                key={notification.id}
                classNames={animationClassNames}
                timeout={animationDuration}
                animateOnMount
              >
                <div style={containerStyle}>
                  <div
                    style={this.getNotificationStyle(index)}
                    onMouseEnter={notification.handleMouseEnter}
                    onMouseLeave={notification.handleMouseLeave}
                  >
                    {createElement(component, notification)}
                  </div>
                </div>
              </CssTransition>
            );
          })}
        </TransitionGroup>
      </div>
    );
  }
}

export default Notifications;
