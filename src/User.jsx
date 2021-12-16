import React from "react";
import axios from "axios";
import { useAsync } from "react-async";

// API에 파라미터가 필요한 경우 (react-async를 사용할땐 프로미스를 반환하는 함수를 객체 형태로 해주어야함 -> sync를 앞에 써야하는 이유)
async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  // [id] 는 id가 바뀔때마다 재호출 되도록 deps에 id를 넣어준거다
  // react-async는 객체로 작성해줘야함 {}
  const {
    data: user,
    error,
    isLoading,
  } = useAsync({
    promiseFn: getUser,
    id,
    watch: id, // id 값이 바뀔때마다 promisFn에 넣은 함수를 다시 호출
  });

  if (isLoading) return <div>로딩중...</div>;
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
