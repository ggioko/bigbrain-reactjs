import { TextField, Button } from '@mui/material';
import React from 'react';

import { useParams, useNavigate } from 'react-router-dom';

const joinQuizStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  backgroundColor: '#F6CFFC'
};

function JoinQuiz () {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { sessionid } = useParams();
  const [sessionId, setSessionId] = React.useState(sessionid);
  const [playerName, setPlayerName] = React.useState('');

  async function joinQuiz (sessionId, playerName) {
    if (sessionId === '') {
      alert('Please enter a session ID');
      return;
    } else if (playerName === '') {
      alert('Please enter a name');
      return;
    }

    const response = await fetch('http://localhost:5005/play/join/' + sessionId, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ name: playerName })
    })
    console.log(response);
    if (response.status === 200) {
      alert('Joining quiz');
      const data = await response.json();
      console.log(data);
      navigate('/play/' + data.playerId);
    } else {
      alert('Quiz with given session ID does not exist')
    }
  }

  return (
  <div style={joinQuizStyle}>
    <h2>Join Quiz</h2>
    <TextField label="Session ID" onChange={e => setSessionId(e.target.value)} value={sessionId} /><br /><br />
    <TextField label="Name" onChange={e => setPlayerName(e.target.value)} value={playerName} /><br /><br />
    <Button variant="contained" onClick={() => joinQuiz(sessionId, playerName)}>Join Game</Button>
  </div>
  )
}

export default JoinQuiz;
