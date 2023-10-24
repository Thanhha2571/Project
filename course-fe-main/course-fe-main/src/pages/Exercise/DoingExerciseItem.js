import React, { useState, useEffect } from "react";
import SmileIcon from "../../smile-icon.png";
import SadIcon from "../../sad-icon.png";
import { Button } from "antd";

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
    } = props;

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [currentPage, setCurrentQuestionPage] = useState(1);

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
        }
    };

    // Create a function to determine if an answer is selected
    const isAnswerSelected = (choice) => selectedAnswer === choice;

    useEffect(() => {
        // Change the current question when the page changes
        const startIndex = (currentPage - 1) * datesPerPage;
        const endIndex = startIndex + datesPerPage;
        setCurrentQuestionPage(listQuestions.slice(startIndex, endIndex));
    }, [currentPage]);

    return (
        <div className="flex flex-col gap-4 p-5 w-full h-auto justify-center items-center">
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
                <div className="p-10 w-1/2 cursor-pointer">
                    <div
                        onClick={() => handleAnswerClick("B")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_b, isAnswerSelected("B"))} ${getHoverClass(isAnswerSelected("B"))}`}
                    >
                        B. {answer_b}
                    </div>
                </div>
                <div className="p-10 w-1/2 cursor-pointer">
                    <div
                        onClick={() => handleAnswerClick("C")}
                        className={`px-10 py-5 text-2xl border border-solid border-neutral-300 rounded-2xl cursor-pointer ${getBackgroundColor(flag_c, isAnswerSelected("C"))} ${getHoverClass(isAnswerSelected("C"))}`}
                    >
                        C. {answer_c}
                    </div>
                </div>
                <div className="p-10 w-1/2 cursor-pointer">
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
                <div className="flex gap-3 flex-wrap justify-center items-center">
                    {Array.from({
                        length: Math.ceil(listQuestions.length / datesPerPage),
                    }).map((_, index) => (
                        <Button
                            className="bg-neutral-100 text-black px-6 py-6 w-1/3 flex items-center justify-center border-solid border border-black rounded-full"
                            type="primary"
                            onClick={() => {
                                setCurrentPage(index + 1);
                                setSelectedAnswer(null);
                                setShowMessage(false); 
                            }}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoingExerciseItem;




