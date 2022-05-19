import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Card, CardActions, CardHeader, CardContent, TextField } from '@mui/material';

import LogoutButton from '../components/LogoutButton';

const dashboardStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'row',
  backgroundColor: '#F6CFFC',
};

const createQuizStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80%',
  width: '100%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center'
}

const leftRightStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '49.5%',
  flexDirection: 'column'
};

const quizStyle = {
  width: '99%',
  border: '1px solid',
  flexDirection: 'column',
  textAlign: 'center',
  display: 'flex',
};

const quizSectionStyle = {
  border: '1px solid',
  width: '100%',
  height: '80%',
  alignItems: 'center',
  textAlign: 'center',
  overflowY: 'scroll',
  backgroundColor: 'white',
  borderRadius: '1%',
}

const modalStyle = {
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'white',
  border: 'solid',
  transform: 'translate(70%, 70%)'
}

function Dashboard () {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const token = localStorage.getItem('token');
  const [quizzes, setQuizzes] = React.useState([]);
  const [openStartQuiz, setOpenStartQuiz] = React.useState(false);
  const [openQuizResult, setOpenQuizResult] = React.useState(false);
  const [sessionId, setSessionId] = React.useState('');

  // Function which deals with deletion of quiz
  const deleteQuizHandler = async (quizid) => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    if (response !== undefined && response.status === 200) {
      alert('Quiz Deleted!');
      window.location.reload(false);
    }
  }
  // Function which get all the quiz questions
  async function getQuizQuestions (quizid) {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json();
    return data.questions;
  }
  // Function which get all the quizzes
  async function getQuizzes () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json();
    data.quizzes.forEach(async (element) => {
      const questions = await getQuizQuestions(element.id)
      const questionsNum = questions.length;
      element.questionCount = questionsNum;
    })
    return data.quizzes;
  }
  // Function which creates a new quiz
  async function createQuiz () {
    const response = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ name })
    })

    if (response !== undefined && response.status === 200) {
      alert('Quiz Created!');
      window.location.reload(false);
    }
  }
  // Function which starts a quiz session
  const startQuizHandler = async (quizid) => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid + '/start', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    if (response !== undefined && response.status === 200) {
      alert('Game Started!');
    }
  }
  // Function which advances an active quiz session when the quiz is displaying answers
  const advanceQuizHandler = async (quizid) => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    console.log(quizid)
    console.log(response);
    if (response !== undefined && response.status === 200) {
      console.log('quiz advanced')
    }
  }
  // Function which ends an active quiz session
  const endQuizHandler = async (quizid) => {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid + '/end', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    if (response !== undefined && response.status === 200) {
      alert('Quiz Ended!');
    }
  }
  // Function which gets the session ID from a started quiz
  async function getSessionId (quizid) {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json();
    console.log(data);
    setSessionId(data.active);
  }
  // Open Start Quiz Modal
  const openStartQuizHandler = () => {
    setOpenStartQuiz(true);
  };
  // Close Start Quiz Modal
  const closeStartQuizHandler = () => {
    setOpenStartQuiz(false);
  };
  // Open Quiz Result Modal
  const openQuizResultHandler = () => {
    setOpenQuizResult(true);
  };
  // Close Quiz Result Modal
  const closeQuizResultHandler = () => {
    setOpenQuizResult(false);
  };
  // Start Quiz Modal
  const startQuizBody = (quizId) => (
    <div style={modalStyle}>
      <h2>Quiz Started</h2>
      <p>Session Code:</p>
      <h1>{sessionId}</h1>
      <Button id='copy-clipboard-button' size='small' onClick={() => {
        navigator.clipboard.writeText('localhost:3000/join/' + sessionId)
      }}>Copy to clipboard
      </Button>
      <br />
      <Button id='end-quiz' variant='outlined' onClick={() => {
        endQuizHandler(quizId);
        closeStartQuizHandler();
        openQuizResultHandler();
      }}>Stop Quiz</Button><br />
      <Button id='advance-quiz' variant='outlined' onClick={() => {
        advanceQuizHandler(quizId);
      }}>Advance Quiz</Button> <br />
    </div>
  );
  // Quiz Result Modal
  const quizResultBody = () => (
    <div style={modalStyle}>
      <h2>Quiz Ended</h2>
      <p>View quiz results for session {sessionId}?</p>
      <Button id='yes-result' variant='outlined' onClick={() => navigate('/results/' + sessionId)}>
        Yes
      </Button><br />
      <Button id='no-result' variant='outlined' onClick={() => closeQuizResultHandler()}>
        No
      </Button><br />
    </div>
  );

  React.useEffect(async () => {
    const data = await getQuizzes();
    console.log(data)
    setQuizzes(data);
    console.log('useeffect', quizzes)
  }, []);

  return (<>
    <LogoutButton/>
    <div id='dashboard' style={dashboardStyle}>
      <div id='left' style={leftRightStyle}>
        <Card style={createQuizStyle}>
          <CardHeader
            title={'Create New Quiz'}
            subheader={'Create a new quiz by entering a quiz name'}
          ></CardHeader>
          <TextField name='create-quiz' label='Quiz Name' onChange={e => setName(e.target.value)}/>
          <Button type='submit' onClick={createQuiz} variant='outlined' size='small'>Create Quiz</Button>
        </Card>
      </div>
      <div id='right' style={leftRightStyle}>
        <div id='quiz-section' style={quizSectionStyle}>
          <h2>Quiz List</h2>
          {quizzes.map((quiz) => (
            <Card style={quizStyle} key={quiz.id}>
              <CardContent>
                <CardHeader
                  title={quiz.name}
                  subheader={'Quiz ID: ' + quiz.id}
                ></CardHeader>
                <img src={quiz.thumbnail} alt="quiz thumbnail" style={{ height: '23%', width: '20%' }}/>
                <p>Number of Questions: {quiz.questionCount}</p>
                <CardActions style={{ justifyContent: 'center' }}>
                  <Button id='start-quiz' onClick={ () => {
                    startQuizHandler(quiz.id);
                    openStartQuizHandler();
                    getSessionId(quiz.id);
                  }} variant='outlined' size='small' >Start Quiz</Button>
                  <Button id='edit-quiz' onClick={() => navigate('/editquiz/' + quiz.id) } variant='outlined' size='small'>
                    Edit Quiz
                  </Button>
                  <Button onClick={() => deleteQuizHandler(quiz.id) } variant='outlined' size='small'>
                    Delete Quiz
                  </Button>
                </CardActions>
              </CardContent>
              <Modal open={openStartQuiz} onClose={() => closeStartQuizHandler()}>
                {startQuizBody(quiz.id)}
              </Modal>
              <Modal open={openQuizResult} onClose={() => closeQuizResultHandler()}>
                {quizResultBody()}
              </Modal>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </>);
}

export default Dashboard;
