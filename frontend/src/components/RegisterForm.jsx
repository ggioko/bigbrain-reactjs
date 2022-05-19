import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';

const registerFormStyle = {
  textAlign: 'center',
  flexDirection: 'column',
  display: 'flex',
  border: '1px solid',
  height: '60%',
  width: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white'
}

function RegisterForm ({ submit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  const onSubmit = () => {
    if (email === '') {
      alert('Email is missing');
    } else if (password === '') {
      alert('Password is missing');
    } else if (name === '') {
      alert('Name is missing');
    } else {
      submit(email, password, name)
    }
  }

  return (<>
    <div id='register-form' style={registerFormStyle}>
      <h1>Register</h1>
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
      <TextField
        name='name'
        label='Name'
        onChange={e => setName(e.target.value)}
      /><br />

      <Button type='submit' variant='contained' onClick={onSubmit}>
        Register
      </Button>
    </div>
  </>)
}

RegisterForm.propTypes = {
  submit: PropTypes.func
}

export default RegisterForm;
