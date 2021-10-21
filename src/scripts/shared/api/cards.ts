import { ACard, CardsAPI } from './CardsAPI';

const cardsAPI = new CardsAPI();
export const getCards = async (id?: string): Promise<ACard> => cardsAPI.getList().then((response) => response.json());
