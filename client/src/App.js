import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProviderWrapper } from './ThemeContext';
import ProtectedRoute from './components/Auth/ProtectedRoute'; // The ProtectedRoute you just created
import { AuthProvider } from './components/Auth/AuthProvider'; // AuthProvider to manage authentication

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Teams from './components/Teams/Teams';
import CreateTeam from './components/Teams/Team/CreateTeam';
import JoinTeam from './components/Teams/Team/JoinTeam';

import { MainContent } from './styles';

const App = () => (
  <ThemeProviderWrapper>
    <AuthProvider>
      <BrowserRouter>
        <Container maxwidth="lg">
          <Navbar />
          <Routes>
            <Route path="/" exact element={<MainContent><Home /></MainContent>} />
            <Route path="/auth" exact element={<MainContent><Auth /></MainContent>} />
            <Route path="/my-teams" exact element={<ProtectedRoute><MainContent><Teams /></MainContent></ProtectedRoute>} />
            <Route path="/my-teams/create-team" exact element={<ProtectedRoute><MainContent><CreateTeam /></MainContent></ProtectedRoute>} />
            <Route path="/my-teams/join-team" exact element={<ProtectedRoute><MainContent><JoinTeam /></MainContent></ProtectedRoute>} />v
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProviderWrapper>
)

export default App;