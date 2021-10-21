import { AppDispatch, RootState, store } from '../rendering/store';
import { ICard } from './CardsAPI';

interface FunctionLS {
  (): number;
}
export default interface IStatistic {
  category: string;
  word: string;
  translation: string;
  clicks: number;
  correct: number;
  wrong: number;
  percent: number;
}

export class LocalStorageStatistic {
  public state: RootState;

  readonly dispatch: AppDispatch;

  public cards: ICard[];

  constructor() {
    this.state = store.getState();
    this.dispatch = store.dispatch;
    store.subscribe(() => {
      this.state = store.getState();
    });
    this.cards = this.state.cards as ICard[];
  }

  public createStorage(reset: boolean, newCard: ICard | null): void {
    if (newCard !== null) {
      const wordStat: IStatistic = {
        category: newCard.category.name,
        word: newCard.word,
        translation: newCard.translation,
        clicks: 0,
        correct: 0,
        wrong: 0,
        percent: 0,
      };
      window.localStorage.setItem(newCard.word, JSON.stringify(wordStat));
    } else {
      this.cards.forEach((card) => {
        const wordStat: IStatistic = {
          category: card.category.name,
          word: card.word,
          translation: card.translation,
          clicks: 0,
          correct: 0,
          wrong: 0,
          percent: 0,
        };
        if (window.localStorage.getItem(card.word) === null || reset) {
          window.localStorage.setItem(card.word, JSON.stringify(wordStat));
        }
      });
    }
  }

  public async getFromStorage(): Promise<Array<IStatistic>> {
    const res: Array<IStatistic> = [];
    this.cards.forEach((card) => {
      if (window.localStorage.getItem(card.word) !== null) {
        res.push(JSON.parse(<string>window.localStorage.getItem(card.word)));
      }
    });
    return res;
  }

  public getRepeatCards(): Array<ICard> {
    const res: Array<ICard> = [];
    const diffWordsFromStatistic = this.state.statistics.filter((diffWord) => diffWord.percent > 0
      && diffWord.percent < 100).sort(this.dynamicSort('percent'));
    const diffWords = diffWordsFromStatistic.slice(0, 8).map((diffWord) => diffWord.word);
    this.cards
      .filter((card) => diffWords.includes(card.word))
      .map((card) => {
        res.push(card);
        return card;
      });
    return res;
  }

  public async addToStorage(word: string, clicks: number, correct: number, wrong: number): Promise<void> {
    const wordStat: IStatistic = JSON.parse(window.localStorage.getItem(word)!);
    const formula = +(((wordStat.correct + correct) / (wordStat.wrong + wrong + (wordStat.correct + correct))) * 100).toFixed(2);
    const res: IStatistic = {
      category: wordStat.category,
      word: wordStat.word,
      translation: wordStat.translation,
      clicks: wordStat.clicks + clicks,
      correct: wordStat.correct + correct,
      wrong: wordStat.wrong + wrong,
      percent: clicks > 0 && wordStat.wrong === 0 && wordStat.correct === 0 ? 0 : formula,
    };
    window.localStorage.setItem(word, JSON.stringify(res));
  }

  public removeStatistic(category: string | null, card: string | null): void {
    if (card !== null) {
      window.localStorage.removeItem(card);
    }
    if (category !== null) {
      this.cards
        .filter((cards) => cards.category._id === category)
        .forEach((cards) => {
          window.localStorage.removeItem(cards.word);
        });
    }
  }

  public updateStorage(oldWord: string, card: ICard): void {
    const wordStat: IStatistic = JSON.parse(window.localStorage.getItem(oldWord)!);
    const res: IStatistic = {
      category: card.category.name,
      word: card.word,
      translation: card.translation,
      clicks: wordStat.clicks,
      correct: wordStat.correct,
      wrong: wordStat.wrong,
      percent: wordStat.percent,
    };
    window.localStorage.removeItem(oldWord);
    window.localStorage.setItem(card.word, JSON.stringify(res));
  }

  public dynamicSort(property: string): FunctionLS {
    let sortOrder = 1;
    let propertySort = property;
    if (property[0] === '-') {
      sortOrder = -1;
      propertySort = property.substr(1);
    }
    const res = (a: { [key: string]: number[] }, b: { [key: string]: number[] }) => {
      const cond = a[propertySort] > b[propertySort] ? 1 : 0;
      const result = a[propertySort] < b[propertySort] ? -1 : cond;
      return result * sortOrder;
    };
    return <FunctionLS>res;
  }
}
