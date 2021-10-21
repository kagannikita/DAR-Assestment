import { AppDispatch, RootState, store } from '../rendering/store';
import { API_URL, HeaderJSON } from '../constants/API';

export interface IRegister {
  username: string;
  password: string;
  password2: string;
}

export interface ILogin {
  username: string;
  password: string;
  token?: string;
}

export interface IToken {
  token: string;
}

export class UserAPI {
  private readonly API: string;

  public state: RootState;

  readonly dispatch: AppDispatch;

  constructor() {
    this.API = API_URL.USER;
    this.state = store.getState();
    this.dispatch = store.dispatch;
    store.subscribe(() => {
      this.state = store.getState();
    });
  }

  setCookie(cName: string, cValue: string, expDays: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
  }

  getCookie(cName: string): string {
    const name = `${cName}=`;
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res = '';
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }

  eraseCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  }

  async register(record: IRegister): Promise<void> {
    const response = await fetch(this.API + API_URL.ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: HeaderJSON,
      body: JSON.stringify(record),
    });
    if (response.status === 400) {
      response.json().then((res) => alert(res.message));
    } else {
      alert('Registration complete');
    }
  }

  async login(record: ILogin): Promise<number> {
    const response = await fetch(this.API + API_URL.ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: HeaderJSON,
      body: JSON.stringify(record),
    });
    if (response.status === 200) {
      const answer: IToken = await response.json();
      this.setCookie('token', answer.token, 30);
    }
    if (response.status === 401) {
      response.json().then((res) => alert(res.message));
    }
    return response.status;
  }
}
