import React from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Header from 'src/components/Header';
import Copyright from 'src/components/Copyright';
import {
  BarSpacer,
  StyledContainer as Container,
  StyledPaper as Paper,
  FixedHeightdPaper,
} from './Home.style';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <div>
        <BarSpacer />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <FixedHeightdPaper>Soon a nice chart to display ratings.</FixedHeightdPaper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <FixedHeightdPaper>Bet here</FixedHeightdPaper>
            </Grid>
            <Grid item xs={12}>
              <Paper>List of last bets.</Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Home;
