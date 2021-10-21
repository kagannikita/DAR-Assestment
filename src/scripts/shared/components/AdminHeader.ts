import { Component } from '../rendering/Component';
import { UserAPI } from '../api/UserAPI';

export class AdminHeader extends Component {
  template(): string {
    return `<div class="admin-header">
     <div class="admin-links">
    <a class="admin-link ${window.location.hash === '#admin/#category' ? 'active' : ''}" href="#admin/#category">
    Categories</a>
    <p class="admin-link ${window.location.hash.includes('words') ? 'active' : ''}"">Words</a>
    </div>
    <a class="admin-link" ref="logout" href="#main">Log out</a>
</div>`;
  }

  init(): void {
    this.refs.logout.onclick = () => {
      const userAPI = new UserAPI();
      userAPI.eraseCookie('token');
    };
  }
}
