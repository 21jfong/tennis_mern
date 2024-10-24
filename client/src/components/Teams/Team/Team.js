import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

import { Card, CardActions, CardContent, Grid2, Button, Typography, Paper, Container, Grow } from '@mui/material';

import { getTeam } from '../../../actions/teams';


const Team = ({ setIsAlert, setAlertMessage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();
  const team = useSelector((state) => state.teams);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeam(id)); // Await the response from dispatch
      checkForAlert(response);
    };

    fetchData(); // Call the async function
  }, [id, dispatch]);

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Grow in>
      <Container>
        <Grid2 container sx={{ gap: 20 }}>
          <Typography color="primary"><strong>Team code: </strong>{`${team?.teamCode}`}</Typography>
          <Typography color="primary"><strong>Captain: </strong>{`${team?.captain?.name}`}</Typography>
        </Grid2>
        <Paper className={classes.paper} sx={{ bgcolor: 'primary.main' }}>
          <Typography variant="h3" sx={{ padding: 2 }}>{team.name}</Typography>
          <Card className={classes.card} sx={{ minWidth: 150, bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h3">Roster</Typography>
              <hr />
              {team?.players ? team?.players.map((player, index) => (
                <Typography component="p" key={player._id}>
                  {`${index + 1}.${'\u00A0'.repeat(4)}${player.name}`}
                </Typography>
              )) : <Typography sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', textAlign: 'center' }}>Team Not Available</Typography>}
            </CardContent>
          </Card>

          <Card className={classes.card} sx={{ bgcolor: 'primary.lighter' }}>
            <CardContent>
              <Typography variant="h3" sx={{ padding: 2 }}>Recent Matches</Typography>
              <hr />
              <Typography>No Matches Yet</Typography>
            </CardContent>
          </Card>
        </Paper>
      </Container>
    </Grow>
  )
}

export default Team
