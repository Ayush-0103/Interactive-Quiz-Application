import React, { useState, useEffect } from "react";

const Quiz = () => {
  const questions = [
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "lambda", "fun"],
      answer: "def",
    },
    {
      question: "What is the output of: print(type(3.14))?",
      options: ["int", "float", "double", "number"],
      answer: "float",
    },
    {
      question: "Which of the following is a mutable data type in Python?",
      options: ["tuple", "string", "list", "int"],
      answer: "list",
    },
    {
      question: "How do you insert a comment in Python?",
      options: [
        "// This is a comment",
        "/* This is a comment */",
        "# This is a comment",
        "` This is a comment `",
      ],
      answer: "# This is a comment",
    },
    {
      question: "What does the 'len()' function do in Python?",
      options: [
        "Calculates the sum of all elements",
        "Returns the number of elements",
        "Removes duplicate elements",
        "Converts elements to strings",
      ],
      answer: "Returns the number of elements",
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
 
    const storedResults = JSON.parse(localStorage.getItem("recentResults")) || [];
    setRecentResults(storedResults);

    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleAnswerSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSubmit = () => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      {
        question: questions[currentQuestion].question,
        selectedOption: selectedOption,
        correctAnswer: questions[currentQuestion].answer,
        isCorrect: isCorrect,
      },
    ]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption("");
      setTimeLeft(30);
    } else {
      setShowScore(true);
      saveRecentResult();
    }
  };

  const saveRecentResult = () => {
    const result = {
      score: score,
      date: new Date().toLocaleString(),
    };

    
    const updatedResults = [result, ...recentResults].slice(0, 5); 
    localStorage.setItem("recentResults", JSON.stringify(updatedResults));
    setRecentResults(updatedResults);
  };

  const handleClearHistory = () => {
    
    localStorage.removeItem("recentResults");
    setRecentResults([]);
  };

  const getFeedbackMessage = () => {
    if (score === questions.length) {
      return "Excellent! You got all the answers right!";
    } else if (score >= questions.length * 0.7) {
      return "Good job! You did well.";
    } else if (score >= questions.length * 0.4) {
      return "Not bad! But you can do better.";
    } else {
      return "Try again! Keep learning and improving.";
    }
  };

  return (
    <div>
      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h2>
              You scored {score} out of {questions.length}
            </h2>
            <div className="feedback-section">
              <h3>{getFeedbackMessage()}</h3>
              <div className="summary-section">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`answer-item ${answer.isCorrect ? "correct" : "wrong"}`}
                  >
                    <p className="question-text">{answer.question}</p>
                    <p>
                      <strong>Your Answer:</strong> {answer.selectedOption}
                    </p>
                    {!answer.isCorrect && (
                      <p>
                        <strong>Correct Answer:</strong> {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.reload()}>Restart Quiz</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="question-section">
              <h3>
                Question {currentQuestion + 1}/{questions.length}
              </h3>
              <p>{questions[currentQuestion].question}</p>
            </div>
            <div className="options-section">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedOption === option ? "selected" : ""}`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedOption}
              className="next-button"
            >
              Next
            </button>
            <div className="timer">
              <p>Time Left: {timeLeft}s</p>
            </div>
          </div>
        )}
      </div>

      
      <div className="recent-results-box">
        <h3>Recent Results</h3>
        {recentResults.length > 0 ? (
          <ul>
            {recentResults.map((result, index) => (
              <li key={index}>
                <strong>{result.date}:</strong> {result.score} / {questions.length}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent results available.</p>
        )}
        <button onClick={handleClearHistory} className="clear-history-button">
          Clear History
        </button>
      </div>
    </div>
  );
};

export default Quiz;
