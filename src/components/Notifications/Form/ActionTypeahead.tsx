import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core/deprecated/';
import produce from 'immer';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { useIntegrations } from '../../../hooks/useIntegrations';
import { useNotifications } from '../../../hooks/useNotifications';
import { linkTo } from '../../../Routes';
import {
  UserIntegrationType,
  isUserIntegrationType,
} from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { useRecipientContext } from '../RecipientContext';
import { ActionOption } from './ActionOption';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

const getSelectOptions = (
  availableNotificationTypes: ReadonlyArray<NotificationType>,
  availableIntegrationTypes: ReadonlyArray<UserIntegrationType>,
  selectedNotifications: ReadonlyArray<NotificationType>
) => [
  ...availableNotificationTypes
    .filter((type) => !selectedNotifications.includes(type))
    .map(
      (type) =>
        new ActionOption({
          kind: 'notification',
          type,
        })
    ),
  ...availableIntegrationTypes.map(
    (type) =>
      new ActionOption({
        kind: 'integration',
        type,
      })
  ),
];

type NoIntegrationConfigured = {
  Comp?: React.ComponentType<unknown>;
  testNoIntegrationRenderWithoutRelAndTarget?: boolean;
};

const NoIntegrationConfigured: React.FunctionComponent<
  NoIntegrationConfigured
> = (props) => (
  <>
    <div>You have no integration configured.</div>
    {props.Comp && <props.Comp />}
    <div>
      Go to Settings {'>'}{' '}
      <Link
        style={{ pointerEvents: 'all' }}
        rel={
          props.testNoIntegrationRenderWithoutRelAndTarget
            ? undefined
            : 'noopener noreferrer'
        }
        target={
          props.testNoIntegrationRenderWithoutRelAndTarget
            ? undefined
            : '_blank'
        }
        to={linkTo.integrations()}
      >
        Integrations
      </Link>{' '}
      to configure.
    </div>
  </>
);

export interface ActionTypeaheadProps extends OuiaProps {
  selectedNotifications: ReadonlyArray<NotificationType>;
  action?: Action;
  isDisabled?: boolean;
  onSelected: (actionOption: ActionOption) => void;
  testNoIntegrationRenderWithoutRelAndTarget?: boolean;
}

export const ActionTypeahead: React.FunctionComponent<ActionTypeaheadProps> = (
  props
) => {
  const [isOpen, setOpen] = React.useState(false);
  const { getIntegrations } = useRecipientContext();
  const [hasIntegrations, setHasIntegrations] = React.useState<
    Record<UserIntegrationType, boolean>
  >(
    Object.values(UserIntegrationType).reduce((types, type) => {
      types[type] = true;
      return types;
    }, {} as Record<UserIntegrationType, boolean>)
  );

  React.useEffect(() => {
    Object.values(UserIntegrationType).forEach(async (type) => {
      const values = await getIntegrations(type);
      setHasIntegrations(
        produce((draft) => {
          draft[type] = values.length > 0;
        })
      );
    });
  }, [getIntegrations]);

  const toggle = React.useCallback(
    (isExpanded: boolean) => {
      setOpen(isExpanded);
    },
    [setOpen]
  );

  const onSelect = React.useCallback(
    (_event, value: string | SelectOptionObject) => {
      const actionSelected = props.onSelected;
      if (value instanceof ActionOption) {
        actionSelected(value);
        setOpen(false);
      }
    },
    [props.onSelected, setOpen]
  );

  const selectedOption = React.useMemo(() => {
    if (!props.action) {
      return undefined;
    }

    if (props.action.type === NotificationType.INTEGRATION) {
      return new ActionOption({
        kind: 'integration',
        type: props.action.integration.type,
      });
    }

    return new ActionOption({
      kind: 'notification',
      type: props.action.type,
    });
  }, [props.action]);

  const integrationTypes = useIntegrations();
  const notificationTypes = useNotifications();

  const selectableOptions = React.useMemo(() => {
    return getSelectOptions(
      notificationTypes,
      integrationTypes,
      props.selectedNotifications
    ).map((o) => {
      const isDisabled =
        isUserIntegrationType(o.integrationType) &&
        !hasIntegrations[o.integrationType];
      return (
        <SelectOption
          isDisabled={isDisabled}
          key={o.toString()}
          value={o}
          description={
            isDisabled && (
              <NoIntegrationConfigured
                testNoIntegrationRenderWithoutRelAndTarget={
                  props.testNoIntegrationRenderWithoutRelAndTarget
                }
              />
            )
          }
        />
      );
    });
  }, [
    notificationTypes,
    integrationTypes,
    props.selectedNotifications,
    hasIntegrations,
    props.testNoIntegrationRenderWithoutRelAndTarget,
  ]);

  return (
    <div {...getOuiaProps('ActionTypeahead', props)}>
      <Select
        maxHeight={400}
        variant={SelectVariant.single}
        aria-label="Select action"
        placeholderText="Select action"
        selections={selectedOption}
        onToggle={(_e, val) => toggle(val)}
        isOpen={isOpen}
        onSelect={onSelect}
        menuAppendTo={document.body}
        isDisabled={props.isDisabled}
      >
        {selectableOptions}
      </Select>
    </div>
  );
};
