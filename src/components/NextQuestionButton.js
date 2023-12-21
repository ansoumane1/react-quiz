import { useQuiz } from "../context/QuizContext";

function NextQuestionButton() {
  const { answer, dispatch, index, numQuestions } = useQuiz();
  if (answer === null) return;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish !
      </button>
    );
  }
}

export default NextQuestionButton;
