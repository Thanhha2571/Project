import { useParams } from "react-router-dom";

function Learning() {
    const { slug } = useParams();
    return (
        <div>
            Learning {slug}
        </div>
    )
}

export default Learning;