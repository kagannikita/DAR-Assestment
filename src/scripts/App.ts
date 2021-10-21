import { Component } from './shared/rendering/Component';
import { Header } from './shared/components/Header';
import { Router } from './shared/components/Router';
import { setCategories } from './shared/store/categories';
import { getCategories } from './shared/api/categories';
import { getCards } from './shared/api/cards';
import { setCards } from './shared/store/cards';
import { LocalStorageStatistic } from './shared/api/LocalStorageStatistics';
import { setStatistics } from './shared/store/statistics';
import { Footer } from './shared/components/Footer';
import { LoginForm } from './shared/components/LoginForm';
import { ICategory } from './shared/api/CategoryAPI';
import { ICard } from './shared/api/CardsAPI';

export class App extends Component {
  loaded = false;

  template(): string {
    return `
      <div id="app">
      <div class="overlay">
        <div ref="header"></div>
        <div ref="loading" class="loading">Loading...</div>
        <div class="form" ref="form"></div>
        <div ref="router"></div>
        <div ref="footer"></div>
      </div>
      </div>
    `;
  }

  async init(): Promise<void> {
    const subject = document.createElement('div');
    subject.classList.add('subject');
    document.body.appendChild(subject);
    this.dispatch(setCategories(await getCategories()));
    this.dispatch(setCards(await getCards()));
    const stats = new LocalStorageStatistic();
    stats.createStorage(false, null);
    this.dispatch(setStatistics(await stats.getFromStorage()));
  }

  async update(): Promise<void> {
    const categories = this.state.categories as ICategory[];
    const cards = this.state.cards as ICard[];
    if (!this.state.preloader.loading && cards.length && this.state.statistics.length && categories.length) {
      if (!this.loaded) {
        this.loaded = true;
        new Header(this.refs.header);
        new LoginForm(this.refs.form);
        new Router(this.refs.router);
        new Footer(this.refs.footer);
      }
    }
    this.refs.loading.style.display = this.state.preloader.loading ? 'flex' : 'none';
  }
}
