import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';

const loginFormStyle = {
  textAlign: 'center',
  flexDirection: 'column',
  display: 'flex',
  border: '1px solid',
  height: '50%',
  width: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  fontSize: '80%'
}

function LoginForm ({ submit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSubmit = () => {
    submit(email, password)
  }

  return (<>
    <div id='login-form' style={loginFormStyle}>
      <h1>Login</h1>
      <TextField
        name='email'
        label='Email'
        onChange={e => setEmail(e.target.value)}
      /><br />
      <TextField
        name='password'
        label='Password'
        onChange={e => setPassword(e.target.value)}
      /><br />

      <Button type='submit' variant="contained" onClick={onSubmit}>
        Login
      </Button>
      <br />
    </div>
  </>)
}

LoginForm.propTypes = {
  submit: PropTypes.func
}

export default LoginForm;
