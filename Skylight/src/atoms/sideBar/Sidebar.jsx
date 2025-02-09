import React from 'react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from "@emotion/react";
import { MdOutlineDashboard } from "react-icons/md";
import { IoNavigateOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { BiSolidNetworkChart } from "react-icons/bi";
import { LiaRouteSolid } from "react-icons/lia";
import { RiUserSettingsLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";

import Table2 from "../Table/Table2";

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const [showSessions, setShowSessions] = useState(false);

  const activeStyle = {
    backgroundColor: 'darkgray',
    borderRadius: '8px',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
      height: '100vh',
      width: "50px", // Adjust width as needed
      background: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      position: 'relative', 
    }}>
      <ul style={{ listStyleType: "none", padding: 0, cursor: "pointer", fontSize: '24px' }}>
        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/"
            style={{
              color: location.pathname === '/' ? theme.palette.secondary.main : 'darkgray',
              textDecoration: 'none'
            }}
            activeStyle={activeStyle}
            exact
          >
            <MdOutlineDashboard className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/sessionlist"
            onClick={() => setShowSessions(!showSessions)}
            style={{
              color: location.pathname.includes('/sessionlist') ? theme.palette.secondary.main : 'darkgray',
              textDecoration: 'none'
            }}
            activeStyle={activeStyle}
          >
            <IoNavigateOutline className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/failed"
            style={{ color: location.pathname === '/failed' ? theme.palette.secondary.main : 'darkgray', textDecoration: 'none' }}
            activeStyle={activeStyle}
          >
            <HiOutlineDocumentText className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/generate-report"
            style={{ color: location.pathname === '/generate-report' ? theme.palette.secondary.main : 'darkgray', textDecoration: 'none' }}
            activeStyle={activeStyle}
          >
            <BiSolidNetworkChart className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/networks"
            style={{
              color: location.pathname === '/networks' ? theme.palette.secondary.main : 'darkgray',
              textDecoration: 'none'
            }}
            activeStyle={activeStyle}
          >
            <LiaRouteSolid className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/profile"
            style={{ color: location.pathname === '/profile' ? theme.palette.secondary.main : 'darkgray', textDecoration: 'none' }}
            activeStyle={activeStyle}
          >
            <RiUserSettingsLine className="icon" />
          </NavLink>
        </li>

        <li style={{ margin: '18px', transition: 'transform 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavLink
            to="/settings"
            style={{ color: location.pathname === '/settings' ? theme.palette.secondary.main : 'darkgray', textDecoration: 'none' }}
            activeStyle={activeStyle}
          >
            <CiSettings className="icon" />
          </NavLink>
        </li>
        
      </ul>  
    </div>
  );
};

export default Sidebar;
