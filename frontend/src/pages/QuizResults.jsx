import React from 'react';

import { useParams } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import LogoutButton from '../components/LogoutButton';

const quizResultsStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  backgroundColor: '#F6CFFC'
};

const leaderboardStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40%',
  width: '30%',
  flexDirection: 'column',
  backgroundColor: 'white',
  border: '1px solid',
};

function QuizResults () {
  const token = localStorage.getItem('token');
  const { sessionid } = useParams();
  const [topPlayers, setTopPlayers] = React.useState([
    {
      name: 'N/A',
      score: 'N/A'
    },
    {
      name: 'N/A',
      score: 'N/A'
    },
    {
      name: 'N/A',
      score: 'N/A'
    },
    {
      name: 'N/A',
      score: 'N/A'
    },
    {
      name: 'N/A',
      score: 'N/A'
    },
  ]);

  async function getQuizResults () {
    const response = await fetch('http://localhost:5005/admin/session/' + sessionid + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
  }

  async function getTopPlayers (results) {
    const playerScores = [];
    const newTopPlayers = [...topPlayers];
    results.forEach((player) => {
      console.log(player);
      playerScores.push({
        name: player.name,
        score: player.answers.filter(e => e.correct === true).length
      });
    })
    console.log(playerScores);

    const playerScoresSorted = playerScores.sort(function (a, b) {
      const x = a.score; const y = b.score;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    console.log(playerScoresSorted);
    playerScoresSorted.reverse();
    let index = 0;
    playerScoresSorted.forEach((e) => {
      if (index === 5) {
        return;
      }
      newTopPlayers[index].name = e.name;
      newTopPlayers[index].score = e.score;
      index = index + 1;
    })

    setTopPlayers(newTopPlayers)
  }

  React.useEffect(async () => {
    const data = await getQuizResults();
    console.log('new', data);
    if (data !== undefined) {
      getTopPlayers(data.results)
    }
  }, []);

  return (
  <div style={quizResultsStyle}>
    <LogoutButton/>
    <div id='results-section' style={leaderboardStyle}>
      <h2>Leaderboard</h2>
      <p>session ID: {sessionid}</p>
      {Leaderboard(topPlayers)}
    </div>
  </div>
  )
}

export default QuizResults;
