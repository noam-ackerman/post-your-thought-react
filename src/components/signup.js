import React, {useRef, useState} from 'react';
import { useAuth } from '../context/AuthContext';

export default function Signup () {
    const { SignupUser } = useAuth();
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
            console.log(emailInput.current.value, passwordInput.current.value)
            await SignupUser(emailInput.current.value, passwordInput.current.value);
            console.log("signed up!")
        }
        catch {
            setError("Something went wrong!")
        }
        setLoading(false);
    }    

   return (
    <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
            <div>{error}</div>
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
   )
}