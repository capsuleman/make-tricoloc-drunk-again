import React from 'react';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

import { StyledContainer, StyledAvatar, Form, SubmitButton } from './SignIn.style';

const SignIn: React.FC = () => {
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
          autoComplete="text"
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
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Se souvenir de moi"
        />
        <SubmitButton type="submit" fullWidth variant="contained" color="primary">
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
        <Typography variant="body2" color="textSecondary" align="center">
          {' Copyright © '}
          <Link color="inherit" href="https://gifree.cs-campus.fr/" target="_blank">
            MiloLePlusBeau
          </Link>
          {` ${new Date().getFullYear()}.`}
        </Typography>
      </Box>
    </StyledContainer>
  );
};

export default SignIn;
