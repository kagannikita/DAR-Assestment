import { AppDispatch, RootState, store } from '../rendering/store';
import { API_URL } from '../constants/API';
import { setLoading } from '../store/preloader';

export interface ACategory {
  categories: Array<ICategory>;
}
export interface OCategory {
  category: ICategory;
}
export interface ICategory {
  _id?: string;
  name: string;
  image: string | File;
}

export class CategoryAPI {
  private readonly API: string;

  public state: RootState;

  readonly dispatch: AppDispatch;

  constructor() {
    this.API = API_URL.CATEGORIES;
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

  async retrieveRecord(id: string): Promise<OCategory> {
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
