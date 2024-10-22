import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import {
  IntegrationCamel,
  IntegrationPagerduty,
  IntegrationType,
  TypedIntegration,
  UserIntegrationType,
} from '../../../types/Integration';
import { GoogleChatExpandedContent } from './ExpandedContent/GoogleChatExpandedContent';
import { IntegrationExpandedContent } from './ExpandedContent/IntegrationExpandedContent';
import { SlackExpandedContent } from './ExpandedContent/SlackExpandedContent';
import { TeamsExpandedContent } from './ExpandedContent/TeamsExpandedContent';
import { PagerDutyExpandedContent } from './ExpandedContent/PagerDutyExpandedContent';
import { useFlag } from '@unleash/proxy-client-react';

export const expandedContentTitleClass = style({
  fontWeight: 400,
});

export interface ExpandedContentProps<T extends IntegrationType>
  extends OuiaComponentProps {
  integration: TypedIntegration<T>;
}

export const ExpandedContent: React.FunctionComponent<
  ExpandedContentProps<UserIntegrationType>
> = (props) => {
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');

  if (props.integration.type === IntegrationType.SLACK) {
    return (
      <SlackExpandedContent
        integration={props.integration as IntegrationCamel}
      />
    );
  }

  if (props.integration.type === IntegrationType.TEAMS) {
    return (
      <TeamsExpandedContent
        integration={props.integration as IntegrationCamel}
      />
    );
  }

  if (props.integration.type === IntegrationType.GOOGLE_CHAT) {
    return (
      <GoogleChatExpandedContent
        integration={props.integration as IntegrationCamel}
      />
    );
  }

  {
    isPagerDutyEnabled ? (
      props.integration.type === IntegrationType.PAGERDUTY ? (
        <PagerDutyExpandedContent
          integration={props.integration as IntegrationPagerduty}
        />
      ) : null
    ) : (
      ''
    );
  }

  return <IntegrationExpandedContent {...props} />;
};
