import { Operations } from '../../generated/OpenapiNotifications';
import { UUID } from '../../types/Notification';
import NotificationServiceUpdateEventTypeBehaviors = Operations.NotificationResource$v1UpdateEventTypeBehaviors;

export const linkBehaviorGroupAction = (
  notificationId: UUID,
  behaviorGroupIds: Array<UUID>
) => {
  return NotificationServiceUpdateEventTypeBehaviors.actionCreator({
    body: behaviorGroupIds,
    eventTypeId: notificationId,
  });
};
