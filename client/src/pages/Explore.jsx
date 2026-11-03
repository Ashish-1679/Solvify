import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
function Explore() {
const [problemdata, setProblemData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchData = async () => {
    try {
        const response = await api.get("/problems/open");
        setProblemData(response.data.problems);
    }
    catch(err) {
        console.log(err.response?.data || err.message);
    }
    finally {
        setLoading(false);
    }
};
    fetchData();}, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <h1>Welcome to Solvify!</h1>
            <div>
        <h1>Explore Problems</h1>
       {loading ? (
    <p>Loading problems...</p>
) : problemdata.length === 0 ? (
    <p>No problems available right now.</p>
) : (
    problemdata.map((problem) => (
        <div key={problem._id}>
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <p>Bounty: {problem.bounty}</p>
        </div>
    ))
)}
    </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Explore;