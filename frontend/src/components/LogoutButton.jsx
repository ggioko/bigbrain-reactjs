import React from 'react';
import { useNavigate } from 'react-router-dom';

const navBarStyle = {
  position: 'fixed',
  top: '0px',
  display: 'flex',
  flexDirection: 'row',
  height: '10%',
  width: '100%',
  backgroundColor: '#F6CFFC'
}

const logoStyle = {
  paddingLeft: '2%',
  width: '20%',
  color: 'purple',
  fontFamily: 'Brush Script MT, cursive',
}

const navBarItemStyle = {
  paddingTop: '1%',
  width: '85%',
  paddingRight: '5%',
  textAlign: 'right',
}

function LogoutButton () {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const submitLogout = async () => {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({})
    });

    if (response.status === 200) {
      localStorage.setItem('token', null);
      navigate('/');
    }
  }
  return (<>
    <div className='nav' style={navBarStyle}>
      <h1 id='logo' onClick={() => navigate('/dashboard')} style={logoStyle}>BigBrain</h1>
      <h2 id='logout' onClick={submitLogout} style={navBarItemStyle}>Logout</h2>
    </div>
  </>)
}

export default LogoutButton;
