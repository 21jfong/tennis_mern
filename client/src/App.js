import React, { useState } from 'react';
import { Container, Alert } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './ThemeContext';
import ProtectedRoute from './components/Auth/ProtectedRoute'; // The ProtectedRoute you just created
import { AuthProvider } from './components/Auth/AuthProvider'; // AuthProvider to manage authentication

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Teams from './components/Teams/Teams';
import Team from './components/Teams/Team/Team';
import CreateTeam from './components/Teams/Team/Actions/CreateTeam';
import EditTeam from './components/Teams/Team/Actions/EditTeam';
import JoinTeam from './components/Teams/Team/Actions/JoinTeam';

import CreateMatch from './components/Matches/Match/Actions/CreateMatch';

import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/Actions/EditProfile';

import useStyles from './styles';
import Tracking from './components/Tracking/Tracking';

const App = () => {
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <BrowserRouter>
          <Container maxwidth="lg">
            <Navbar />
            <Routes>
              <Route path="/home" exact element={<Container className={classes.mainContainer}><Home /></Container>} />
              <Route path="/" exact element={<ProtectedRoute><Container className={classes.mainContainer}><Teams setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/auth" exact element={<Container className={classes.mainContainer}><Auth setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container>} />
              <Route path="/my-teams" exact element={<ProtectedRoute><Container className={classes.mainContainer}><Teams setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/my-teams/create-team" exact element={<ProtectedRoute><Container className={classes.mainContainer}><CreateTeam setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/my-teams/:id/edit-team" exact element={<ProtectedRoute><Container className={classes.mainContainer}><EditTeam setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/my-teams/join-team" exact element={<ProtectedRoute><Container className={classes.mainContainer}><JoinTeam setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/my-teams/:id" exact element={<ProtectedRoute><Container className={classes.mainContainer}><Team setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
            
              <Route path="/:id/matches/create-match" exact element={<ProtectedRoute><Container className={classes.mainContainer}><CreateMatch setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
            
              <Route path="/player/:id" exact element={<Container className={classes.mainContainer}><Profile setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container>} />
              <Route path="/player/:id/edit" exact element={<ProtectedRoute><Container className={classes.mainContainer}><EditProfile setIsAlert={setIsAlert} setAlertMessage={setAlertMessage} /></Container></ProtectedRoute>} />
              <Route path="/tracking" exact element={<ProtectedRoute><Container className={classes.mainContainer}><Tracking /></Container></ProtectedRoute>} />
            </Routes>
            {(isAlert && alertMessage) && (
              <Alert
                severity='error'
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  left: 16,
                  zIndex: 1300,
                  maxWidth: '400px', // Max width for larger screens
                }}
                onClose={() => setIsAlert(false)}
              >
                {alertMessage}
              </Alert>
            )}
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProviderWrapper>
  )
}

export default App;
