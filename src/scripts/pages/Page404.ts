import { Component } from '../shared/rendering/Component';

export class Page404 extends Component {
  template(): string {
    return '<div class="container"><h1>404: not found</h1></div>';
  }
}
