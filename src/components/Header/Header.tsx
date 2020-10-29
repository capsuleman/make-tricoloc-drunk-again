import React from 'react';
import { useHistory } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import client from 'src/services/networking/client';
import { PATHS } from 'src/routes';
import { Title, Username } from './Header.style';

interface Me {
  username: string;
  firstname: string;
  lastname: string;
  isNikingMarine: boolean;
}

const Header: React.FC = () => {
  const history = useHistory();

  const [me, setMe] = React.useState<Me>();

  React.useEffect(() => {
    if (!client.isLogged()) {
      history.push(PATHS.SIGNIN);
      return;
    }
    client.me().then((me) => setMe(me));
  }, [history]);

  const handleLogout = () => {
    client.logout();
    history.push(PATHS.SIGNIN);
  };

  return (
    <AppBar position="absolute">
      <Toolbar>
        <Title noWrap>Make Tricoloc Drunk Again</Title>
        <Username>{me?.username}</Username>
        <IconButton color="inherit" edge="end" onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
