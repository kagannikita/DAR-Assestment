import { Component } from '../shared/rendering/Component';
import { CardsAPI, ICard } from '../shared/api/CardsAPI';
import { MapAndJoin } from '../shared/rendering/templating';
import { UserAPI } from '../shared/api/UserAPI';
import { getCards } from '../shared/api/cards';
import { LocalStorageStatistic } from '../shared/api/LocalStorageStatistics';
import { listenDelegated } from '../shared/rendering/listenDelegated';
import { addCard, deleteCard, putCard } from '../shared/store/cards';

const cardsAPI = new CardsAPI();
const statisticLS = new LocalStorageStatistic();
const userApi = new UserAPI();
export class AdminWords extends Component {
  private cards: ICard[];

  template(): string {
    return `
        <div class="word-container">
        ${this.setCards()}
      </div>
    `;
  }

  setCards(): string {
    const cards = this.state.cards as ICard[];
    this.cards = cards.filter((card) => `#admin/category/${card.category._id}/words` === window.location.hash);
    return `${MapAndJoin(
      this.cards.slice(0, 4),
      (card) => `
   <div class="card-word"  data-id="${card._id}">
   <p class="word-field"> <span class="words-bold">
          Word:</span> ${card.word}
        </p>
           <p class="word-field"> <span class="words-bold">
          Translation:</span> ${card.translation}
        </p>
        <p class="words-sound">
        <span class="words-bold">Play sound:</span> 
        <span class="words-play-sound"  data-id="${card._id}"></span>
      </p>
      <img class="words-image" src="${card.image}" alt="card-img">
      <button data-id="${card._id}" class="words-btn-change">Change</button>
      <span data-id="${card._id}" class="words-bnt-remove"></span>
            </div>
          `,
    )}`;
  }

  createForm(): string {
    return `<div class="word-top-layer">
    <input type="text" placeholder="Word" class="word-top-layer-input-word">
    <input type="text" placeholder="Translation" class="word-top-layer-input-translation">
    <div class="word-top-layer-sound-wrapper">
    <span class="word-top-layer-sound-text">Sound:</span>
    <div class="word-top-layer-sound-wrapper-input">
    <input class="word-top-layer-sound-input" type="file">
    <span class="word-top-layer-sound-btn">Select file</span>
    </div></div>
    <div class="word-top-layer-image-wrapper">
    <span class="word-top-layer-image-text">Image:</span>
    <div class="word-top-layer-image-wrapper-input">
    <input class="word-top-layer-image-input" type="file">
    <span class="word-top-layer-image-btn">Select file</span>
    </div></div>
    <div class="word-top-layer-btns">
    <button class="word-top-layer-btn-cancel">Cancel</button>
    <button class="word-top-layer-btn-create">Create</button>
    </div></div>`;
  }

  defaultCreate(): string {
    return '<p class="words-name words-name-new">Create new Card</p>';
  }

  playAudio(src: string): void {
    const audio = new Audio(src);
    audio.play();
  }

  defaultCards(card: ICard): string {
    return `<p class="word-field"> <span class="words-bold">
          Word:</span> ${card.word}
        </p>
           <p class="word-field"> <span class="words-bold">
          Translation:</span> ${card.translation}
        </p>
        <p class="words-sound">
        <span  class="words-bold">Play sound:</span> 
        <span class="words-play-sound"  data-id="${card._id}"></span>
      </p>
      <img class="words-image" src="${card.image}" alt="card-img">
      <button data-id="${card._id}" class="words-btn-change">Change</button>
      <span data-id="${card._id}" class="words-bnt-remove"></span>
            `;
  }

  createNewCard(): HTMLElement {
    const newCard = document.createElement('div');
    newCard.classList.add('card-word');
    newCard.classList.add('words-card-new');
    newCard.classList.add('words-hidden');
    newCard.innerHTML = '<p class="words-name words-name-new">Create new Card</p>';
    return newCard;
  }

  updateForm(id: string): string {
    return `<div class="word-top-layer">
    <input type="text" placeholder="Word" class="word-top-layer-input-word">
    <input type="text" placeholder="Translation" class="word-top-layer-input-translation">
    <div class="word-top-layer-sound-wrapper">
    <span class="word-top-layer-sound-text">Sound:</span>
    <div class="word-top-layer-sound-wrapper-input">
    <input class="word-top-layer-sound-input" type="file">
    <span class="word-top-layer-sound-btn">Select file</span>
    </div></div>
    <div class="word-top-layer-image-wrapper">
    <span class="word-top-layer-image-text">Image:</span>
    <div class="word-top-layer-image-wrapper-input">
    <input class="word-top-layer-image-input" type="file">
    <span class="word-top-layer-image-btn">Select file</span>
    </div></div>
    <div class="word-top-layer-btns">
    <button data-id="${id}" class="word-top-layer-update-btn-cancel">Cancel</button>
    <button data-id="${id}" class="word-top-layer-btn-update">Update</button>
    </div></div>`;
  }

  createCards(): HTMLElement[] {
    const newCards = this.cards.slice(4);
    const template = newCards.map((newCard) => {
      const newEl = document.createElement('div');
      newEl.classList.add('card-word');
      newEl.setAttribute('data-id', newCard._id!);
      newEl.innerHTML = `   <p class="word-field"> <span class="words-bold">
          Word:</span> ${newCard.word}
        </p>
           <p class="word-field"> <span class="words-bold">
          Translation:</span> ${newCard.translation}
        </p>
        <p class="words-sound">
        <span class="words-bold">Play sound:</span> 
        <span class="words-play-sound"  data-id="${newCard._id}"></span>
      </p>
      <img class="words-image" src="${newCard.image}" alt="card-img">
      <button data-id="${newCard._id}" class="words-btn-change">Change</button>
      <span data-id="${newCard._id}" class="words-bnt-remove"></span>`;
      return newEl;
    });

    return template;
  }

  validateFields(word: string, translation: string, image: File, audio: File): boolean {
    if (image === undefined || audio === undefined) {
      alert('Выберите пожалуйста картинку или аудио');
      return false;
    }
    return word !== '' && translation !== '' && /\.(jpe?g|png)$/i.test(image.name) && /\.(mp3)$/i.test(audio.name);
  }

  init(): void {
    if (this.cards.length <= 4) {
      this.element.appendChild(this.createNewCard());
    }
    if (userApi.getCookie('token') === '') window.location.hash = '#main';
    listenDelegated(this.element, 'click', '.words-play-sound', async (e) => {
      const audioId = e.delegateTarget.dataset.id!;
      const audio = await cardsAPI.retrieveRecord(audioId).then((data) => data.card.audio);
      this.playAudio(audio);
    });
    listenDelegated(this.element, 'click', '.words-hidden', () => {
      document.querySelector('.words-card-new')!.innerHTML = this.createForm();
      document.querySelector('.words-card-new')!.classList.remove('words-hidden');
    });
    listenDelegated(this.element, 'click', '.word-top-layer-btn-cancel', () => {
      document.querySelector('.words-card-new')!.innerHTML = this.defaultCreate();
      document.querySelector('.words-card-new')!.classList.add('words-hidden');
    });
    listenDelegated(this.element, 'click', '.word-top-layer-btn-create', () => {
      const word = document.querySelector('.word-top-layer-input-word') as HTMLInputElement;
      const translation = document.querySelector('.word-top-layer-input-translation') as HTMLInputElement;
      const image = document.querySelector('.word-top-layer-image-input') as HTMLInputElement;
      const audio = document.querySelector('.word-top-layer-sound-input') as HTMLInputElement;
      if (!this.validateFields(word.value, translation.value, image.files![0], audio.files![0])) {
        alert('Поля word и translate должны быть заполнены и image должен быть картинкой и audio должен быть музыкой');
      } else if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        const formData = new FormData();
        const categoryId = window.location.hash.slice(16).replace('/words', '');
        formData.set('word', word.value);
        formData.set('translation', translation.value);
        formData.set('category', categoryId);
        formData.append('image', image.files![0]);
        formData.append('audio', audio.files![0]);
        cardsAPI.addRecord(formData).then(async () => {
          const lastData = await getCards().then((data) => data.cards.slice(-1)[0]);
          this.dispatch(addCard(lastData));
          statisticLS.createStorage(false, lastData);
        });
        this.element.appendChild(this.createNewCard());
      }
    });
    listenDelegated(this.element, 'click', '.words-bnt-remove', async (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        await cardsAPI.deleteRecord(cardId);
        this.dispatch(deleteCard(cardId));
        statisticLS.removeStatistic(cardId, null);
      }
    });
    listenDelegated(this.element, 'click', '.words-btn-change', async (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      document.querySelector(`.card-word[data-id="${cardId}"]`)!.innerHTML = this.updateForm(cardId);
    });
    listenDelegated(this.element, 'click', '.word-top-layer-update-btn-cancel', (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      cardsAPI.retrieveRecord(cardId).then((card) => {
        document.querySelector(`.card-word[data-id="${cardId}"]`)!.innerHTML = this.defaultCards(card.card);
      });
    });
    listenDelegated(this.element, 'click', '.word-top-layer-btn-update', async (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      const word = document.querySelector('.word-top-layer-input-word') as HTMLInputElement;
      const translation = document.querySelector('.word-top-layer-input-translation') as HTMLInputElement;
      const image = document.querySelector('.word-top-layer-image-input') as HTMLInputElement;
      const audio = document.querySelector('.word-top-layer-sound-input') as HTMLInputElement;
      const oldName = cardsAPI.retrieveRecord(cardId).then((old) => old.card.word);
      if (!this.validateFields(word.value, translation.value, image.files![0], audio.files![0])) {
        alert('Поля word и translate должны быть заполнены и image должен быть картинкой и audio должен быть музыкой');
      } else if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        const formData = new FormData();
        formData.set('word', word.value);
        formData.set('translation', translation.value);
        formData.append('image', image.files![0]);
        formData.append('audio', audio.files![0]);
        await cardsAPI.updateRecord(formData, cardId);
        setTimeout(async () => {
          cardsAPI.retrieveRecord(cardId).then(async (cards) => {
            this.dispatch(putCard(cards.card));
            statisticLS.updateStorage(await oldName, cards.card);
          });
        }, 5000);
      }
    });
    window.onscroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      const cardsCount = document.querySelectorAll('.card-word').length;
      if (scrollTop + clientHeight > scrollHeight - 1) {
        this.createCards().forEach((el) => {
          if (cardsCount < this.cards.length) this.element.appendChild(el);
        });
        if (document.querySelector('.words-card-new') == null && cardsCount === this.cards.length) {
          this.element.appendChild(this.createNewCard());
        }
      }
    };
  }

  update(): void {
    const container = document.querySelector('.word-container');
    if (container !== null) {
      container.innerHTML = `${this.setCards()}`;
    }
  }
}
