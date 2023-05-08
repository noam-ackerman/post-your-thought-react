import React, {useRef, useState} from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";

export default function Signup () {
    const { SignupUser } = useAuth();
    const navigate = useNavigate();
    const emailInput = useRef();
    const passwordInput = useRef();
    const passwordConfirmInput = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    async function handleSubmit(e){
        e.preventDefault();
        if(passwordInput.current.value !== passwordConfirmInput.current.value) {
            return setError("Passwords do not match!");
        }

        try {
            setError(""); 
            setLoading(true);
            await SignupUser(emailInput.current.value, passwordInput.current.value);
            navigate("/")
        }
        catch (err){
            if(err.code === "auth/invalid-email") {
                setError('Failed to Signup! Invalid email.')
            } 
            if(err.code === "auth/weak-password") {
                setError('Password must be at least 6 characters long')
            } 
            if(err.code === "auth/email-already-in-use") {
                setError('Email is already in use!')
            } else {
                setError('Failed to Signup!')
            }
        }
        setLoading(false);
    }    

   return (
    <div>
        <div>
        <h2>Sign Up</h2>
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
                <div>
                    <label>Password Confirmation</label>
                    <input type="password" ref={passwordConfirmInput} name="password-confirmation" required/>
                </div>
                <button type="submit" disabled={loading}>Sign Up</button>
            </form>
        </div>
        <div>
            Already have an account?{" "}
            <Link to="/login">
                Login
            </Link>
        </div>
    </div>
   )
}