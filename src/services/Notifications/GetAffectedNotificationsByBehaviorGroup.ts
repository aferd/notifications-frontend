import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toNotifications } from '../../types/adapters/NotificationAdapter';
import { UUID } from '../../types/Notification';
import { useTransformQueryResponse } from '../../utils/insights-common-typescript';

const getAffectedNotificationsByBehaviorGroupAction = (id: UUID) => {
  return Operations.NotificationResource$v1GetEventTypesAffectedByRemovalOfBehaviorGroup.actionCreator(
    {
      behaviorGroupId: id,
    }
  );
};

const defaultNotificationsDecoder = validationResponseTransformer(
  (
    payload: Operations.NotificationResource$v1GetEventTypesAffectedByRemovalOfBehaviorGroup.Payload
  ) => {
    if (payload.status === 200) {
      return validatedResponse(
        'Notifications',
        200,
        toNotifications(payload.value),
        payload.errors
      );
    }

    return payload;
  }
);

export const useGetAffectedNotificationsByBehaviorGroupQuery = (id: UUID) =>
  useTransformQueryResponse(
    useQuery(getAffectedNotificationsByBehaviorGroupAction(id)),
    defaultNotificationsDecoder
  );
