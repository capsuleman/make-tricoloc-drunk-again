import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router';

import Loader from 'src/components/Loader';

export const PATHS = {
  ROOT: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
};

const SignIn = lazy(() => import('src/pages/SignIn'));
const SignUp = lazy(() => import('src/pages/SignUp'));

const StudyCoordinatorRoutes: React.FunctionComponent = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path={PATHS.SIGNIN} component={SignIn} />
      <Route exact path={PATHS.SIGNUP} component={SignUp} />
      <Redirect to={PATHS.ROOT} />
    </Switch>
  </Suspense>
);

export default StudyCoordinatorRoutes;
