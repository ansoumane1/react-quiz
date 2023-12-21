import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import Questions from "./Questions";
import StartScreen from "./StartScreen";
import FinishedScreen from "../FinishedScreen";
import NextQuestionButton from "./NextQuestionButton";
import Footer from "./Footer";
import Timer from "./Timer";
import Progress from "./Progress";

const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondRemaining: null,
};
const SECS_PER_QUESTION = 30;
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.playload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      // current question
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.playload,
        points:
          action.playload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "reset":
      return { ...initialState, questions: state.questions, status: "ready" };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   highscore: 0,
    // };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknow action");
  }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondRemaining,
  } = state;
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((resp) => resp.json())
      .then((data) => dispatch({ type: "dataReceived", playload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              answer={answer}
              points={points}
              index={index}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextQuestionButton
                answer={answer}
                dispatch={dispatch}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            index={index}
            numQuestions={numQuestions}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
