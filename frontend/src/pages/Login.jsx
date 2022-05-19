import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import LoginForm from '../components/LoginForm';

const loginStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  fontWeight: 'bold',
  backgroundColor: '#F6CFFC'
}

function Login () {
  const navigate = useNavigate();

  return (<>
    <div id='login-section' style={loginStyle}>
      <LoginForm submit={async (email, password) => {
        const response = await fetch('http://localhost:5005/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          })
        });
        console.log(response.status)
        if (response.status === 200) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          navigate('/dashboard')
        } else if (response.status === 400) {
          alert('Invalid Password or Email');
        }
      }} />
      <div id='no-account'>
        <p>Dont have an account? <Link to='/register'>Sign Up</Link></p>
      </div>
    </div>
    </>);
}

export default Login;
