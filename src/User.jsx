import React from "react";
import axios from "axios";

import useAsync from "./useAsync";

// API에 파라미터가 필요한 경우
async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  // [id] 는 id가 바뀔때마다 재호출 되도록 deps에 id를 넣어준거다
  const [state] = useAsync(() => getUser(id), [id]);

  const { loading, data: user, error } = state;

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
