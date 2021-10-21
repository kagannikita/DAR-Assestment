import { ACard, ICard } from '../api/CardsAPI';

export const setCards = (cards: ACard): { payload: Array<ICard>; type: string } => ({
  type: '@cards/set',
  payload: cards.cards,
});
export const deleteCard = (cardId: string): { payload: string; type: string } => ({
  type: '@cards/delete',
  payload: cardId,
});

export const addCard = (card: ICard): { payload: ICard; type: string } => ({
  type: '@cards/add',
  payload: card,
});

export const putCard = (card: ICard): { payload: ICard; type: string } => ({
  type: '@cards/put',
  payload: card,
});
type Actions = ReturnType<typeof setCards | typeof deleteCard | typeof addCard | typeof putCard>;

export const cards = (state: ACard['cards'] = [], action: Actions): ICard[] | string | ICard => {
  if (action.type === '@cards/set') return action.payload;
  if (action.type === '@cards/delete') {
    const cardIndex = action.payload;
    return state.filter((data) => data._id !== cardIndex);
  }
  if (action.type === '@cards/add') {
    const data = action.payload as ICard;
    return state.concat(data);
  }
  if (action.type === '@cards/put') {
    const data = action.payload as ICard;
    return state.map((item) => {
      if (item._id === data._id) {
        return {
          ...item,
          word: data.word,
          translation: data.translation,
          image: data.image,
          audio: data.audio,
        };
      }
      return item;
    });
  }
  return state;
};
