import { LocalStorageStatistic } from '../shared/api/LocalStorageStatistics';
import { Component } from '../shared/rendering/Component';
import { MapAndJoin } from '../shared/rendering/templating';
import { listenDelegated } from '../shared/rendering/listenDelegated';

export class Statistics extends Component {
  private statisticStorage: LocalStorageStatistic;

  template(): string {
    return `<div class="statistic-container">
    <div class="statistic-buttons">
    <button id="reset" ref="reset" class="reset_btn">Reset</button>
    <button id="repeat" ref="repeat" class="repeat_btn">Repeat difficult words</button>
    </div>
    <table class="statistic-table">
    <tr class="statistic_row head">
    <td ref="word" id="word" class="statistic_data sortable">Word</td>
    <td ref="translation" id="translation" class="statistic_data sortable">Translation</td>
    <td ref="category" id="category" class="statistic_data sortable">Category</td>
    <td ref="clicks" id="clicks" class="statistic_data sortable">Clicks</td>
    <td ref="correct" id="correct" class="statistic_data sortable">Correct</td>
    <td ref="wrong" id="wrong" class="statistic_data sortable">Wrong</td>
    <td ref="percent" id="percent" class="statistic_data sortable">% errors</td>
    </tr>
     ${MapAndJoin(
    this.state.statistics,
    (statistics) => `<tr class="statistic_row">
    <td class="statistic_data">${statistics.word}</td>
    <td class="statistic_data">${statistics.translation}</td>
    <td class="statistic_data">${statistics.category}</td>
    <td class="statistic_data">${statistics.clicks}</td>
    <td class="statistic_data">${statistics.correct}</td>
    <td class="statistic_data">${statistics.wrong}</td>
    <td class="statistic_data">${statistics.percent}</td>
    </tr>`,
  )}
   </table></div>`;
  }

  sortData(sort: string): void {
    if (this.state.sorting.sort === '' || this.state.sorting.sort === 'DESC') {
      const sortASC = this.state.statistics.sort(this.statisticStorage.dynamicSort(sort));
      this.quickDispatch('@statistics/set', sortASC);
      this.quickDispatch('sorting', 'ASC');
      this.element.innerHTML = this.template();
      document.getElementById(sort)!.append('↓');
    } else if (this.state.sorting.sort === 'ASC') {
      const sortDESC = this.state.statistics.sort(this.statisticStorage.dynamicSort(`-${sort}`));
      this.quickDispatch('@statistics/set', sortDESC);
      this.quickDispatch('sorting', 'DESC');
      this.element.innerHTML = this.template();
      document.getElementById(sort)!.append('↑');
    }
  }

  init(): void {
    this.statisticStorage = new LocalStorageStatistic();
    listenDelegated(this.element, 'click', '#repeat', async () => {
      window.location.hash = '#repeat';
    });
    const fields = ['word', 'translation', 'category', 'clicks', 'correct', 'wrong', 'percent'];
    fields.forEach((field) => {
      listenDelegated(this.element, 'click', `#${field}`, async () => {
        this.sortData(field);
      });
    });

    listenDelegated(this.element, 'click', '#reset', async () => {
      this.statisticStorage.createStorage(true, null);
      this.quickDispatch('@statistics/set', await this.statisticStorage.getFromStorage());
      this.element.innerHTML = this.template();
    });
  }
}
