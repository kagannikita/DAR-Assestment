export const defaultState = {
  loading: true,
};

export const setLoading = (state: boolean): { payload: boolean; type: string } => ({
  type: '@preloader/setLoading',
  payload: state,
});

type Actions = ReturnType<typeof setLoading>;

export const preloader = (state = defaultState, action: Actions): { loading: boolean } => {
  if (action.type === '@preloader/setLoading') return { ...state, loading: action.payload };
  return state;
};
