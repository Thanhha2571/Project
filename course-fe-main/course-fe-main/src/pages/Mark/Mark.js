import { useParams } from "react-router-dom";
const Mark = (props) => {
    const { resultExam } = props;
    const { course, lecture } = useParams()
    console.log(course);
    console.log(lecture);
    return (
        <div className="flex flex-col items-center font-PlaypenSans w-full h-screen bg-blue-500">
            <div className="px-40 w-full h-auto mt-40">
                <div className="px-40 w-full h-full">
                    <div className="bg-white flex flex-col  w-full h-auto border border-solid border-neutral-300 rounded-md">
                        <div className="flex gap-5 justify-center items-center">
                            <div className="text-4xl font-bold">RESULT</div>
                            {/* <img src={} /> */}
                        </div>
                        <div className="bg-neutral-100 border w-full mt-4"></div>
                        <div className="flex flex-col ml-20 text-2xl gap-5 mt-10 mb-10">
                            <div>COURSE: {course}</div>
                            <div>LECTURE: {lecture}</div>
                            <div>MARK: {resultExam}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Mark