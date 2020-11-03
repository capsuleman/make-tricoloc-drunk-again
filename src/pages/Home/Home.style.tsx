import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export const BarSpacer = styled.div`
  min-height: 64px;
`;

export const StyledContainer = styled(Container)`
  padding: 32px;
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  overflow: auto;
  flex-direction: column;
`;

export const FixedHeightdPaper = styled(StyledPaper)`
  height: 300px;
`;
