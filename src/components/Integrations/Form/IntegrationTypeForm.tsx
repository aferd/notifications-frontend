import { assertNever } from 'assert-never';
import * as React from 'react';
import {
  IntegrationType,
  UserIntegrationType,
  isCamelType,
} from '../../../types/Integration';
import { IntegrationTypeCamelExtrasForm } from './IntegrationTypeCamelExtrasForm';
import { IntegrationTypeCamelForm } from './IntegrationTypeCamelForm';
import { IntegrationTypeGoogleChatForm } from './IntegrationTypeGoogleChatForm';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';
import { IntegrationTypeSlackForm } from './IntegrationTypeSlackForm';
import { IntegrationTypeTeamsForm } from './IntegrationTypeTeamsForm';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

export interface IntegrationTypeForm extends OuiaProps {
  type: UserIntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<
  IntegrationTypeForm
> = (props) => {
  if (isCamelType(props.type)) {
    switch (props.type) {
      case UserIntegrationType.SPLUNK:
        return (
          <IntegrationTypeCamelExtrasForm
            secretTokenDescription="The defined secret token is sent as a Splunk's HTTP Event Collector token."
            {...props}
          />
        );
      case UserIntegrationType.SERVICE_NOW:
        return (
          <IntegrationTypeCamelExtrasForm
            secretTokenDescription="Password of a ServiceNow integration user."
            {...props}
          />
        );
      case UserIntegrationType.SLACK:
        return <IntegrationTypeSlackForm {...props} />;
      case UserIntegrationType.TEAMS:
        return <IntegrationTypeTeamsForm {...props} />;
      case UserIntegrationType.GOOGLE_CHAT:
        return <IntegrationTypeGoogleChatForm {...props} />;
    }

    return <IntegrationTypeCamelForm {...props} />;
  }

  switch (props.type) {
    case IntegrationType.WEBHOOK:
    case IntegrationType.ANSIBLE:
      return <IntegrationTypeHttpForm {...props} />;
    case IntegrationType.PAGERDUTY:
      return null;
    default:
      assertNever(props.type);
  }
};
