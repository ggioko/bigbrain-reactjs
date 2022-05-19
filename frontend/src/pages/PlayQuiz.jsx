import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';

const playQuizStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  backgroundColor: '#F6CFFC'
};

const quizEndStyle = {
  textAlign: 'center',
  alignItems: 'center',
  height: '50%',
  width: '20%',
  overflowY: 'scroll'
}

const quizQuestionStyle = {
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40%',
  width: '30%',
}

const quizAnswerStyle = {
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  height: '50%',
  width: '20%',
}

function PlayQuiz () {
  const token = localStorage.getItem('token');
  const { playerid } = useParams();
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [quizAnswer, setQuizAnswer] = React.useState(false);
  const [quizQuestion, setQuizQuestion] = React.useState(false);
  const [quizEnd, setQuizEnd] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(-1);
  const [currentQuestion, setCurrentQuestion] = React.useState('');
  const [selectedAnswers, setSelectedAnswers] = React.useState([]);
  const [correctAnswers, setCorrectAnswers] = React.useState([]);
  const [playerResults, setPlayerResults] = React.useState([]);
  const [answerSelected, setAnswerSelected] = React.useState([]);

  // Gets the status of the quiz in session from the server
  async function getQuizStatus () {
    const response = await fetch('http://localhost:5005/play/' + playerid + '/status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    if (response !== undefined && response.status === 200) {
      const data = await response.json();
      console.log(data);
      if (data.started) {
        setQuizStarted(true);
        setQuizQuestion(true);
      }
    } else if (response !== undefined && response.status === 400) {
      setQuizEnd(true);
    }
  }
  // Updates the time remaing for the question
  const updateTimeLimit = (currentTimeLimit) => {
    currentTimeLimit = currentTimeLimit - 1;
    console.log(currentTimeLimit);
    return currentTimeLimit;
  }
  // Function which gets current question of the current session from the server
  async function getQuizCurrentQuestion () {
    const response = await fetch('http://localhost:5005/play/' + playerid + '/question', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    console.log(response);
    if (response !== undefined && response.status === 200) {
      const data = await response.json();
      console.log(data);
      console.log(currentQuestion.id, data.question.id)
      const question = data.question;
      if (currentQuestion.id !== question.id) {
        console.log('here')
        setQuizQuestion(true);
        setQuizAnswer(false);
        setSelectedAnswers([]);
        setAnswerSelected(new Array(question.answers.length).fill(false));
        setTimeRemaining(data.question.timelimit);
      }
      setCurrentQuestion(data.question);
      console.log(currentQuestion)
    } else {
      console.log(2);
      setQuizAnswer(false);
      setQuizEnd(true);
    }
  }
  // Function which gets answers of the current question from the server
  async function getQuizCurrentAnswers () {
    const response = await fetch('http://localhost:5005/play/' + playerid + '/answer', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    console.log(response);
    if (response !== undefined && response.status === 200) {
      const data = await response.json();
      console.log('correct answers', data);
      const currentCorrectAnswers = [];
      currentQuestion.answers.forEach(answer => {
        if (data.answerIds.includes(answer.id)) {
          const ans = {
            id: answer.id,
            name: answer.name
          }
          currentCorrectAnswers.push(ans);
        }
      });
      setCorrectAnswers(currentCorrectAnswers);
      console.log(correctAnswers);
    }
  }
  // Function which gets the quiz results from the server
  async function getQuizResults () {
    const response = await fetch('http://localhost:5005/play/' + playerid + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      }
    })
    console.log(response);
    if (response !== undefined && response.status === 200) {
      const data = await response.json();
      console.log(data);
      const results = [];
      data.forEach(result => {
        if (result.correct === true) {
          results.push('Correct');
        } else {
          results.push('Incorrect');
        }
      });
      setPlayerResults(results);
    }
  }

  // Function which is triggered when a answer is selected in play game
  // Adds answers to selectedAnswers and makes sends answers to server
  async function selectAnswerHandler (answer) {
    const newAnswerSelected = [...answerSelected];
    let index = 0;
    // Changing the answer selected as true,
    // so that the button knows to change color when selected
    currentQuestion.answers.forEach((ans) => {
      if (currentQuestion.type === 'Single Choice') {
        newAnswerSelected[index] = false;
      }
      if (ans.id === answer.id) {
        newAnswerSelected[index] = true;
        setAnswerSelected(newAnswerSelected);
      }
      index = index + 1;
    })
    let submitAnswerIds = [];
    if (currentQuestion.type === 'Multiple Choice') {
      // If the answer does not exist in selectedAnswers we add it in.
      if (!(selectedAnswers.includes(answer))) {
        selectedAnswers.forEach(a => {
          submitAnswerIds.push(a.id);
        });
        submitAnswerIds.push(answer.id);
        setSelectedAnswers([...selectedAnswers, answer]);
      } else {
        const index = selectedAnswers.indexOf(answer);
        if (index > -1) {
          selectedAnswers.splice(index, 1);
          submitAnswerIds = [...selectedAnswers];
        }
      }
      const response = await fetch('http://localhost:5005/play/' + playerid + '/answer', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ answerIds: submitAnswerIds })
      })

      if (response.status === 200) {
        console.log(response);
      }
    } else {
      const response = await fetch('http://localhost:5005/play/' + playerid + '/answer', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ answerIds: [answer.id] })
      })

      console.log(response);
      if (response.status === 200) {
        setSelectedAnswers([answer]);
      }
    }
  }
  // Check whether the quiz has started
  React.useEffect(() => {
    let int = 0;
    if (quizStarted === false) {
      int = setInterval(() => {
        getQuizStatus(playerid);
      }, 1000)
    }
    return () => clearInterval(int)
  });
  // Get quiz current question
  // depending on the states
  React.useEffect(() => {
    if (quizQuestion === true) {
      console.log('Question State');
      getQuizCurrentQuestion();
    }
  }, [quizQuestion]);
  // Get quiz current answer
  // depending on the states
  React.useEffect(() => {
    if (quizAnswer === true) {
      console.log('Answer State');
      console.log(selectedAnswers, correctAnswers)
      setAnswerSelected([]);
      getQuizCurrentAnswers();
    }
  }, [quizAnswer]);
  // Get quiz results
  // depending on the state
  React.useEffect(() => {
    if (quizEnd === true) {
      console.log('Results State');
      getQuizResults();
    }
  }, [quizEnd]);
  // Update the time every second
  React.useEffect(() => {
    if (quizQuestion === true) {
      if (timeRemaining > 0) {
        setTimeout(() => {
          setTimeRemaining(updateTimeLimit(timeRemaining));
        }, 1000);
      }
      if (timeRemaining === 0) {
        setQuizQuestion(false);
        setQuizAnswer(true);
      }
    }
  });

  // Check if host has advanced quiz
  React.useEffect(() => {
    const int = setInterval(() => {
      if (quizQuestion === true || quizAnswer === true) {
        console.log('Host advance, next question');
        getQuizCurrentQuestion();
      }
    }, 1000);
    return () => clearInterval(int)
  });

  return (
  <div id='play-quiz' style={playQuizStyle}>
    {(quizStarted === false) && (quizEnd === false) &&
      <h2>Waiting for host to start Quiz</h2>
    }
    {(currentQuestion !== '') && (quizQuestion === true) && (quizEnd === false) &&
      <Card id='play-quiz-question' style={quizQuestionStyle}>
        <CardContent>
          <CardHeader
            title={currentQuestion.name}
            subheader={currentQuestion.type}
          ></CardHeader>
          <img src={currentQuestion.thumbnail} alt="question thumbnail" style={{ height: '23%', width: '20%' }}/>
          <p>Time Remaining: {timeRemaining}</p>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          {currentQuestion.answers.map((answer, index) => (
            <Button key={answer.id}
              color={answerSelected[index] ? 'primary' : 'secondary'}
              size="small"
              variant="contained"
              onClick={() => selectAnswerHandler(answer, currentQuestion.type)}
              >
              {answer.name}
            </Button>
          ))}
        </CardActions>
      </Card>
    }
    {(quizAnswer === true) && (quizEnd === false) &&
      <Card id='play-quiz-answer' style={quizAnswerStyle}>
        <CardContent>
          <CardHeader
            title={'Question Results'}
          ></CardHeader>
          <p>Correct Answers:</p>
          {correctAnswers.map((answer) => (
            <p key={answer.id}>{answer.name}</p>
          ))}
          <p>Your Answers:</p>
          {selectedAnswers.map(answer => (
            <p key={answer.id}>{answer.name}</p>
          ))}
        </CardContent>
      </Card>
    }
    {(quizEnd === true) &&
      <Card id='play-quiz-end' style={quizEndStyle}>
        <CardContent>
          <CardHeader
            title='Quiz End'
            subheader='Host has ended the quiz'
          ></CardHeader>
          <p>Quiz Results:</p>
          {playerResults.map((result, index) => (
            <div key={index}>
              <p style= {{ color: result === 'Correct' ? 'green' : 'red' }}>Question {index + 1}: {result}</p>
            </div>
          ))}
          <p>Score: {playerResults.filter(q => q === 'Correct').length} Out of {playerResults.length} </p>
        </CardContent>
      </Card>
    }
  </div>
  )
}

export default PlayQuiz;
