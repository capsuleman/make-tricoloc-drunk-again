import React from 'react';

import { useHistory } from 'react-router-dom';

import client from 'src/services/networking/client';
import { PATHS } from 'src/routes';

interface Me {
  username: string;
  firstname: string;
  lastname: string;
  isNikingMarine: boolean;
}

const Home: React.FC = () => {
  const history = useHistory();

  const [me, setMe] = React.useState<Me>();

  React.useEffect(() => {
    if (!client.isLogged()) {
      history.push(PATHS.SIGNIN);
      return;
    }
    client.me().then((me) => setMe(me));
    // .catch((err) => history.push('logout'));
  }, [history]);

  return (
    <>
      Hello {me?.firstname} {me?.lastname} ({me?.username})<br />
      {me && me.isNikingMarine && 'You are niking Marine. :-)'}
      {me && !me.isNikingMarine && 'You are not niking Marine. :-('}
    </>
  );
};

export default Home;
