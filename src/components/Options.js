import { useQuiz } from "../context/QuizContext";

function Options({ question }) {
  const { answer, dispatch } = useQuiz();
  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? "answer" : ""} ${
            hasAnswer
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={index}
          onClick={() => dispatch({ type: "newAnswer", playload: index })}
          disabled={hasAnswer}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
