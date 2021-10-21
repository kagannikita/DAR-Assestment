import { Collections, compileTemplate, Refs } from './compileTemplate';
import { AppDispatch, RootState, store } from './store';
import IStatistic from '../api/LocalStorageStatistics';

export class Component {
  readonly element: HTMLElement;

  readonly refs: Refs;

  state: RootState;

  readonly dispatch: AppDispatch;

  readonly collections: Collections;

  constructor(parentNode: HTMLElement | null) {
    this.state = store.getState();
    this.dispatch = store.dispatch;

    store.subscribe(() => {
      this.state = store.getState();
      this.update();
    });

    const { root, refs, collections } = compileTemplate(this.template());

    this.element = root;

    this.refs = refs;
    this.collections = collections;

    if (parentNode !== null) this.mount(parentNode);

    this.init();
  }

  init(): void {}

  template(): string {
    throw new Error('Component should implement method template()');
  }

  mount(node: HTMLElement): void {
    node.innerHTML = '';
    node.appendChild(this.element);
  }

  update(): void {}

  quickDispatch(type: string, payload: string | IStatistic[] | boolean): void {
    this.dispatch({ type, payload });
  }
}
