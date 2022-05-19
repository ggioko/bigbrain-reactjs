/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  let newAnswerList = []
  for (const answer of question.answers) {
    const modifiedAnswer = {
      id: answer.id,
      name: answer.name
    }
    newAnswerList.push(modifiedAnswer);
  }
  return {
    name: question.name,
    id: question.id,
    type: question.type,
    image: question.image,
    thumbnail: question.thumbnail,
    answers: newAnswerList,
    timelimit: parseInt(question.timelimit, 10),
    points: question.points
  }
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let idlist = [];
  for (const answer of question.answers) {
    if (answer.correct === 'true') {
      idlist.push(answer.id);
    }
  }
  console.log(idlist);
  return idlist;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let idList = [];
  for (const answer of question.answers) {
    list.push(answer.id);
  }
  return idList; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timelimit;
};
