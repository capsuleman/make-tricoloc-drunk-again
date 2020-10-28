import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';

import client from 'src/services/networking/client';
import { StyledContainer, StyledAvatar, Form, SubmitButton, StyledLink } from './SignIn.style';
import Copyright from 'src/components/Copyright';
import { PATHS } from 'src/routes';

const SignIn: React.FC = () => {
  const history = useHistory();

  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isUsernameWrong, setIsUsernameWrong] = React.useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (client.isLogged()) {
      history.push(PATHS.HOME);
    }
  }, [history]);

  const handleSubmitClick = async () => {
    setIsLoading(true);
    try {
      await client.login(username, password);
      history.push(PATHS.HOME);
    } catch (err) {
      if (err.message === 'Not Found') {
        setIsUsernameWrong(true);
        setIsPasswordWrong(true);
      } else if (err.message === 'Unauthorized') {
        setIsUsernameWrong(false);
        setIsPasswordWrong(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <StyledContainer maxWidth="xs">
      <StyledAvatar>
        <LockOutlinedIcon />
      </StyledAvatar>
      <Typography component="h1" variant="h5">
        Connexion
      </Typography>
      <Form>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Nom d'utilisateur"
          autoComplete="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsUsernameWrong(false);
          }}
          error={isUsernameWrong}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Mot de passe"
          type="password"
          autoComplete="current-password"
          value={password}
          error={isPasswordWrong}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsPasswordWrong(false);
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Se souvenir de moi"
        />
        <SubmitButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmitClick}
          endIcon={isLoading && <CircularProgress color="secondary" size={20} />}
        >
          Connexion
        </SubmitButton>
        <Grid container>
          <Grid item xs>
            <StyledLink variant="body2">Mot de passe oublié&nbsp;?</StyledLink>
          </Grid>
          <Grid item>
            <StyledLink variant="body2" onClick={() => history.push(PATHS.SIGNUP)}>
              Créer un compte
            </StyledLink>
          </Grid>
        </Grid>
      </Form>
      <Box mt={8}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
};

export default SignIn;
