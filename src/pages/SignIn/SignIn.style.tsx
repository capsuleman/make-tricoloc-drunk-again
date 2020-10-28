import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { colors } from 'src/theme';

export const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64px;
`;

export const StyledAvatar = styled(Avatar)`
  margin: 8px;
  background-color: ${colors.red};
`;

export const Form = styled.form`
  width: 100%;
  margin-top: 8px;
`;

export const SubmitButton = styled(Button)`
  margin: 24px 0 16px;
`;

export const StyledLink = styled(Link)`
  cursor: pointer;
`;
