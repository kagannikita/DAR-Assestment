const initialState = {
  sort: '',
};

export const setSorting = (state: string): { payload: string; type: string } => ({
  type: '@sort/sorting',
  payload: state,
});

type Actions = ReturnType<typeof setSorting>;

export const sorting = (state = initialState, action: Actions): { sort: string } => {
  if (action.type === 'sorting') {
    return {
      ...state,
      sort: action.payload,
    };
  }
  return state;
};
