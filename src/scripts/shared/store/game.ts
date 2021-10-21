const initialState = {
  learningMode: false,
};

export const setLearningMode = (state: boolean): { payload: boolean; type: string } => ({
  type: '@game/setLearningState',
  payload: state,
});

type Actions = ReturnType<typeof setLearningMode>;

export const game = (state = initialState, action: Actions): { learningMode: boolean } => {
  if (action.type === 'setLearningMode') {
    return {
      ...state,
      learningMode: action.payload,
    };
  }
  return state;
};
