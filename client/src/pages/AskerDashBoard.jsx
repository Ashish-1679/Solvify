import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
function AskerDashBoard(){
    const [MyOpenProblems,setMyOpenProblems] = useState([]);
        const navigate = useNavigate();
        const [ResolvedProblems,setResolvedProblems] = useState([]);
        const [ActiveSessions,setActiveSessions]  = useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
         try {  const response = await api.get("workspace/asker");
            setMyOpenProblems(response.data.open_problems);
        setResolvedProblems(response.data.resolved_problems);
    setActiveSessions(response.data.active_problems);     
console.log(response.data);       }
            catch(err){
                          console.log(err.message);
            }
        }
        fetchData();
    }
    ,[]);
    return (
    <div>
        <h1>Asker Dashboard</h1>
        <h2>My Open Problems</h2>
        {MyOpenProblems.length === 0 ? (
            <p>No open problems found.</p>
        ) : (
            MyOpenProblems.map((problem) => (
                <div key={problem._id}>
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                    <p>Bounty: {problem.bounty}</p>
                </div>
            ))
        )}

        <h2>Active Sessions</h2>
        {ActiveSessions.length === 0 ? (
            <p>No active sessions.</p>
        ) : (
            ActiveSessions.map((problem) => (
                <div key={problem._id}>
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                </div>
            ))
        )}

        <h2>Resolved Problems</h2>
        {ResolvedProblems.length === 0 ? (
            <p>No resolved problems.</p>
        ) : (
            ResolvedProblems.map((problem) => (
                <div key={problem._id}>
                    <h3>{problem.title}</h3>
                    <p>{problem.description}</p>
                    <p>Bounty: {problem.bounty}</p>
                </div>
            ))
        )}
    </div>
);
}
export default AskerDashBoard;