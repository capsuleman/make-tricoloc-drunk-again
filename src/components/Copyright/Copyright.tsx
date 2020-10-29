import React from 'react';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {' Copyright © '}
    <Link color="inherit" href="https://gifree.cs-campus.fr/" target="_blank">
      MiloLePlusBeau
    </Link>
    {` ${new Date().getFullYear()}.`}
  </Typography>
);

export default Copyright;
