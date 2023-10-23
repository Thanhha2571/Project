import { Button } from "antd"
import { useNavigate } from "react-router-dom"
const ExerciseItem = (props) => {
    const { lecture_name, _id, lecture_slug, lecture_content } = props
    const nav = useNavigate()
    const handleDoingExercise = () => {
        nav(`/doing-exercise/${lecture_slug}`)
    }
    return (
        <div className="bg-neutral-100 p-7 flex flex-col w-1/2 mt-10 gap-5 border border-solid border-neutral-300 rounded-md">
            <span className="text-2xl font-bold">{lecture_name}</span>
            {/* <span className="italic text-xl">Mô tả: {lecture_content}</span> */}
            <div className="flex justify-between">
                <Button className="bg-neutral-100 text-black px-20 py-6 w-1/3 flex items-center justify-center border-solid boder border-black rounded-3xl"
                    type="primary" >
                    Xem bài giảng
                </Button>
                <Button
                    className="bg-neutral-100 text-black px-20 py-6 w-1/3 flex items-center justify-center border-solid border border-black rounded-3xl"
                    type="primary"
                    onClick={handleDoingExercise}
                >
                    Làm Bài Ngay
                </Button>
            </div>
        </div>
    )
}

export default ExerciseItem