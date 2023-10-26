import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { ApiClient } from "../../interceptors/axios";
import DoingExerciseItem from "./DoingExerciseItem";
import QuestionIcon from "../../question-icon.png";
const DoingExercise = (props) => {
    const { courseDetail, resultExam, setResultExam } = props
    console.log(courseDetail);
    const { slug } = useParams()
    console.log(slug);
    const [listQuestions, setListQuestions] = useState([])
    useEffect(() => {
        getData();
        // console.log("sđfsd");
    }, []);

    const getData = async () => {
        await ApiClient().get(`student/course/lecture-detail/${slug}`).then(res => {
            setListQuestions(res.data.exercises[0]?.ex_question);
            // console.log(res.data.exercises[0]?.ex_question);
            // console.log(res.data.exercises[0]?.ex_questions);
        })
    }

    const [currentPage, setCurrentPage] = useState(1);
    const datesPerPage = 1;
    const indexOfLastDate = currentPage * datesPerPage;
    const indexOfFirstDate = indexOfLastDate - datesPerPage;
    const currentQuestionSlice = listQuestions?.slice(indexOfFirstDate, indexOfLastDate);
    // console.log(currentQuestionSlice);
    // console.log(listQuestions);

    return (
        <div className="flex flex-col items-center font-PlaypenSans w-full h-screen bg-blue-500">
            <h1>BÀI TẬP {slug}</h1>
            <div className="px-40 w-full h-auto mt-40">
                <div className="px-40 w-full h-full">
                    <div className="bg-white flex flex-col justify-center items-center w-full h-auto border border-solid border-neutral-300 rounded-md">
                        <div className="flex gap-5 justify-center items-center">
                            <div className="text-4xl font-bold">CÂU HỎI</div>
                            <img src={QuestionIcon} />
                        </div>
                        <div className="bg-neutral-100 border w-full mt-4"></div>
                        {currentQuestionSlice.map((question, index) => (
                            <DoingExerciseItem
                                key={index}
                                resultExam={resultExam}
                                setResultExam={setResultExam}
                                courseDetail={courseDetail}
                                lectureDetail={slug}
                                listQuestions={listQuestions}
                                datesPerPage={datesPerPage}
                                setCurrentPage={setCurrentPage}
                                question={question?.question_name}
                                answer_a={question?.question_content?.question_a}
                                answer_b={question?.question_content?.question_b}
                                answer_c={question?.question_content?.question_c}
                                answer_d={question?.question_content?.question_d}
                                flag_a={question?.question_content?.flag_a}
                                flag_b={question?.question_content?.flag_b}
                                flag_c={question?.question_content?.flag_c}
                                flag_d={question?.question_content?.flag_d}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoingExercise
