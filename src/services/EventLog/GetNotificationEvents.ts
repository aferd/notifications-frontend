import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';
import { toNotificationEvent } from '../../types/adapters/NotificationEventAdapter';
import {
  Page,
  useTransformQueryResponse,
} from '../../utils/insights-common-typescript';

const eventDecoder = validationResponseTransformer(
  (payload: Operations.EventResource$v1GetEvents.Payload) => {
    if (payload.status === 200) {
      return validatedResponse(
        'Events',
        200,
        {
          ...payload.value,
          data: payload.value.data.map(toNotificationEvent),
        },
        payload.errors
      );
    }

    return payload;
  }
);

export const useGetEvents = (page?: Page) => {
  const query = (page ?? Page.defaultPage()).toQuery();
  return useTransformQueryResponse(
    useQuery(
      Operations.EventResource$v1GetEvents.actionCreator({
        limit: +query.limit,
        offset: +query.offset,
        bundleIds: query.filterBundleIds as [],
        appIds: query.filterAppIds as [],
        invocationResults: query.filterInvocationResults as [],
        status: query.filterStatus as [],
        endpointTypes: query.filterEndpointTypes as [],
        startDate: query.filterStart as string,
        endDate: query.filterEnd as string,
        eventTypeDisplayName: query.filterEvent as string,
        sortBy: `${query.sortColumn}:${query.sortDirection}`,
        includeActions: true,
      })
    ),
    eventDecoder
  );
};
