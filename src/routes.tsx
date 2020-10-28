import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router';

import Loader from 'src/components/Loader';
import client from 'src/services/networking/client';

export const PATHS = {
  ROOT: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  HOME: '/home',
};

const SignIn = lazy(() => import('src/pages/SignIn'));
const SignUp = lazy(() => import('src/pages/SignUp'));
const Home = lazy(() => import('src/pages/Home'));

const StudyCoordinatorRoutes: React.FunctionComponent = () => (
  <Suspense fallback={<Loader />}>
    <Switch>
      <Route exact path={PATHS.HOME} component={Home} />
      <Route exact path={PATHS.SIGNIN} component={SignIn} />
      <Route exact path={PATHS.SIGNUP} component={SignUp} />
      <Redirect to={client.isLogged() ? PATHS.HOME : PATHS.SIGNIN} />
    </Switch>
  </Suspense>
);

export default StudyCoordinatorRoutes;
