import { AppDispatch, RootState, store } from '../rendering/store';
import { API_URL } from '../constants/API';
import { setLoading } from '../store/preloader';
import { ICategory } from './CategoryAPI';

export interface ACard {
  cards: Array<ICard>;
}

export interface OCard {
  card: ICard;
}

export interface ICard {
  _id: string;
  word: string;
  translation: string;
  category: ICategory;
  image: string;
  audio: string;
}

export class CardsAPI {
  private readonly API: string;

  public state: RootState;

  readonly dispatch: AppDispatch;

  constructor() {
    this.API = API_URL.CARDS;
    this.state = store.getState();
    this.dispatch = store.dispatch;
    store.subscribe(() => {
      this.state = store.getState();
    });
  }

  async getList(): Promise<Response> {
    this.dispatch(setLoading(true));
    return fetch(this.API + API_URL.ENDPOINTS.GET).finally(() => this.dispatch(setLoading(false)));
  }

  async retrieveRecord(id: string): Promise<OCard> {
    const response = await fetch(this.API + API_URL.ENDPOINTS.GET + id);
    return response.json();
  }

  async addRecord(record: FormData): Promise<void> {
    return fetch(this.API + API_URL.ENDPOINTS.CREATE, {
      method: 'POST',
      body: record,
    }).then((res) => {
      res.json();
    });
  }

  async deleteRecord(id: string): Promise<void> {
    fetch(this.API + API_URL.ENDPOINTS.DELETE + id, {
      method: 'DELETE',
    }).then((res) => res.text());
  }

  async updateRecord(record: FormData, id: string): Promise<void> {
    fetch(this.API + API_URL.ENDPOINTS.UPDATE + id, {
      method: 'PUT',
      body: record,
    }).then((res) => res.json());
  }
}
