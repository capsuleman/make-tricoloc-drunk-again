import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export const Container = styled(Paper)`
  padding: 16px;
  height: 240px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled(Typography)`
  flex-grow: 1;
  font-size: 1.2rem;
  margin-bottom: 12px;
`;

export const InputContainer = styled(Box)`
  margin: 6px 0;
  &:last-of-type {
    flex-grow: 1;
  }
`;

export const FormContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export const AddBetButton = styled(Button)`
  width: 100px;
  align-self: end;
`;
