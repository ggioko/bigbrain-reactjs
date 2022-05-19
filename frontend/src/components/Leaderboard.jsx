import React from 'react';

function Leaderboard (topPlayers) {
  console.log(topPlayers);
  return (
    <div>
      <table>
        <thead>
          <th>Position</th>
          <th>Name</th>
          <th>Score</th>
        </thead>
        <tr>
          <td>First</td>
          <td>{topPlayers[0].name}</td>
          <td>{topPlayers[0].score}</td>
        </tr>
        <tr>
          <td>Second</td>
          <td>{topPlayers[1].name}</td>
          <td>{topPlayers[1].score}</td>
        </tr>
        <tr>
          <td>Third</td>
          <td>{topPlayers[2].name}</td>
          <td>{topPlayers[2].score}</td>
        </tr>
        <tr>
          <td>Fourth</td>
          <td>{topPlayers[3].name}</td>
          <td>{topPlayers[3].score}</td>
        </tr>
        <tr>
          <td>Fifth</td>
          <td>{topPlayers[4].name}</td>
          <td>{topPlayers[4].score}</td>
        </tr>
      </table>
    </div>
  )
}

export default Leaderboard;
