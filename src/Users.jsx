import React, { useState } from "react";

import { useUsersState, useUsersDispatch, getUsers } from "./UsersContext";

import User from "./User";

// 요청에 대한 상태를 관리 할 때에는 총 3가지 상태를 관리해야한다
// 1. 요청의 결과
// 2. 로딩 상태
// 3. 에러

function Users() {
  const [userId, setUserId] = useState(null);
  const state = useUsersState();
  const dispatch = useUsersDispatch();

  const { data: users, loading, error } = state.users;

  const fetchData = () => {
    getUsers(dispatch);
  };

  if (loading) return <div>로딩중 ... </div>;
  if (error) return <div>에러 발생</div>;
  if (!users) return <button onClick={fetchData}>불러오기</button>;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{ cursor: "pointer" }}
          >
            {user.username} ({user.name})
          </li>
        ))}
      </ul>

      <button type="button" onClick={fetchData}>
        재요청
      </button>

      <p>{userId && <User id={userId} />}</p>
    </>
  );
}

export default Users;
