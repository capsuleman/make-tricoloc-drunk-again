import React from 'react';

import { useHistory } from 'react-router-dom';

import client from 'src/services/networking/client';
import { PATHS } from 'src/routes';

interface Me {
  username: string;
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

  return <>Hello {me?.username}</>;
};

export default Home;
