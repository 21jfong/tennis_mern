import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './ThemeContext';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Teams from './components/Teams/Teams';
import CreateTeam from './components/Teams/Team/CreateTeam';

import { MainContent } from './styles';

const App = () => (
  <ThemeProviderWrapper>
    <BrowserRouter>
      <Container maxwidth="lg">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<MainContent><Home /></MainContent>} />
          <Route path="/auth" exact element={<MainContent><Auth /></MainContent>} />
          <Route path="/my-teams" exact element={<MainContent><Teams /></MainContent>} />
          <Route path="/my-teams/create-team" exact element={<MainContent><CreateTeam /></MainContent>} />
        </Routes>
      </Container>
    </BrowserRouter>
  </ThemeProviderWrapper>
)

export default App;