import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListIcon from '@mui/icons-material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import '../assets/styles/Navigation.scss';

const drawerWidth = 240;
const navItems = [
  ['Expertise', 'expertise'],
  ['History', 'history'],
  ['Projects', 'projects'],
  ['Contact', 'contact'],
];
const RESUME_URL = "https://drive.google.com/file/d/1TKDmjTvnT6v5Tk6BVFpwcqPruIkYPq0i/view?usp=sharing";
const GMAIL_TO = "chetan.chandane2026@gmail.com";
const GMAIL_SUBJECT = "Introduction — Let's connect";
const GMAIL_BODY = "Hi Chetan,\n\nI came across your portfolio and would like to connect.";
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(GMAIL_TO)}&subject=${encodeURIComponent(GMAIL_SUBJECT)}&body=${encodeURIComponent(GMAIL_BODY)}`;

function Navigation({ onAskChetan }: { onAskChetan: () => void }) {

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box className="navigation-bar-responsive" onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <p className="mobile-menu-top"><ListIcon/>Menu</p>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item[0]} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => scrollToSection(item[1])}>
              <ListItemText primary={item[0]} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: 'center' }} onClick={() => { setMobileOpen(false); onAskChetan(); }}>
            <ListItemText primary="Ask Chetan" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Resume" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href={GMAIL_COMPOSE_URL}
            target="_blank"
            rel="noreferrer"
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary="Email" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" id="navigation" className={`aurum-nav${scrolled ? ' scrolled' : ''}`} elevation={0}>
        <Toolbar className='navigation-bar'>
          <a className="nav-brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Chetan<span>.</span>
          </a>

          <IconButton
            className="nav-burger"
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box className="nav-links" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {navItems.map((item) => (
              <Button key={item[0]} className="nav-link" onClick={() => scrollToSection(item[1])}>
                {item[0]}
              </Button>
            ))}
            <Button className="nav-link" href={RESUME_URL} target="_blank" rel="noreferrer">
              Resume
            </Button>
            <Button className="nav-ask" onClick={onAskChetan}>
              ✦ Ask Chetan
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#14181e' },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Navigation;
