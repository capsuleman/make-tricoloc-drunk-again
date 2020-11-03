import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

export const Container = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled(Typography)`
  flex-grow: 1;
  font-size: 1.2rem;
  margin-bottom: 12px;
`;
