import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiNotifications';
import { ServerIntegrationResponse } from '../Integration';
import { Action, Notification, NotificationType, ServerNotificationResponse } from '../Notification';
import { filterOutDefaultAction, toIntegration, toUserIntegration } from './IntegrationAdapter';

const _toAction = (type: NotificationType, serverAction: ServerIntegrationResponse): Action => {
    if (type === NotificationType.INTEGRATION) {
        const userIntegration = toUserIntegration(serverAction);
        return {
            type,
            integrationId: userIntegration.id,
            integration: userIntegration
        };
    }

    const integration = toIntegration(serverAction);

    return {
        type,
        integrationId: integration.id,
        recipient: []
    };
};

export const usesDefault = (endpoints: Array<Schemas.Endpoint>): boolean =>
    endpoints.findIndex(e => e.type === Schemas.EndpointType.enum.default) !== -1;

export const toNotification = (serverNotification: ServerNotificationResponse): Notification => {
    if (!serverNotification.id || !serverNotification.application) {
        throw new Error(`Unexpected notification from server ${JSON.stringify(serverNotification)}`);
    }

    return {
        id: serverNotification.id,
        applicationDisplayName: serverNotification.application.display_name,
        eventTypeDisplayName: serverNotification.display_name,
        actions: undefined,
        useDefault: undefined
    };
};

export const toAction = (serverAction: ServerIntegrationResponse): Action => {
    switch (serverAction.type) {
        case Schemas.EndpointType.enum.webhook:
            return _toAction(NotificationType.INTEGRATION, serverAction);
        case Schemas.EndpointType.enum.email_subscription:
            return _toAction(NotificationType.EMAIL_SUBSCRIPTION, serverAction);
        case Schemas.EndpointType.enum.default:
            throw new Error('EndpointType.default should not reach this point');
        default:
            assertNever(serverAction.type);
    }
};

export const toNotifications = (serverNotifications: Array<ServerNotificationResponse>) => serverNotifications.map(toNotification);
export const toActions = (serverActions: Array<ServerIntegrationResponse>): Array<Action> => filterOutDefaultAction(serverActions).map(toAction);
