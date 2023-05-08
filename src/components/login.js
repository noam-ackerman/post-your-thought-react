import React, {useRef, useState} from 'react';
import { useAuth} from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";


export default function Login () {
    const { LoginUser } = useAuth();
    const navigate = useNavigate();
    const emailInput = useRef();
    const passwordInput = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        try {
            setError(""); 
            setLoading(true);
            await LoginUser(emailInput.current.value, passwordInput.current.value);
            navigate("/")
        }
        catch (err){
            if(err.code === "auth/user-not-found") {
                setError('Failed to Login! User not Found.')
            } 
            if(err.code === "auth/wrong-password") {
                setError('Failed to Login! Wrong password.')
            } 
            if(err.code === "auth/too-many-requests") {
                setError('Too Many Failed Logins! try again later.')
            } else {
                setError('Failed to Login!')
            }
        }
        setLoading(false);
    }    

   return (
    <div>
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div>{error}</div>}
                <div>
                    <label>Email</label>
                    <input type="email" ref={emailInput} name="email" placeholder='example@example.com' required/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" ref={passwordInput} name="password" required/>
                </div>
                <button type="submit" disabled={loading}>Login</button>
            </form>
            <div>
                <Link to="/resetpassword">
                    Forgot Password?
                </Link>
            </div>
        </div>
        <div>
            Need an account?{" "}
            <Link to="/signup">
                Sign up
            </Link>
        </div>
    </div>
   )
}