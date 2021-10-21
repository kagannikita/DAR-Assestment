const initialState = {
  changeRoute: window.location.hash,
};

export const setRoute = (state: string): { payload: string; type: string } => ({
  type: '@route/router',
  payload: state,
});

type Actions = ReturnType<typeof setRoute>;

export const routing = (state = initialState, action: Actions): { changeRoute: string } => {
  if (action.type === 'router') {
    return {
      ...state,
      changeRoute: action.payload,
    };
  }
  return state;
};
