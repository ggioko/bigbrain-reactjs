import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardActions, CardHeader, CardContent, TextField, Input } from '@mui/material';

import LogoutButton from '../components/LogoutButton';
import fileToDataUrl from '../components/fileToDataUrl';

const editQuestionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'row',
  backgroundColor: '#F6CFFC',
};

const leftDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40%',
  width: '100%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center'
}

const middleDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80%',
  width: '100%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center'
}

const answersStyle = {
  alignItems: 'center',
  height: '80%',
  width: '100%',
  border: '1px solid',
  textAlign: 'center',
  overflowY: 'scroll',
  backgroundColor: 'white'
}

const answerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '35%',
  width: '99%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center',
}

const leftRightStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '33%',
  flexDirection: 'column'
};

function EditQuestion () {
  const token = localStorage.getItem('token');
  const { quizid, questionid } = useParams();
  const [question, setQuestion] = React.useState({
    questions: [],
    id: '',
    name: '',
    thumbnail: '',
    timelimit: '',
    type: '',
    points: '',
    answers: []
  });
  const [questionName, setQuestionName] = React.useState('')
  const [questionThumbnail, setQuestionThumbnail] = React.useState('')
  const [questionTimelimit, setQuestionTimelimit] = React.useState('')
  const [questionPoints, setQuestionPoints] = React.useState('')
  const [answerName, setAnswerName] = React.useState('')
  const [answerCorrect, setAnswerCorrect] = React.useState('true')

  const imageHandler = async (image) => {
    console.log(image);
    fileToDataUrl(image)
      .then(data => {
        console.log(data)
        setQuestionThumbnail(data);
      })
  };

  const addAnswerHandler = async () => {
    if (question.answers.length === 6) {
      alert('Maximum of 6 answers');
    } else {
      let type = 'Single Choice'
      const newAnswers = question.answers;
      const newAnswerNum = question.answers.length + 1
      const newAnswerId = question.id + 'a' + newAnswerNum;
      const newAnswer = {
        id: newAnswerId,
        name: answerName,
        correct: answerCorrect
      }
      newAnswers.push(newAnswer);
      const correctAnswers = newAnswers.filter(element => element.correct === 'true').length;
      if (correctAnswers > 1) {
        type = 'Multiple Choice'
      }
      console.log(question);
      const editedQuestion = {
        id: question.id,
        thumbnail: question.thumbnail,
        name: question.name,
        answers: newAnswers,
        timelimit: question.timelimit,
        points: question.points,
        type: type
      }
      console.log('question with new answer', editedQuestion)
      editQuestions(editedQuestion);
    }
  }

  const deleteAnswerHandler = async (answerid) => {
    let type = 'Single Choice'
    const newAnswers = question.answers.filter(element => element.id !== answerid)
    const correctAnswers = newAnswers.filter(element => element.correct === 'true').length;
    if (correctAnswers > 1) {
      type = 'Multiple Choice'
    }
    let id = 1
    newAnswers.forEach((answer) => {
      answer.id = question + 'a' + id;
      id = id + 1;
    })
    const editedQuestion = {
      id: question.id,
      thumbnail: question.thumbnail,
      name: question.name,
      answers: newAnswers,
      timelimit: question.timelimit,
      points: question.points,
      type: type
    }
    console.log('question with deleted answer', editedQuestion)
    editQuestions(editedQuestion);
  }

  const editQuestionHandler = async () => {
    let name = question.name;
    let thumbnail = question.thumbnail;
    let timelimit = question.timelimit;
    let points = question.points;

    if (questionName !== '') { name = questionName }
    if (questionPoints !== '') { points = questionPoints }
    if (questionTimelimit !== '') { timelimit = questionTimelimit }
    if (questionThumbnail !== '') { thumbnail = questionThumbnail }

    const editedQuestion = {
      id: question.id,
      thumbnail: thumbnail,
      name: name,
      answers: question.answers,
      timelimit: timelimit,
      points: points,
      type: question.type
    }

    editQuestions(editedQuestion);
  }

  async function getQuizDetails () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json();
    console.log(data)
    return data;
  }

  async function editQuestions (newBody) {
    const newQuestions = question.questions.filter(element => element.id !== parseInt(questionid, 10));
    newQuestions.push(newBody);
    console.log('question is edited', newQuestions)
    editQuizDetails({ questions: newQuestions });
  }

  async function editQuizDetails (newBody) {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(newBody)
    })
    console.log(newBody);
    if (response !== undefined && response.status === 200) {
      alert('successfully edited question');
      window.location.reload(false);
    }
  }

  React.useEffect(async () => {
    const data = await getQuizDetails();
    console.log(data);
    data.questions.forEach(e => {
      console.log(e.id, questionid);
      if (e.id === parseInt(questionid, 10)) {
        console.log('entered loop for setting question')
        console.log(data.questions, e.id, e.name, e.thumbnail, e.timelimit, e.points, e.type, e.answers)
        const newQ = {
          questions: data.questions,
          id: e.id,
          name: e.name,
          thumbnail: e.thumbnail,
          timelimit: e.timelimit,
          type: e.type,
          points: e.points,
          answers: e.answers
        }
        console.log(newQ);
        setQuestion(newQ);
      }
    })
    console.log('rendered question details!', question)
  }, []);

  return (
  <div style={editQuestionStyle}>
    <LogoutButton/>
    <div id='left' style={leftRightStyle}>
      <Card style={leftDivStyle}>
        <CardHeader
          title={question.name}
        ></CardHeader>
        <img src={question.thumbnail} alt="Question Thumbnail" style={{ height: '23%', width: '14%' }}/>
        <p>Question Time Limit: {question.timelimit}</p>
        <p>Question Type: {question.type}</p>
        <p>Question Points: {question.points}</p>
      </Card>
      <Card style={leftDivStyle}>
        <CardHeader
          title='Add New Answer'
        ></CardHeader>
        <TextField label='New Answer' onChange={e => setAnswerName(e.target.value)}/>
        <p>Correct?</p>
        <select id="correct" onChange={e => setAnswerCorrect(e.target.value)}>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <Button onClick={() => addAnswerHandler()} variant='outlined' size='small'>
          Add Answer
        </Button>
      </Card>
    </div>
    <div id='middle' style={leftRightStyle}>
        <Card style={middleDivStyle}>
          <CardHeader
            title='Edit Question'
            subheader='Edit multiple or a single field of the question'
          ></CardHeader>
          <p>Enter New Question Name:</p>
          <TextField label='New Question Name' onChange={e => setQuestionName(e.target.value)}/>
          <p>Upload New Question Thumbnail:</p>
          <Input type='file' label='New Question Thumbnail' onChange={e => imageHandler(e.target.files[0])}/>
          <p>Enter New Question Time Limit:</p>
          <TextField label='New Question Time Limit' onChange={e => setQuestionTimelimit(e.target.value)}/>
          <p>Enter New Question Points:</p>
          <TextField label='New Question Points' onChange={e => setQuestionPoints(e.target.value)}/>
          <Button onClick={() => editQuestionHandler()} variant='outlined' size='small'>
            Submit
          </Button>
        </Card>
    </div>
    <div id='right' style={leftRightStyle}>
      <div style={answersStyle}>
        <h2>Answers ({question.answers.length})</h2>
        {question.answers.map((answer) => (
          <Card key={answer.id} style={answerStyle}>
            <CardContent>
              <CardHeader
                title={answer.name}
              ></CardHeader>
              <p>Correct: {answer.correct}</p>
              <CardActions style={{ justifyContent: 'center' }}>
                <Button onClick={() => deleteAnswerHandler(answer.id)} variant='outlined' size='small'>
                  Delete Answer
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
  )
}

export default EditQuestion;
