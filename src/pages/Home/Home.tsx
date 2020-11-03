import React from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Header from 'src/components/Header';
import Copyright from 'src/components/Copyright';
import AddBet from './components/AddBet';
import AllBets from './components/AllBets';
import { BarSpacer, StyledContainer as Container, FixedHeightdPaper } from './Home.style';

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
              <AddBet />
            </Grid>
            <Grid item xs={12}>
              <AllBets />
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
