import api from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
function Signup(){
    const [username,setUsername]  = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();
try{
  const response = await api.post("/signUp",{
    username,email,password
  });
  console.log(response.data);
}

catch(err){
  console.log(err.response?.data||err.message);
}
    
};

return (
    
    <>
   <form onSubmit = {handleSubmit}> 
    <input type="text" placeholder = "Enter username" value = {username} onChange = {
        (e)=> setUsername(e.target.value)}/>

      <input type="email" placeholder = "Enter email" value = {email} onChange = {
        (e)=> setEmail(e.target.value)}/>

              <input type="password" placeholder = "Enter password" value = {password} onChange = {
        (e)=> setPassword(e.target.value)}/>
        <button type="submit">Signup</button>
       
        </form>
        <p>
  Already have an account? <Link to="/login">Login</Link>
</p>  </>
      );
    }
export default Signup;