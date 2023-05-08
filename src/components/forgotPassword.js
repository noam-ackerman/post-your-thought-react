import React, {useRef, useState} from 'react';
import { useAuth} from '../context/AuthContext';
import { Link } from "react-router-dom";


export default function ForgotPassword () {
    const { resetPassword } = useAuth();
    const emailInput = useRef();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailInput.current.value);
            setMessage("Check your inbox for further instructions!");
        }
        catch (err){
            setError("Failed to reset password!");
        }
        setLoading(false);
    }    

   return (
    <div>
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                {error && <div>{error}</div>}
                {message && <div>{message}</div>}
                <div>
                    <label>Email</label>
                    <input type="email" ref={emailInput} name="email" placeholder='example@example.com' required/>
                </div>
                <button type="submit" disabled={loading}>Reset Password</button>
            </form>
            <div>
                <Link to="/login">
                Log in
                </Link>
            </div>    
        </div>
    </div>
   )
}