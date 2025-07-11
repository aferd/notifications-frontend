import { assertNever } from 'assert-never';

import { IntegrationFilterColumn } from '../../../components/Integrations/Filters';
import {
  useFilters,
  useUrlStateMultipleOptions,
  useUrlStateString,
} from '../../../utils/insights-common-typescript';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) =>
  useUrlStateString('name', defaultValue);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useUrlStateEnabled = (_defaultValue?: string) =>
  useUrlStateMultipleOptions('enabled', ['Enabled', 'Disabled']);

const useStateFactory = (column: IntegrationFilterColumn) => {
  switch (column) {
    case IntegrationFilterColumn.NAME:
      return useUrlStateName;
    case IntegrationFilterColumn.ENABLED:
      return useUrlStateEnabled;
    default:
      assertNever(column);
  }
};

export const useIntegrationFilter = (debounce = DEBOUNCE_MS) => {
  return useFilters(IntegrationFilterColumn, debounce, useStateFactory);
};
