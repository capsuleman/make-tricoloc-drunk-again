import React from 'react';

import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

import client from 'src/services/networking/client';

import { Container, Title } from './AllBets.style';

interface Bet {
  username: string;
  firstname: string;
  lastname: string;
  optionName: string;
  numberOfShotBet: number;
  numberOfShotIfWin: number;
  time: number;
}

interface IProps {
  numberOfSessionBets: number;
}

const AllBets: React.FC<IProps> = ({ numberOfSessionBets }) => {
  const [bets, setBets] = React.useState<Bet[]>([]);

  React.useEffect(() => {
    client.getAllBets().then((bets) => setBets(bets));
  }, [numberOfSessionBets]);

  return (
    <Container>
      <Title>Last bets</Title>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Bettor</TableCell>
              <TableCell align="right">Option</TableCell>
              <TableCell align="right">Number of shot to pay</TableCell>
              <TableCell align="right">Number of shot to give if win</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bets.map((bet) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {bet.firstname} {bet.lastname} ({bet.username})
                </TableCell>
                <TableCell align="right">{bet.optionName}</TableCell>
                <TableCell align="right">{bet.numberOfShotBet} shots</TableCell>
                <TableCell align="right">
                  {Math.round(bet.numberOfShotIfWin * 10) / 10} shots
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllBets;
