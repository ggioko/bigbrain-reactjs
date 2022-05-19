import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardActions, CardContent, CardHeader, TextField, Input } from '@mui/material';

import fileToDataUrl from '../components/fileToDataUrl';

import LogoutButton from '../components/LogoutButton';

const editQuizStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'row',
  backgroundColor: '#F6CFFC',
};

const editDetailsStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50%',
  width: '100%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center'
}

const addQuestionStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '30%',
  width: '100%',
  flexDirection: 'column',
  border: '1px solid',
  textAlign: 'center'
}

const questionsStyle = {
  border: '1px solid',
  width: '100%',
  height: '80%',
  alignItems: 'center',
  textAlign: 'center',
  overflowY: 'scroll',
  backgroundColor: 'white',
  borderRadius: '1%'
}

const questionStyle = {
  width: '99%',
  border: '1px solid',
  flexDirection: 'column',
  textAlign: 'center',
  display: 'flex',
}

const leftRightStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '49.5%',
  flexDirection: 'column'
};

function EditQuiz () {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { quizid } = useParams();
  const [questionName, setQuestionName] = React.useState('');
  const [quiz, setQuiz] = React.useState({
    name: '',
    thumbnail: '',
    questions: []
  });
  const [quizName, setQuizName] = React.useState('');
  const [quizThumbnail, setQuizThumbnail] = React.useState('');

  const editQuizHandler = async () => {
    if (quizName === '' && quizThumbnail !== '') {
      EditQuizDetails({ thumbnail: quizThumbnail });
    } else if (quizName !== '' && quizThumbnail === '') {
      EditQuizDetails({ name: quizName });
    } else { EditQuizDetails({ name: quizName, thumbnail: quizThumbnail }); }
  }

  const addQuestionHandler = async () => {
    const data = await getQuizDetails();
    console.log(data.questions)
    const questionid = quiz.questions.length + 1
    console.log(questionid);
    const newQuestion = {
      id: questionid,
      thumbnail: null,
      name: questionName,
      answers: [],
      timelimit: '',
      points: '',
      type: ''
    }
    const newQuestions = [...data.questions, newQuestion];
    console.log('new question added:', newQuestions)

    EditQuizDetails({ questions: newQuestions });
  };

  const deleteQuestionHandler = async (questionid) => {
    const data = await getQuizDetails();
    console.log(data.questions)
    const newQuestions = await data.questions.filter(answer => answer.id !== questionid);
    let id = 1
    newQuestions.forEach((e) => {
      e.id = id;
      id = id + 1;
    })
    console.log('new question deleted:', newQuestions)
    EditQuizDetails({ questions: newQuestions });
  };

  const imageHandler = async (image) => {
    console.log(image);
    fileToDataUrl(image)
      .then(data => {
        console.log(data)
        setQuizThumbnail(data);
      })
  };

  async function getQuizDetails () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + quizid, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json();
    return data;
  }

  async function EditQuizDetails (newBody) {
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
      alert('successfully edited quiz');
      window.location.reload(false);
    }
  }

  React.useEffect(async () => {
    const data = await getQuizDetails();
    console.log('new', data);
    setQuiz(data);
  }, []);

  return (<div id='edit-quiz-section' style={editQuizStyle}>
    <LogoutButton/>
    <div id='left' style={leftRightStyle}>
      <Card id='quiz-details' style={editDetailsStyle}>
        <CardHeader
          title={quiz.name}
        ></CardHeader>
        <img src={quiz.thumbnail} alt="quiz thumbnail" style={{ height: '23%', width: '13%' }} />
        <p>Enter New Quiz Name</p>
        <TextField id='edit-quiz-name' label='New Quiz Name' onChange={e => setQuizName(e.target.value)}/>
        <p>Upload New Quiz Thumbnail</p>
        <Input type='file' onChange={e => imageHandler(e.target.files[0])}/><br/>
        <Button type='submit' onClick={() => editQuizHandler()} variant='outlined' size='small'>
          Submit
        </Button>
      </Card>
      <Card id='add-question' style={addQuestionStyle}>
        <CardHeader
          title='Add New Question'
        ></CardHeader>
        <TextField label='New Question' onChange={e => setQuestionName(e.target.value)}/>
        <Button onClick={addQuestionHandler} variant='outlined' size='small'>
            Add Question
        </Button>
      </Card>
    </div>
    <div id='right' style={leftRightStyle}>
      <div style={questionsStyle}>
        <h2>Questions ({quiz.questions.length})</h2>
        {quiz.questions.map((question) => (
          <Card style={questionStyle} key={question.id}>
            <CardContent>
              <CardHeader
                title={question.name}
                subheader={'Question ' + question.id}
              >
              </CardHeader>
              <img src={question.thumbnail} alt="question thumbnail" style={{ height: '23%', width: '13%' }}/>
              <CardActions style={{ justifyContent: 'center' }}>
                <Button onClick={() => navigate('/editquestion/' + quizid + '/' + question.id)} variant='outlined' size='small'>
                  Edit Question
                </Button>
                <Button onClick={() => deleteQuestionHandler(question.id)} variant='outlined' size='small'>
                  Delete Question
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>);
}

export default EditQuiz;
