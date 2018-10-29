import { ComponentType } from 'react';

interface NotifierOptions {
  order: 'ASC' | 'DESC';
  closeTimeout: number | null;
  translateDuration: number;
  translateDelay: number;
  animationDuration: number | { enter: number; exit: number };
  animationClassNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
  zIndex: number;
}

interface NotifierProps<T> {
  id: number;
  handleClose: () => void;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
  animationDuration: number | { enter: number; exit: number };
  animationClassNames: {
    enter: string;
    enterActive: string;
    exit: string;
    exitActive: string;
  };
  data: T;
}

interface NotificationProps<T> {
  handleClose: () => void;
  data: T;
}

export { NotifierOptions, NotifierProps, NotificationProps };
