import { useState , useEffect} from "react"
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login(){
   const [email,setEmail] = useState("");
   const [password,setPassword]  = useState("");
   const navigate = useNavigate();
     useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/explore");
        }
    }, []);
   const handleSubmit = async (e) => {
    e.preventDefault();
try{
   const response = await api.post("/Login",{
      email,password
   });
   console.log(response.data);
   localStorage.setItem("token", response.data.token);
   navigate("/explore");
}
catch(err){
   console.log(err.response?.data||err.message);
}
   
};
   return (
      <>
    <form onSubmit = {handleSubmit}>
    <input type  = "text" placeholder = "Enter Email" value = {email}
    onChange = {
       (e)=> setEmail(e.target.value)
    } />
     <input type="password" placeholder = "Enter password" value = {password} onChange = {
        (e)=> setPassword(e.target.value)}/>
        <button>Login</button>

    </form>
    <p>
  Don't have an account? <Link to="/signup">Signup</Link>
</p> </>
   )
}
export default Login;