export enum WSMessageType {
  NOTIFICATION = 'notification',
  MESSAGE = 'message',
  GAMEDATA = 'gamedata'
}

interface NotificationInfo {
  category: string;
  event: string;
  fetch: boolean;
  message?: string | JSON;
  silent?: boolean;
}

export interface WSMessage {
  type: WSMessageType;
  info: NotificationInfo | string;
}

export enum SystemEvent {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
}

export function SystemMessage(event: SystemEvent, message: string = ""): WSMessage | string {
  return {
    type: WSMessageType.NOTIFICATION,
    info: {
      category: 'System',
      event: event,
      fetch: false,
      silent: true,
      message: message
    }
  }
}