import { Component } from '../rendering/Component';
import { getCards } from '../api/cards';
import { Game } from '../../pages/Game';
import { MainPage } from '../../pages/MainPage';
import { Page404 } from '../../pages/Page404';
import { Statistics } from '../../pages/Statistics';
import { AdminPanel } from '../../pages/AdminPanel';
import { AdminWords } from '../../pages/AdminWords';
import { ICategory } from '../api/CategoryAPI';

export class Router extends Component {
  template(): string {
    return '<div></div>';
  }

  resolveGamePageRoute(id: string): void {
    const categories = this.state.categories as ICategory[];
    const route = categories.find((category) => category._id === id);
    if (route) {
      getCards(route._id).then(async () => {
        new Game(this.element);
      });
    } else new Page404(this.element);
  }

  resolveAdminPageRoute(id: string): void {
    const categories = this.state.categories as ICategory[];
    const route = categories.find((category) => category._id === id);
    if (route) {
      getCards(route._id).then(async () => {
        new AdminWords(this.element);
      });
    } else new Page404(this.element);
  }

  async route(): Promise<void> {
    if (window.location.hash === '') {
      window.location.hash = '#main';
    }

    if (window.location.hash === '#main') {
      new MainPage(this.element);
    } else if (window.location.hash === '#statistic') {
      new Statistics(this.element);
    } else if (window.location.hash === '#repeat') {
      new Game(this.element);
    } else if (window.location.hash === '#admin/#category') {
      new AdminPanel(this.element);
    } else if (window.location.hash.includes('words')) {
      this.resolveAdminPageRoute(window.location.hash.slice(16).replace('/words', ''));
    } else {
      this.resolveGamePageRoute(window.location.hash.slice(1));
    }
    this.quickDispatch('router', window.location.hash);
  }

  init(): void {
    this.route();
    window.addEventListener('hashchange', () => this.route());
  }
}
