import * as React from 'react';
import { Redirect } from 'react-router';

import { linkTo } from '../Routes';

export const defaultBundleName = 'rhel';

export const RedirectToDefaultBundle = () => <Redirect from={ linkTo.notifications('') } to={ linkTo.notifications(defaultBundleName) } />;
