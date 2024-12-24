import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utills/axios";
import { useSelector } from "react-redux";
import { useTheme } from "./ThemeContext";

function CategoryPage() {
  const { token, user } = useSelector((state) => state.user);
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showAnswers, setShowAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const { isDark } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);

      const questionsResponse = await axiosInstance.get(
        `/questions/${category}/${user.userId}`,
        { params: { page: currentPage, limit: 5 } }
      );

      if (questionsResponse.data && questionsResponse.data.questions) {
        setQuestions(questionsResponse.data.questions);
        setTotalPage(questionsResponse.data.totalPages);
        setPendingQuestions(questionsResponse.data.pendingAnswerCount);
      } else {
        setError("Failed to load questions.");
      }

      const scoreResponse = await axiosInstance.get(`/user-score/${user.userId}/${category}`);
      if (scoreResponse.data.userScore) {
        const { score, correctAnswer, inCorrectAnswer, answeredQuestions, pendingAnswer } = scoreResponse.data.userScore;
        setScore(score || 0);
        setCorrectAnswers(correctAnswer || []);
        setIncorrectAnswers(inCorrectAnswer || []);
        setPendingQuestions(pendingAnswer.length || []);
        setAnsweredQuestions(answeredQuestions || []);

        const feedbackMap = {};
        scoreResponse.data.userScore.answers.forEach((ans) => {
          feedbackMap[ans.questionId] = ans.isCorrect ? "Correct answer!" : "Incorrect answer.";
        });
        setFeedback(feedbackMap);
      }
    } catch (error) {
      setError("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };
  const nextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1); // Increment the currentPage
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1); // Decrement the currentPage
    }
  };
  useEffect(() => {
    if (!user || !token) {
      navigate("/"); // Redirect if not authenticated
    } else {
      fetchData();
    }
  }, [category, user, token, currentPage]);

  const handleSubmit = async (questionIndex, selectedOption) => {
    const questionId = questions[questionIndex]._id;
    if (submittedAnswers[questionId]) {
      return;
    }

    try {
      const response = await axiosInstance.post("/submit", {
        userId: user.userId,
        questionId,
        selectedOption,
      });

      const { isCorrect, updatedScore, feedbackMessage, pendingQuestions, pendingAnswerCount, totalQuestions,hasAnswerd } = response.data;

      setFeedback((prev) => ({ ...prev, [questionId]: feedbackMessage }));
      setSubmittedAnswers((prev) => ({ ...prev, [questionId]: {submitted:hasAnswerd,clicked:false}}));
      setScore(updatedScore);
      setCorrectAnswers((prev) => (isCorrect ? [...prev, questionId] : prev));
      setIncorrectAnswers((prev) => (!isCorrect ? [...prev, questionId] : prev));
      setPendingQuestions(pendingQuestions);
      setQuestions((prev) => prev.map((q) => (q._id === questionId ? { ...q } : q)));
    } catch (error) {
      setFeedback((prev) => ({ ...prev, [questionId]: "There was an error submitting your answer." }));
    }
  };
  const handleShowAnswer = (questionIndex) => {
    const questionId = questions[questionIndex]._id;
  
    // Toggle the "show answer" state and mark the button as clicked
    setShowAnswers((prev) => ({
      ...prev,
      [questionIndex]: true, // Show the answer
    }));
    setSubmittedAnswers((prev) => ({
      ...prev,
      [questionId]: {
          ...prev[questionId],
        clicked: true, // Disable the button after clicking
      },
    }));
  };
  

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} flex flex-col sm:flex-wrap`}>
      <h2 className="text-2xl sm:text-2xl font-bold mb-6 text-center text-blue-700">
        Questions for {category}
      </h2>
      {loading && <div className="text-center text-gray-500 dark:text-gray-400">Loading questions...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question, index) => {
            const isAnswered = answeredQuestions.includes(question._id);
            return (
              <div key={question._id} className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'} flex flex-col sm:flex-row gap-4 sm:gap-8`}>
                <h3 className="text-lg font-semibold mb-4">{question.questionText}</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {question.options[0].map((option, i) => {
                    const optionLabel = String.fromCharCode(65 + i);
                    return (
                      <div key={i} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          id={`option-${index}-${i}`}
                          value={optionLabel}
                          disabled={isAnswered}
                          onChange={(e) => {
                            const selectedOption = e.target.value;
                            setSelectedAnswers((prev) => ({ ...prev, [question._id]: selectedOption }));
                          }}
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`option-${index}-${i}`} className="ml-2">
                          {optionLabel}. {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center">
  {/* Submit Button */}
  <button
    onClick={() => {
      const selectedOption = selectedAnswers[question._id];
      if (selectedOption) {
        handleSubmit(index, selectedOption); // Call handleSubmit
      } else {
        alert("Please select an option before submitting");
      }
    }}
    className={`mt-4 px-4 py-2 rounded ${
      submittedAnswers[question._id]?.submitted
        ? `bg-gray-400 ${isDark ? "text-black" : "text-gray-700"} cursor-not-allowed` // Gray and disabled if already submitted
        : "bg-blue-600 text-white hover:bg-blue-700" // Active if not submitted
    }`}
    disabled={submittedAnswers[question._id]?.submitted} // Disable if already submitted
  >
    Submit
  </button>

  {/* Show Answer Button */}
  <button
    onClick={() => handleShowAnswer(index)}
    className={`ml-4 px-4 py-2 rounded ${
      submittedAnswers[question._id]?.submitted && !submittedAnswers[question._id]?.clicked
        ? "bg-blue-600 text-white hover:bg-blue-700" // Blue and active if submitted but not clicked
        : `bg-gray-400 ${isDark ? "text-black" : "text-gray-700"} cursor-not-allowed` // Gray and disabled otherwise
    }`}
    disabled={!submittedAnswers[question._id]?.submitted || submittedAnswers[question._id]?.clicked} // Disable if not submitted or already clicked
  >
    {showAnswers[index] ? "Hide Answer" : "Show Answer"}
  </button>

  {/* Feedback */}
  <span className="ml-4 text-blue-600 font-medium">{feedback[question._id]}</span>
</div>


                {showAnswers[index] && (
                  <div className="mt-2">
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">No questions available for this category.</div>
        )}
      </div>

      <div className="w-full flex justify-end items-center mt-6 space-x-2">
        <button onClick={prevPage} disabled={currentPage === 1} className="px-6 py-2 rounded disabled:opacity-50">
          Prev
        </button>
        <p>
          Page {currentPage} of {totalPage}
        </p>
        <button onClick={nextPage} disabled={currentPage >= totalPage} className="px-6 py-2 rounded disabled:opacity-50">
          Next
        </button>
      </div>

      <div className="mt-12 w-full">
        <h3 className="text-lg font-bold dark:text-white">Your Score</h3>
        <p className={isDark ? "text-gray-200" : "text-black"}>Your score: {score}</p>
        <p className={isDark ? "text-gray-200" : "text-black"}>Correct answers: {correctAnswers.length}</p>
        <p className={isDark ? "text-gray-200" : "text-black"}>Incorrect answers: {incorrectAnswers.length}</p>
        <p className={isDark ? "text-gray-200" : "text-black"}>Pending questions: {pendingQuestions}</p>
      </div>
    </div>
  );
}

export default CategoryPage;
