import React from "react";
import Navbar from "../components/navbar";
import { useUsersCtx } from "../context/usersContext";

export default function Homepage() {
  const { fetchingUsers } = useUsersCtx();

  React.useEffect(() => {
    fetchingUsers();
  }, [fetchingUsers]);

  return (
    <>
      <Navbar />
      <div>This is Homepage</div>
    </>
  );
}
