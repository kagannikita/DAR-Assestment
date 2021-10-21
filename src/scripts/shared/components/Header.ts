import { Component } from '../rendering/Component';
import { IfStateCSS } from '../rendering/templating';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';

export class Header extends Component {
  template(): string {
    return `
      <header ref="header" class="header-container">
      <div ref="menu" class="menu">
      <input type="checkbox"  ref="menuOpened" >
        <span></span>
        <span></span>
        <span></span>
          <div class="sidebar" ref="sidemenu"></div>
                </div>
        <div class="switch">
        <label class="switch_btn">
      <input type="checkbox" class="switch-input" ref="learningMode" 
            ${IfStateCSS('checked', this.state.game.learningMode)}>
      <span class="switch-label" data-off="Train" data-on="Play"></span>
      <span class="switch-handle"></span>
      </label>
      </div>
      </header>
    `;
  }

  init(): void {
    new Sidebar(this.refs.sidemenu);
    document.body.addEventListener('click', (event) => {
      if ((this.refs.menuOpened as HTMLInputElement).checked
        && <HTMLElement>(<HTMLElement>event.target).parentNode !== this.refs.menu) {
        (this.refs.menuOpened as HTMLInputElement).dispatchEvent(new MouseEvent('click'));
      }
    });
    this.refs.learningMode.onchange = (e) => {
      const check = e.target as HTMLInputElement;
      this.quickDispatch('setLearningMode', check.checked);
    };
  }

  update(): void {
    if (window.location.hash.includes('admin')) {
      this.element.innerHTML = '';
      this.element.setAttribute('style', 'margin:0; max-width: 100%;');
      new AdminHeader(this.element);
    } else {
      new Header(this.element);

      this.element.setAttribute('style', 'margin: 40px auto 0px; ');
    }
    this.refs.sidemenu.classList.toggle('green', this.state.game.learningMode);
  }
}
