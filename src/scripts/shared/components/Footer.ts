import { Component } from '../rendering/Component';

export class Footer extends Component {
  template(): string {
    return `<footer class="footer">
<img class="footer_logo" src="../assets/images/RSS_logo.ad178c0d.svg" alt="RS School">
<a class="footer_link" href="https://github.com/kagannikita" rel="noreferrer" target="_blank">kagannikita</a>
<a class="footer_link" href="https://rs.school/js/" rel="noreferrer" target="_blank">RS School</a>
<p class="footer_link number">2021</p></footer>`;
  }
}
