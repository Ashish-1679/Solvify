
import {useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProblemDetails (){
    const [problem, setProblem] = useState(null);
    const {id} = useParams();
    const handleRequest = async () => {
        

    try{
 const respnse  = await api.post(`/requests/send/${id}`);
 console.log(respnse.data);
    }
    catch(err){
        console.log(err.response?.data||err.message);
    }
}
   useEffect(() => {
    const fetchData = async () => {
    try {
        const response = await api.get(`/problems/${id}`);
     setProblem(response.data.problem);
        console.log(response.data);
    }
    catch(err) {
        console.log(err.response?.data || err.message);
    }
 
};
   fetchData();}, [id]);
    return (
    <div>
        {problem && (
            <div>
                <h1>{problem.title}</h1>
                <p>{problem.description}</p>
                <p>Bounty: {problem.bounty}</p>

                <h3>Tags:</h3>
                {problem.tags.map((tag, index) => (
                    <span key={index}>{tag} </span>
                ))}
                <button onClick={handleRequest}>
    Request to Solve
</button>
            </div>
        )}
    </div>
); 

}

export default ProblemDetails;