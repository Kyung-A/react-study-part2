import React, { useEffect } from "react";
import { useUsersState, useUsersDispatch, getUser } from "./UsersContext";

function User({ id }) {
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  console.log(id);

  useEffect(() => {
    getUser(dispatch, id);
  }, [dispatch, id]);

  const { data: user, loading, error } = state.user;

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생!</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>Email : {user.email}</p>
    </div>
  );
}

export default User;
