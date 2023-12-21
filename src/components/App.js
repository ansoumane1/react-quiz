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
import { useQuiz } from "../context/QuizContext";

export default function App() {
  const { status } = useQuiz();
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Questions />
            <Footer>
              <Timer />
              <NextQuestionButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishedScreen />}
      </Main>
    </div>
  );
}
