// 이 함수는 파라미터로 액션의 타입과 Promise를 만들어주는 함수
export function createAsyncDispatcher(type, promiseFn) {
  // 성공, 실패에 대한 액션 타입 문자열 준비
  const SUCCESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  // ...rest를 사용하여 나머지 파라미터를 reat 배열에 담는다
  async function actionHandler(dispatch, ...rest) {
    dispatch({ type }); //요청 시작

    try {
      const data = await promiseFn(...rest);

      dispatch({
        type: SUCCESS,
        data,
      });
    } catch (e) {
      dispatch({
        type: ERROR,
        error: e,
      });
    }
  }

  return actionHandler; // 함수반환
}

// 기본값
export const initialAsyncState = {
  loading: false,
  data: null,
  error: null,
};

// 로딩중일때 바뀔 상태 객체
const loadingState = {
  loading: true,
  data: null,
  error: null,
};

// 성공했을 때의 상태 만들어주는 함수
const success = (data) => ({
  loading: false,
  data,
  error: null,
});

// 실패했을 때의 상태 만들어주는 함수
const error = (error) => ({
  loading: false,
  data: null,
  error: error,
});

// type은 액션타입, key는 리듀서서 사용할 필드이름 (예 : user, users)
export function createAsyncHandler(type, key) {
  const SUCEESS = `${type}_SUCCESS`;
  const ERROR = `${type}_ERROR`;

  function handler(state, action) {
    switch (action.type) {
      case type:
        return {
          ...state,
          [key]: loadingState,
        };
      case SUCEESS:
        return {
          ...state,
          [key]: success(action.data),
        };
      case ERROR:
        return {
          ...state,
          [key]: error(action.error),
        };
      default:
        return state;
    }
  }

  return handler;
}
