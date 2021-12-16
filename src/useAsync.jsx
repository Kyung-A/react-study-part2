import React, { useReducer, useEffect } from "react";

// 요청 관리 상태 로직 (커스텀 훅)

// useReducer 사용하기
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// callback = API 요청을 시작하는 함수
// deps = 해당 함수 안에서 사용하는 useEffect의 deps로 설정 -> 이렇게 작성한 이유는 비동기 함수에 파라미터가 필요하고, 그 파라미터가 바뀔때마다 새로운 데이터를 불러오고 싶은 경우에 활용(동적으로 값 넣기?)
// skip = 필요할때만 요청, 이 값이 true라면 useEffect에서 아무런 작업도 하지 않음
// = ??? 으로 작성해준건 기본값을 지정해준것임
function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false,
  });

  // 서버에서 사용자 데이터를 불러와서 변수(response)에 담는다
  // async, await로 위 실행순서 보장 (참고로 useEffect에다가 async 바로 사용 불가능해서 내부 함수를 만든것)
  const fetchData = async () => {
    dispatch({ type: "LOADING" });
    // 현재위치 : loading 상태일때 실행할 함수 작성할 수 있음
    try {
      // 요청이 시작될 때에는 초기화
      // setError(null);
      // setUsers(null);
      // setLoading(true);
      //   const data = await axios.get(
      //     "https://jsonplaceholder.typicode.com/users"
      //   );
      // setUsers(response.data);

      const data = await callback();
      // 현재위치 : 데이터를 잘 받아온 후 성공 상태로 바뀌기 전에 함수를 실행할 수 있음
      dispatch({ type: "SUCCESS", data });
      // 현재위치 : 데이터, 성공상태 모두 된 후 함수를 실행할 수 있음
    } catch (e) {
      // setError(e);
      dispatch({ type: "ERORR", error: e });
      //현재위치 : erorr 상태일때 함수를 실행할 수 있음
    }
    // 모든 작업이 끝나면 로딩 false
    // setLoading(false);  ----> dispatch로 바꾸면서 success 되면 자동으로 loading이 false로 바뀌기 때문에 별도 처리 없음
  };

  // useEffect를 쓰는 이유는 최초로 접속했을때 유저정보를 불러오기 때문에
  useEffect(() => {
    // skip이 true이면 fetchData를 바로 실행하지 않음
    if (skip) return;

    fetchData(); //바로 실행

    // eslint 비활성화
    // eslint-disable-next-line
  }, deps); // deps가 [] 대괄호를 의미 (파라미터로 지정해줬음)

  return [state, fetchData];
}

export default useAsync;
