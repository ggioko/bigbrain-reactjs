import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import RegisterForm from '../components/RegisterForm';

const registerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  fontWeight: 'bold',
  backgroundColor: '#F6CFFC'
}

function Register () {
  const navigate = useNavigate();

  return (<>
    <div id='register-section' style={registerStyle}>
      <RegisterForm submit={async (email, password, name) => {
        const response = await fetch('http://localhost:5005/admin/auth/register', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
          })
        });
        if (response.status === 200) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else if (response.status === 400) {
          alert('Email is already registered')
        }
      }} />
      <div id='no-account'>
        <p>Have have an account already? <Link to='/'>Sign In</Link></p>
      </div>
    </div>
  </>);
}

export default Register;
