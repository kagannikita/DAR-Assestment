import { Component } from '../shared/rendering/Component';
import { UserAPI } from '../shared/api/UserAPI';
import { MapAndJoin } from '../shared/rendering/templating';
import { CategoryAPI, ICategory } from '../shared/api/CategoryAPI';
import { getCategories } from '../shared/api/categories';
import { LocalStorageStatistic } from '../shared/api/LocalStorageStatistics';
import { listenDelegated } from '../shared/rendering/listenDelegated';
import { addCategory, deleteCategory, putCategory } from '../shared/store/categories';
import { ICard } from '../shared/api/CardsAPI';

const categoryAPI = new CategoryAPI();
const statisticLS = new LocalStorageStatistic();
const userApi = new UserAPI();
export class AdminPanel extends Component {
  template(): string {
    return `
          <div class="admin-container">
        ${this.setCards()}
</div>`;
  }

  setCards(): string {
    const cards = this.state.cards as ICard[];
    const categories = this.state.categories as ICategory[];
    return ` ${MapAndJoin(
      categories.slice(0, 4),
      (category) => `
        <div class="category-card" data-id="${category._id}">
    <p class="category-name">${category.name}</p> 
      <p class="category-count">
    <span class="category-words">WORDS:</span> 
    ${cards.filter((card) => card.category._id === category._id).length}
    </p>
    <div class="category-btns">
    <button  data-id="${category._id}" class="category-btn-update">Update</button>
      <a  href="#admin/category/${category._id}/words" class="category-btn-add">Add word</a>
    </div>
    <span data-id="${category._id}" class="category-btn-remove"></span>
      </div>
        `,
    )}`;
  }

  defaultCards(category: ICategory): string {
    const cards = this.state.cards as ICard[];
    return ` <p class="category-name">${category.name}</p> 
         <p class="category-count">
        <span class="category-words">WORDS:</span> 
        ${cards.filter((card) => card.category._id === category._id).length}
      </p>
         <div class="category-btns">
         <button  data-id="${category._id}" class="category-btn-update">Update</button>
         <a  href="#admin/category/${category._id}/words" class="category-btn-add">Add word</a>
         </div>
         <span data-id="${category._id}" class="category-btn-remove"></span>`;
  }

  updateForm(id: string): string {
    return `<div class="category-top-layer">
          <input type="text" placeholder="Category name" class="category-top-layer-input">
          <div class="category-top-layer-image-wrapper-input">
          <input class="category-top-layer-image-input" type="file">
          <span class="category-top-layer-image-btn">Select file</span>
          </div>
          <div class="category-top-layer-btns">
          <button data-id="${id}" class="category-top-layer-update-btn-cancel">Cancel</button>
          <button data-id="${id}" class="category-top-layer-btn-update">Update</button>
          </div>
          </div>`;
  }

  createNewCard(): HTMLElement {
    const newCard = document.createElement('div');
    newCard.classList.add('category-card');
    newCard.classList.add('category-card-new');
    newCard.classList.add('category-hidden');
    newCard.innerHTML = '<p class="category-name category-name-new">Create new Category</p>';
    return newCard;
  }

  defaultCreate(): string {
    return '<p class="category-name category-name-new">Create new Category</p>';
  }

  createForm(): string {
    return `<div class="category-top-layer">
    <input type="text" placeholder="Category name" class="category-top-layer-input">
    <div class="category-top-layer-image-wrapper-input">
    <input class="category-top-layer-image-input" type="file">
    <span class="category-top-layer-image-btn">Select file</span>
    </div>
    <div class="category-top-layer-btns">
    <button class="category-top-layer-btn-cancel">Cancel</button>
    <button class="category-top-layer-btn-create">Create</button>
    </div>
    </div>`;
  }

  createCards(): HTMLElement[] {
    const cards = this.state.cards as ICard[];
    const categories = this.state.categories as ICategory[];
    const newCards = categories.slice(4);
    const template = newCards.map((newCard) => {
      const newEl = document.createElement('div');
      newEl.classList.add('category-card');
      newEl.setAttribute('data-id', newCard._id!);
      newEl.innerHTML = `<p class="category-name">${newCard.name}</p> 
         <p class="category-count">
        <span class="category-words">WORDS:</span> 
        ${cards.filter((card) => card.category._id === newCard._id).length}
      </p>
         <div class="category-btns">
         <button data-id="${newCard._id}" class="category-btn-update">Update</button>
         <a href="#admin/category/${newCard._id}/words" class="category-btn-add">Add word</a>
         </div>
         <span data-id="${newCard._id}" class="category-btn-remove"></span>`;
      return newEl;
    });

    return template;
  }

  validateFields(name: string, image: File): boolean {
    if (image === undefined) {
      alert('Выберите пожалуйста картинку');
      return false;
    }
    return name !== '' && /\.(jpe?g|png)$/i.test(image.name);
  }

  init(): void {
    if (userApi.getCookie('token') === '') window.location.hash = '#main';
    listenDelegated(this.element, 'click', '.category-hidden', () => {
      document.querySelector('.category-card-new')!.innerHTML = this.createForm();
      document.querySelector('.category-card-new')!.classList.remove('category-hidden');
    });
    listenDelegated(this.element, 'click', '.category-top-layer-btn-cancel', () => {
      document.querySelector('.category-card-new')!.innerHTML = this.defaultCreate();
      document.querySelector('.category-card-new')!.classList.add('category-hidden');
    });
    listenDelegated(this.element, 'click', '.category-top-layer-btn-create', () => {
      const name = this.element.querySelector('.category-top-layer-input') as HTMLInputElement;
      const image = this.element.querySelector('.category-top-layer-image-input') as HTMLInputElement;
      if (!this.validateFields(name.value, image.files![0])) {
        alert('Ошибки валидации проверьте чтобы поле name не было пустым и image был картинкой');
      } else if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        const formData = new FormData();
        formData.set('name', name.value);
        formData.append('image', image.files![0]);
        categoryAPI.addRecord(formData).then(async () => {
          const lastData = await getCategories().then((data) => data.categories.slice(-1)[0]);
          this.dispatch(addCategory(lastData));
        });
        this.element.appendChild(this.createNewCard());
      }
    });
    listenDelegated(this.element, 'click', '.category-btn-remove', async (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        await categoryAPI.deleteRecord(cardId);
        this.dispatch(deleteCategory(cardId));
        statisticLS.removeStatistic(cardId, null);
      }
    });

    listenDelegated(this.element, 'click', '.category-btn-update', (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      document.querySelector(`.category-card[data-id="${cardId}"]`)!.innerHTML = this.updateForm(cardId);
    });
    listenDelegated(this.element, 'click', '.category-top-layer-update-btn-cancel', (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      categoryAPI.retrieveRecord(cardId).then((category) => {
        document.querySelector(`.category-card[data-id="${cardId}"]`)!.innerHTML = this.defaultCards(category.category);
      });
    });
    listenDelegated(this.element, 'click', '.category-top-layer-btn-update', async (e) => {
      const cardId = e.delegateTarget.dataset.id!;
      const name = document.querySelector('.category-top-layer-input') as HTMLInputElement;
      const image = document.querySelector('.category-top-layer-image-input') as HTMLInputElement;
      if (!this.validateFields(name.value, image.files![0])) {
        alert('Ошибки валидации проверьте чтобы поле name не было пустым и image был картинкой');
      } else if (userApi.getCookie('token') === '') {
        window.location.hash = '#main';
      } else {
        const formData = new FormData();
        formData.set('name', name.value);
        formData.append('image', image.files![0]);
        await categoryAPI.updateRecord(formData, cardId);
        setTimeout(async () => {
          categoryAPI.retrieveRecord(cardId).then(async (category) => {
            this.dispatch(putCategory(category.category));
          });
        }, 3000);
      }
    });
  }

  update(): void {
    const container = document.querySelector('.admin-container');
    if (container !== null) {
      container.innerHTML = this.setCards();
    }
    window.onscroll = () => {
      const categories = this.state.categories as ICategory[];
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
      const cardsCount = document.querySelectorAll('.category-card').length;
      if (scrollTop + clientHeight > scrollHeight - 1) {
        this.createCards().forEach((el) => {
          if (cardsCount < categories.length) this.element.appendChild(el);
        });
        if (document.querySelector('.category-card-new') == null && cardsCount === categories.length) {
          this.element.appendChild(this.createNewCard());
        }
      }
    };
  }
}
