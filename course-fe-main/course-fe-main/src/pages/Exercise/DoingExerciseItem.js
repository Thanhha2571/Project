import React, { useState, useEffect } from "react";
import SmileIcon from "../../smile-icon.png";
import SadIcon from "../../sad-icon.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ApiClient } from "../../interceptors/axios";
import axios from "axios";
const DoingExerciseItem = (props) => {
    const {
        setCurrentPage,
        listQuestions,
        question,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        flag_a,
        flag_b,
        flag_c,
        flag_d,
        datesPerPage,
        courseDetail,
        lectureDetail,
        resultExam,
        setResultExam
    } = props;

    const nav = useNavigate()
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const totalQuestions = listQuestions.length;

    const handleQuizSubmission = async () => {
        const correctAnswersString = correctAnswers.toString();
        const totalQuestionsString = totalQuestions.toString();
        const result = `${correctAnswersString}/${totalQuestionsString}`;
        console.log(result);
    
        try {
            // Include the token in the headers
            // const headers = {
            //     Authorization: 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhQGdtYWlsLmNvbSIsImxldmVsIjoiMSIsImlhdCI6MTY5ODI0MDQ4OCwiZXhwIjoxNjk4MzI2ODg4fQ.GsszpfV0vecat_Hu1mkIGchs5KWhYzDrl6SsceH05u4", // Replace YOUR_AUTH_TOKEN with the actual token
            // };
    
            const response = await ApiClient().post(
                `student/update-mark/${courseDetail}/${lectureDetail}`,
                {mark: result},
                // { headers }
            );
    
            if (response.status === 200) {
                // Handle the API response if needed
                setResultExam(result)
                console.log("API response:", response);
                // Redirect to a different page after submission
                nav(`/mark/${courseDetail}/${lectureDetail}`);
            } else {
                console.log("API error: Unexpected response status");
            }
        } catch (error) {
            console.error("API error:", error);
            // Handle API error
        }
    };



    const isCorrect = (flag) => {
        return flag === 1;
    };

    const getBackgroundColor = (flag, selected) => {
        if (selected) {
            return isCorrect(flag) ? "bg-green-500" : "bg-red-500";
        }
        return "bg-neutral-100";
    };

    const getHoverClass = (selected) => {
        return selected ? "" : "hover:bg-blue-500";
    };

    const handleAnswerClick = (selected) => {
        if (selectedAnswer === null) {
            setSelectedAnswer(selected);
            setShowMessage(true);

            if (isCorrect(props[`flag_${selected.toLowerCase()}`])) {
                setCorrectAnswers(correctAnswers + 1);
                // Increment correctAnswers
            }
        }
    };
    // console.log(correctAnswers);

    const isAnswerSelected = (choice) => selectedAnswer === choice;
    const hasAnsweredQuestion = selectedAnswer !== null;

    return (
        <div className="flex flex-col gap-4 p-5 w-full h-auto justify-center items-center">
            <div className="text-sm">
                Question {currentQuestion} of {totalQuestions}
            </div>
            <span className="text-2xl">{question}</span>
            <div className="flex flex-wrap w-full">
                <div className="p-10 w-1/2">
                    <div
                        onClick={() => handleAnswerClick("A")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_a, isAnswerSelected("A"))} ${getHoverClass(isAnswerSelected("A"))}`}
                    >
                        A. {answer_a}
                    </div>
                </div>
                <div className="p-10 w-1/2">
                    <div
                        onClick={() => handleAnswerClick("B")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_b, isAnswerSelected("B"))} ${getHoverClass(isAnswerSelected("B"))}`}
                    >
                        B. {answer_b}
                    </div>
                </div>
                <div className="p-10 w-1/2">
                    <div
                        onClick={() => handleAnswerClick("C")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_c, isAnswerSelected("C"))} ${getHoverClass(isAnswerSelected("C"))}`}
                    >
                        C. {answer_c}
                    </div>
                </div>
                <div className="p-10 w-1/2">
                    <div
                        onClick={() => handleAnswerClick("D")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_d, isAnswerSelected("D"))} ${getHoverClass(isAnswerSelected("D"))}`}
                    >
                        D. {answer_d}
                    </div>
                </div>
            </div>
            <div className="flex justify-between w-full px-10">
                {showMessage && (
                    <div className={`text-lg ${isCorrect(props[`flag_${selectedAnswer.toLowerCase()}`]) ? "text-green-500" : "text-red-500"}`}>
                        {isCorrect(props[`flag_${selectedAnswer.toLowerCase()}`]) ? (
                            <div className="flex gap-3 justify-center items-center">
                                <img src={SmileIcon} alt="Smile Icon" />
                                <span>CORRECT ANSWER!</span>
                            </div>
                        ) : (
                            <div className="flex gap-3 justify-center items-center">
                                <img src={SadIcon} alt="Sad Icon" />
                                <span>WRONG ANSWER!</span>
                            </div>
                        )}
                    </div>
                )}
                <div
                    className={`bg-blue-500 px-10 py-2 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer hover:bg-blue-800 justify-center items-center ${hasAnsweredQuestion ? "" : "cursor-not-allowed"}`}
                    type="primary"
                    onClick={() => {
                        if (currentQuestion === totalQuestions) {
                            // console.log(`${correctAnswers}/${totalQuestions}`);
                            // ApiClient().post(`update-mark/${courseDetail}/${lectureDetail}`)
                            // nav(`/mark/${courseDetail}/${lectureDetail}`)
                            handleQuizSubmission();

                        } else if (hasAnsweredQuestion) {
                            setCurrentPage((prevPage) => prevPage + 1);
                            setCurrentQuestion((prevQuestion) => prevQuestion + 1);
                            setSelectedAnswer(null);
                            setShowMessage(false);
                        }
                    }}
                >
                    {currentQuestion === totalQuestions ? "SUBMIT" : "NEXT QUESTION"}
                </div>
            </div>
        </div>
    );
};

export default DoingExerciseItem;







