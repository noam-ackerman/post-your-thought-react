import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser, LogoutUser } = useAuth();
    const [error, setError] =  useState();

    async function HandleLogout() {
      setError("");
      try {
        await LogoutUser();
        navigate("/login")
      } catch {
        setError("Failed to log out!");
      }

    }

    return(
        <div>
            <div>YOU ARE LOGGED IN {currentUser.email}</div>
            {error && <div>{error}</div>}
            <button onClick={HandleLogout}>Logout</button>
        </div>
    )
}