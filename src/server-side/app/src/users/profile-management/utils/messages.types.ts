import { WSMessage, WSMessageType } from '../../../events/events.types';
import { RelationshipStatus } from '../entities/relationship.entity';

// export enum RelationshipEvent {
//   REQUEST = 'REQUEST',
//   APPROVE = 'APPROVE',
//   REJECT = 'REJECT',
// }

// export function RelationshipNotificationMessage(event: RelationshipStatus, message: string | null): WSMessage {
//   return {
//     type: WSMessageType.NOTIFICATION,
//     info: {
//       category: 'Relationship',
//       event: event,
//       fetch: true,
//       message: message
//     }
//   }
// }