import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "@react-oauth/google";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";

import racket_icon from "../../images/racket_icon.png";

import { getPlayer } from "../../actions/player";

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const player = useSelector((state) => state.player);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    googleLogout();
    navigate("/");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }
    const fetchData = async () => {
      await dispatch(getPlayer(user?.result?._id));
    };

    fetchData();

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  // UI handlers
  const handleOpenNavMenu = (e) => setAnchorElNav(e.currentTarget);
  const handleOpenUserMenu = (e) => setAnchorElUser(e.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={racket_icon}
            alt="logo"
            sx={{ marginLeft: "15px", width: "50px", height: "auto" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Tennis Track
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                to="/my-teams"
              >
                <Typography textAlign="center">My Teams</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                to="/search"
              >
                <Typography textAlign="center">Search Players</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                to={user?.result?._id ? `/player/${user.result._id}` : "/"}
              >
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Track
          </Typography>

          {/* Desktop menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: "10px",
            }}
          >
            <Button component={Link} to="/my-teams" sx={{ color: "white" }}>
              My Teams
            </Button>
            <Button component={Link} to="/search" sx={{ color: "white" }}>
              Search Players
            </Button>
            <Button
              component={Link}
              to={user?.result?._id ? `/player/${user.result._id}` : "/"}
              sx={{ color: "white" }}
            >
              Profile
            </Button>
          </Box>

          {/* User name and avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user && (
              <Typography
                variant="h6"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {user.result.name}
              </Typography>
            )}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Avatar"
                    src={player?.imageURL || user?.result?.imageUrl}
                  >
                    {user?.result?.name.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {user?.result?._id && (
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to={`/player/${user.result._id}`}
                  >
                    <Typography textAlign="center">Account Settings</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleCloseUserMenu}>
                  {user ? (
                    <Typography onClick={logout} textAlign="center">
                      Log out
                    </Typography>
                  ) : (
                    <Typography component={Link} to="/auth" textAlign="center">
                      Sign in
                    </Typography>
                  )}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
