import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import React from 'react';
import './App.css';

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard';
import EditQuiz from './pages/EditQuiz'
import EditQuestion from './pages/EditQuestion';
import QuizResults from './pages/QuizResults';
import JoinQuiz from './pages/JoinQuiz';
import PlayQuiz from './pages/PlayQuiz';

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/editquiz/:quizid' element={<EditQuiz />} />
          <Route path='/editquestion/:quizid/:questionid' element={<EditQuestion />} />
          <Route path='/results/:sessionid' element={<QuizResults/>} />
          <Route path='/join/:sessionid' element={<JoinQuiz/>} />
          <Route path='/join' element={<JoinQuiz/>} />
          <Route path='/play/:playerid' element={<PlayQuiz/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
