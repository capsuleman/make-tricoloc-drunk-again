import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import client from 'src/services/networking/client';
import { StyledContainer, StyledAvatar, Form, SubmitButton } from './SignIn.style';
import Copyright from 'src/components/Copyright';

const SignIn: React.FC = () => {
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isUsernameWrong, setIsUsernameWrong] = React.useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmitClick = async () => {
    setIsLoading(true);
    try {
      await client.login(username, password);
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
            <Link href="#" variant="body2">
              Mot de passe oublié&nbsp;?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              Créer un compte
            </Link>
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
