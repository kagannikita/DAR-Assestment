import { Component } from '../shared/rendering/Component';
import { IfStateCSS, MapAndJoin } from '../shared/rendering/templating';
import { ICategory } from '../shared/api/CategoryAPI';

export class MainPage extends Component {
  template(): string {
    const categories = this.state.categories as ICategory[];
    return `
     <div id="page">
      <div class="container main-component">
      ${MapAndJoin(
    categories,
    (category) => `
        <a 
        class="card_item ${IfStateCSS('green', this.state.game.learningMode)}" 
        collection=cards 
        href="#${category._id}">
          ${category.name}
          <img class="card_img" src="${category.image}" alt='img'>
        </a>
      `,
  )}
      </div>
      </div>
    `;
  }

  async update(): Promise<void> {
    this.collections.cards.forEach((card) => card.classList.toggle('green', this.state.game.learningMode));
  }
}
