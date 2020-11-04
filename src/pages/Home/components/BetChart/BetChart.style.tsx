import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export const Title = styled(Typography)`
  font-size: 1.2rem;
  margin-bottom: 12px;
`;

export const Container = styled(Paper)`
  padding: 16px;
  height: 300px;
  display: flex;
  flex-direction: column;
`;
