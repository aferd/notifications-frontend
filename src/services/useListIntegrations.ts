import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useParameterizedQuery, useQuery } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiIntegrations';
import { toIntegrations } from '../types/adapters/IntegrationAdapter';
import { IntegrationType, UserIntegration } from '../types/Integration';
import {
  Page,
  useTransformQueryResponse,
} from '../utils/insights-common-typescript';

export const listIntegrationsActionCreator = (pager?: Page) => {
  const query = (pager ?? Page.defaultPage()).toQuery();
  return Operations.EndpointResource$v1GetEndpoints.actionCreator({
    limit: +query.limit,
    offset: +query.offset,
    type: query.filterType
      ? (query.filterType as Array<IntegrationType>)
      : undefined,
    active: query.filterActive ? query.filterActive === 'true' : undefined,
    name: query.filterName ? query.filterName.toString() : '',
    sortBy: pager?.sort
      ? `${pager.sort.column}:${pager.sort.direction}`
      : undefined,
  });
};

export const listIntegrationIntegrationDecoder = validationResponseTransformer(
  (payload: Operations.EndpointResource$v1GetEndpoints.Payload) => {
    if (payload?.status === 200) {
      return validatedResponse(
        'IntegrationPage',
        200,
        {
          data: toIntegrations(payload.value.data) as Array<UserIntegration>,
          count: payload.value.meta.count,
        },
        payload.errors
      );
    }

    return payload;
  }
);

export const useListIntegrationsQuery = (pager?: Page, initFetch?: boolean) =>
  useTransformQueryResponse(
    useQuery(listIntegrationsActionCreator(pager), initFetch),
    listIntegrationIntegrationDecoder
  );

export const useListIntegrationPQuery = () =>
  useTransformQueryResponse(
    useParameterizedQuery(listIntegrationsActionCreator),
    listIntegrationIntegrationDecoder
  );
