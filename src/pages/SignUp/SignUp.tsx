import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router-dom';

import Copyright from 'src/components/Copyright';
import { PATHS } from 'src/routes';

import client from 'src/services/networking/client';
import { StyledContainer, StyledAvatar, Form, SubmitButton, StyledLink } from './SignUp.style';

const SignIn: React.FC = () => {
  const history = useHistory();

  const [firstname, setFirstname] = React.useState<string>('');
  const [lastname, setLastname] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [isNikingMarine, setIsNikingMarine] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isUsernameTaken, setIsUsernameTaken] = React.useState<boolean>(false);

  const handleSubmitClick = async () => {
    setIsLoading(true);
    try {
      await client.register(username, password, firstname, lastname, isNikingMarine);
    } catch (err) {
      console.log(err.message);
      if (err.message === 'Conflict') {
        setIsUsernameTaken(true);
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
        Création de compte
      </Typography>
      <Form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              label="Prénom"
              autoFocus
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Nom"
              autoComplete="lname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Nom d'utilisateur"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsUsernameTaken(false);
              }}
              error={isUsernameTaken}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="Nik Marine."
              value={isNikingMarine}
              onChange={() => setIsNikingMarine(!isNikingMarine)}
            />
          </Grid>
        </Grid>
        <SubmitButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmitClick}
          endIcon={isLoading && <CircularProgress color="secondary" size={20} />}
        >
          Créer mon compte
        </SubmitButton>
        <Grid container justify="flex-end">
          <Grid item>
            <StyledLink onClick={() => history.push(PATHS.SIGNIN)} variant="body2">
              Déjà un compte&nbsp;? Connexion
            </StyledLink>
          </Grid>
        </Grid>
      </Form>
      <Box mt={5}>
        <Copyright />
      </Box>
    </StyledContainer>
  );
};

export default SignIn;
