import React, { useState } from "react";
import axios from "axios";

import useAsync from "./useAsync";
import User from "./User";

// 요청에 대한 상태를 관리 할 때에는 총 3가지 상태를 관리해야한다
// 1. 요청의 결과
// 2. 로딩 상태
// 3. 에러

//useAsync에서는 Promise의 결과물을 바로 data에 담기 때문에 요청을 한 후 response에서 data를 추출하여 반환하는 함수 필요
async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );

  return response.data;
}

function Users() {
  // const [users, setUsers] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // getUsers = callbcak
  // [] = deps
  // true = skip
  const [state, refetch] = useAsync(getUsers, [], true);

  const [userId, setUserId] = useState(null);

  const { loading, data: users, error } = state; // state.data를 users라는 이름으로 조회

  if (loading) return <div>로딩중 ... </div>;
  if (error) return <div>에러 발생</div>;

  // skip이 true이기 때문에 fetchData가 실행되지 않아서 users가 null임
  if (!users) return <button onClick={refetch}>불러오기</button>;

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

      <button type="button" onClick={refetch}>
        재요청
      </button>

      <p>{userId && <User id={userId} />}</p>
    </>
  );
}

export default Users;
