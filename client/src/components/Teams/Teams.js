import React, { useEffect, useState } from 'react'
import useStyles from './styles'
import { Button, Container, Grid2, Link, Typography, Grow, Card, Paper, Box, CardContent } from '@mui/material'
import { Link as React_Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PendingIcon from '@mui/icons-material/Pending';

import { getTeams } from '../../actions/teams';

const Teams = ({ setIsAlert, setAlertMessage }) => {
  const classes = useStyles();
  const teams = useSelector((state) => state.teams);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = localStorage.getItem('profile');

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeams(user));
      setLoading(false);
      checkForAlert(response);
    };

    fetchData();
  }, [])

  const handleCreateTeam = () => {
    navigate('/my-teams/create-team');
  };

  const handleJoinTeam = () => {
    navigate('/my-teams/join-team');
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Grow in>
      <Grid2 container spacing={3}>
        <Grid2 container>
          <Button variant="contained" color="primary" onClick={handleCreateTeam}>Create Team</Button>
          <Button variant="contained" color="primary" onClick={handleJoinTeam}>Join Team</Button>
        </Grid2>
        <Grow in>
          <Container className={classes.mainContainer}>
            <Paper sx={{ bgcolor: "primary.main", padding: { xs: 3, md: 5 }, width: "100%" }}>
              <Typography variant='h3' sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>My Teams</Typography>
              <Box>
                {loading ? null : (
                  teams.length > 0 ? (
                    teams.map((team) => (
                      <Grow in key={team._id}>
                        <Card sx={{ bgcolor: 'primary.lighter', padding: 2, margin: 3 }} className={classes.card}>
                          <Grid2 container justifyContent="space-between" alignItems="center" sx={{ gap: 2 }}>
                            <Grid2>
                              <Link color="secondary" href={`my-teams/${team._id}`} sx={{ zIndex: 1 }}>
                                <Typography sx={{ display: { xs: 'none', md: 'flex' } }}>{`${team.name} - Captain: ${team.captain.name}`}</Typography>
                                <Typography sx={{ display: { xs: 'flex', md: 'none' } }}>{`${team.name}`}</Typography>
                              </Link>
                            </Grid2>

                            <Grid2>
                              <Button
                                component={React_Link}
                                to={`${team._id}`}
                                sx={{
                                  minWidth: { xs: '32px', md: '64px' },
                                  height: { xs: '32px', md: '32px' },
                                  padding: { xs: '4px 6px', md: '8px 16px' },
                                }}>
                                <ArrowForwardIosIcon color="secondary" />
                              </Button>
                            </Grid2>
                          </Grid2>
                        </Card>
                      </Grow>
                    ))
                  ) : (
                    <Typography sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>No Teams Available</Typography>
                  )
                )}
              </Box>
            </Paper>
          </Container>
        </Grow>
      </Grid2>
    </Grow>
  )
}

export default Teams
