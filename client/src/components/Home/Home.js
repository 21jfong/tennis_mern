import React from 'react';
import { Container, Grid2 } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Grid2 container justifyContent="space-between" alignItems="stretch" spacing={3}>
        <Grid2 size={{ xs: 12, sm: 7 }}>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
        </Grid2>
      </Grid2>
    </Container>
  )
}

export default Home;