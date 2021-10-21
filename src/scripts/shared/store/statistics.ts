import IStatistic from '../api/LocalStorageStatistics';

export const setStatistics = (statistics: IStatistic[]): { payload: IStatistic[]; type: string } => ({
  type: '@statistics/set',
  payload: statistics,
});

type Actions = ReturnType<typeof setStatistics>;

export const statistics = (state: IStatistic[] = [], action: Actions): IStatistic[] => {
  if (action.type === '@statistics/set') return action.payload;
  return state;
};
