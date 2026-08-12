import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger menu icon for mobile view
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb'; // Placeholder logo icon
import { Link } from 'react-router-dom';  // Import Link from React Router
import logo from '../assets/logo.svg'; // Adjust path if needed

//REFERENCED FROM HERE:https://mui.com/material-ui/react-app-bar/

// List of navigation menu items
const pages = [
  { name: 'Home', path: '/' },
  { name: 'History', path: '/history' },
  //{ name: 'Settings', path: '/settings' }
];

function NavBar() {
  // State to manage the mobile navigation menu
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  // Function to open the mobile navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Function to close the mobile navigation menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#002854' }}> 
      {/* {THIS CONTROLS COLOR OF THE APPBAR (NAVIGATION BAR)} */}
      <Container maxWidth="xl">
        <Toolbar disableGutters> {/* Toolbar to organize content inside the AppBar */}

          {/* Desktop View - Logo and Icon (Visible only on medium and larger screens) */}
          <img 
  src={logo} 
  alt="Air Quality Tracker Logo" 
  style={{
    display: "flex", // Ensure it's visible
    height: "40px", // Adjust size
    marginRight: "10px"
  }} 
/>
          {/* {THIS CONTROLS COLOR OF LOGO ICON} */}

          <Typography
            variant="h6"
            noWrap
            //component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' }, // Hidden on small screens
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white', // {THIS CONTROLS COLOR OF NAVBAR TITLE TEXT}
              textDecoration: 'none',
            }}
          >
            Air Quality Tracker
          </Typography>



          {/* Mobile View - Logo (Visible only on small screens) */}
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white' }} />  */}
          {/* {THIS CONTROLS COLOR OF LOGO ICON IN MOBILE VIEW} */}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' }, // Hidden on medium and larger screens
              flexGrow: 1,
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white', // {THIS CONTROLS COLOR OF NAVBAR TITLE TEXT IN MOBILE VIEW}
              textDecoration: 'none',
            }}
          >
            Air Quality Tracker
          </Typography>

          {/* Mobile View - Hamburger Menu (Only visible on small screens) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: 'white' }} 
              // {THIS CONTROLS COLOR OF HAMBURGER MENU ICON} 
            >
              <MenuIcon />
            </IconButton>
            
            {/* Mobile Navigation Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ 
                display: { xs: 'block', md: 'none' }, 
                "& .MuiPaper-root": { backgroundColor: "#333" } // {THIS CONTROLS COLOR OF DROPDOWN MENU}
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center', color: '#1976d2' }}>
                  <Link to={page.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {page.name} {/* {THIS CONTROLS COLOR OF MOBILE MENU ITEMS} */}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* Desktop View - Navigation Buttons (Hidden on small screens) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }} 
                //  THIS CONTROLS COLOR OF NAVIGATION BUTTONS IN DESKTOP VIEW 
              >
                {page.name}
              </Button>
            ))}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
