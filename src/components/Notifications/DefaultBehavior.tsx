import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/camelcase
import { global_spacer_md, global_spacer_sm, global_spacer_lg } from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { NotificationType, DefaultNotificationBehavior } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { style } from 'typestyle';
import { ActionComponent } from './ActionComponent';
import { Button, ButtonVariant, Flex, FlexItem } from '@patternfly/react-core';

export interface DefaultBehaviorProps extends OuiaComponentProps {
    defaultBehavior: DefaultNotificationBehavior;
    onEdit: () => void;
}

const contentClassName = style({
    backgroundColor: '#f0f0f0',
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    paddingLeft: global_spacer_md.var,
    paddingRight: global_spacer_md.var
});

const tableClassName = style({
    paddingTop: global_spacer_lg.var,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: global_spacer_sm.var,
            paddingBottom: global_spacer_sm.var,
            paddingLeft: global_spacer_md.var,
            paddingRight: global_spacer_md.var
        }
    }
});

const titleClassName = style({
    fontWeight: 600
});

export const DefaultBehavior: React.FunctionComponent<DefaultBehaviorProps> = (props) => (
    <div { ...getOuiaProps('Notifications/DefaultBehavior', props) } className={ contentClassName } >
        <Flex
            justifyContent={ { default: 'justifyContentSpaceBetween' } }
        >
            <FlexItem><div className={ titleClassName }>Default behavior</div></FlexItem>
            <FlexItem><Button onClick={ props.onEdit } variant={ ButtonVariant.link }>Edit</Button></FlexItem>
        </Flex>
        <div>Default behavior applies to all notifications in a bundle. You can override this default for any specific event type.</div>
        <table className={ tableClassName }>
            <thead>
                <tr>
                    <th>Action</th>
                    <th>Recipient</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.defaultBehavior.actions.map((a, index) => {
                        return (
                            <tr key={ index }>
                                <td><ActionComponent isDefault={ false } action={ a }/></td>
                                <td>{ a.type === NotificationType.INTEGRATION ? a.integration.name : a.recipient.join(', ') }</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    </div>
);

