import { Component } from '../rendering/Component';
import { MapAndJoin } from '../rendering/templating';
import { ICategory } from '../api/CategoryAPI';

export class Sidebar extends Component {
  template(): string {
    const categories = this.state.categories as ICategory[];
    return `
<div ref="sidebar" class="sidebar_first">
    <a  collection="sideLink" class="sidebar_link" href="#main">Main Page</a>
          ${MapAndJoin(
    categories,
    (category) => `
            <a collection="sideLink" class="sidebar_link" href="#${category._id}">${category.name}</a>
          `,
  )}
            <a  collection="sideLink" class="sidebar_link" href="#statistic">Statistic</a>
            <button ref="login" class="login_btn" >Login</button>
    </div>
    `;
  }

  init(): void {
    this.refs.login.onclick = () => {
      document.querySelector('.login_form')!.classList.remove('hidden');
      document.querySelector('.subject')!.classList.add('show');
    };
    document.querySelector('.subject')!.addEventListener('click', () => {
      if (!document.querySelector('.login_form')!.classList.contains('hidden')) {
        document.querySelector('.login_form')!.classList.add('hidden');
        document.querySelector('.subject')!.classList.remove('show');
      }
    });
  }

  update(): void {
    this.collections.sideLink.forEach((link) => {
      if (link.getAttribute('href') === this.state.routing.changeRoute) {
        link.classList.add('active');
      }
      if (link.getAttribute('href') !== this.state.routing.changeRoute && link.classList.contains('active')) {
        link.classList.remove('active');
      }
    });
  }
}
