import React, { createContext, useReducer, useContext } from "react";

import {
  createAsyncDispatcher,
  createAsyncHandler,
  initialAsyncState,
} from "./asyncActionUtils";
import * as api from "./api";

const initialState = {
  users: initialAsyncState,
  user: initialAsyncState,
};

const usersHandler = createAsyncHandler("GET_USERS", "users");
const userHandler = createAsyncHandler("GET_USER", "user");

// 위에서 만든 객체, 유틸 함수들을 사용하여 리듀서 작성
function usersReducer(state, action) {
  switch (action.type) {
    case "GET_USERS":
    case "GET_USERS_SUCCESS":
    case "GET_USERS_ERROR":
      return usersHandler(state, action);

    case "GET_USER":
    case "GET_USER_SUCCESS":
    case "GET_USER_ERROR":
      return userHandler(state, action);

    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

// state용 context 와 dispatch용 context 따로 분리
const UsersStateContext = createContext(null);
const USersDispatchContext = createContext(null);

// 위에서 선언한 두가지 context들의 Provider로 감싸주는 컴포넌트
export function UsersProvider({ children }) {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  return (
    <UsersStateContext.Provider value={state}>
      <USersDispatchContext.Provider value={dispatch}>
        {children}
      </USersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
}

// state를 쉽게 조회할 수 있게 해주는 커스텀 Hook
export function useUsersState() {
  const state = useContext(UsersStateContext);

  if (!state) {
    throw new Error("Cannot find UsersProvider");
  }

  return state;
}

// dispatch를 쉽게 사용할 수 있게 해주는 커스텀 Hook
export function useUsersDispatch() {
  const dispatch = useContext(USersDispatchContext);

  if (!dispatch) {
    throw new Error("Cannot find UsersProvider");
  }

  return dispatch;
}

// dispatch를 파라미터로 받아오고 API에 필요한 파라미터도 받기
export const getUsers = createAsyncDispatcher("GET_USERS", api.getUsers);
export const getUser = createAsyncDispatcher("GET_USER", api.getUser);

// export async function getUsers(dispatch) {
//   dispatch({ type: "GET_USERS" });

//   try {
//     const response = await axios.get(
//       "https://jsonplaceholder.typicode.com/users"
//     );
//     dispatch({ type: "GET_USERS_SUCCESS", data: response.data });
//   } catch (e) {
//     dispatch({ type: "GET_USERS_ERROR", error: e });
//   }
// }

// export async function getUser(dispatch, id) {
//   dispatch({ type: "GET_USER" });

//   try {
//     const response = await axios.get(
//       `https://jsonplaceholder.typicode.com/users/${id}`
//     );
//     dispatch({ type: "GET_USER_SUCCESS", data: response.data });
//   } catch (e) {
//     dispatch({ type: "GET_USER_ERROR", error: e });
//   }
// }
