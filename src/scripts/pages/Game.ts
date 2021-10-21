import { Component } from '../shared/rendering/Component';
import { IfStateCSS, MapAndJoin } from '../shared/rendering/templating';
import { listenDelegated } from '../shared/rendering/listenDelegated';
import { LocalStorageStatistic } from '../shared/api/LocalStorageStatistics';
import { setStatistics } from '../shared/store/statistics';
import { ICard } from '../shared/api/CardsAPI';

export class Game extends Component {
  private localStorageStatistic: LocalStorageStatistic;

  private cards: ICard[];

  template(): string {
    const cards = this.state.cards as ICard[];
    this.localStorageStatistic = new LocalStorageStatistic();
    this.cards = window.location.hash === '#repeat'
      ? this.localStorageStatistic.getRepeatCards()
      : cards.filter((card) => `#${card.category._id}` === window.location.hash);
    if (this.localStorageStatistic.getRepeatCards().length === 0 && window.location.hash === '#repeat') {
      return '<div class="loading">No repeat cards</div>';
    }
    return `
      <div>
        <div class="container">
        <div ref="rating" class="rating ${IfStateCSS('red', this.state.game.learningMode)}"></div>
        <audio ref="audio" class="audio_src"></audio>
          ${MapAndJoin(
    this.cards,
    (card) => `
   <div class="game-item"  collection="gameItem">
            <div 
              class="card-front ${IfStateCSS('red', this.state.game.learningMode)}" 
              style='background-image: url("${card.image}")'
              data-id=${card.audio} collection="cards">
                <div class="card-header ${IfStateCSS('red', this.state.game.learningMode)}" collection="cards">
                  ${card.word}
                </div>
            </div>
            <div 
              class="card-back ${IfStateCSS('red', this.state.game.learningMode)}" 
              style='background-image: url("${card.image}")' collection=cards>
                <div class="card-header ${IfStateCSS('red', this.state.game.learningMode)}" collection="cards">
                  ${card.translation}
                </div>
            </div>
            <div  class="rotate ${IfStateCSS('red', this.state.game.learningMode)}" collection="cards"></div>
            </div>
          `,
  )}
          <div class="btns">
          <button ref="playGame" class="btn ${IfStateCSS('red', this.state.game.learningMode)}">Start game</button>
          </div>
        </div>
      </div>
    `;
  }

  private generateSound(data: Array<ICard>, delay: boolean): string {
    const randomSound = data.sort(() => Math.random() - 0.5);
    this.refs.audio.setAttribute('src', `${randomSound[0].audio}`);
    if (delay) {
      setTimeout(() => {
        (this.refs.audio as HTMLAudioElement).play();
      }, 1000);
    } else {
      (this.refs.audio as HTMLAudioElement).play();
    }
    return randomSound[0].word;
  }

  rotateCards(): void {
    if (this.collections.gameItem !== undefined) {
      this.collections.gameItem.forEach((rotate) => {
        (rotate.querySelector('.rotate') as HTMLElement).onclick = () => {
          rotate.classList.add('translate');
        };
      });
      this.collections.gameItem.forEach((card) => {
        card.onmouseleave = () => {
          if (card.classList.contains('translate')) {
            card.classList.remove('translate');
          }
        };
      });
    }
  }

  private static audioPlay(audioLink: string): void {
    const audioScreen = new Audio(audioLink);
    audioScreen.play();
  }

  private async showScreen(audioLink: string, msg: string): Promise<void> {
    Game.audioPlay(`../assets/sounds/${audioLink}`);
    this.element.innerHTML = msg;
    this.dispatch(setStatistics(await this.localStorageStatistic.getFromStorage()));
  }

  private clearGame(): void {
    if (this.refs.rating !== undefined || this.refs.playGame !== undefined) {
      this.refs.playGame.classList.remove('repeat');
      this.refs.rating.innerHTML = '';
      if (this.collections.cards !== undefined) {
        this.collections.cards.forEach((card) => {
          if (card.classList.contains('inactive')) {
            card.classList.remove('inactive');
          }
        });
      }
    }
  }

  private appendStars(starLink: string): void {
    const star = document.createElement('img');
    star.setAttribute('src', starLink);
    this.refs.rating.appendChild(star);
  }

  private gameCycle() {
    this.refs.playGame.classList.add('repeat');
    const gameData = [...this.cards];
    let errors = 0;
    let beginSound = this.generateSound(gameData, false);
    this.collections.gameItem.forEach((card) => {
      card.onclick = async () => {
        const gameCard = card.querySelector('.card-front') as HTMLElement;
        if (beginSound === gameCard.innerText && gameData.length && this.state.game.learningMode) {
          this.appendStars('../assets/images/star-win.svg');
          gameCard.classList.add('inactive');
          card.onclick = null;
          const index = gameData.findIndex((el) => el.word === beginSound);
          gameData.splice(index, 1);
          await this.localStorageStatistic.addToStorage(beginSound, 0, 1, 0);
          if (!gameData.length) {
            if (errors === 0) {
              await this.showScreen(
                'success.mp3',
                '<div class="end"> <h2>YOU WIN!!!</h2>'
                + '<img class="end-msg" src="../assets/images/success.jpg" alt="end"></div>',
              );
            } else {
              await this.showScreen(
                'failure.mp3',
                `<div class='end'> <h2>${errors} errors</h2>
               <img class='end-msg' src='../assets/images/failure.jpg' alt='end'></div>`,
              );
            }
            setTimeout(() => {
              window.location.href = '#main';
            }, 2000);
          } else {
            Game.audioPlay('../assets/sounds/correct.mp3');
            beginSound = this.generateSound(gameData, true);
          }
        } else {
          Game.audioPlay('../assets/sounds/error.mp3');
          this.appendStars('../assets/images/star.svg');
          errors++;
          await this.localStorageStatistic.addToStorage(beginSound, 0, 0, 1);
        }
      };
    });
  }

  init(): void {
    this.rotateCards();
    if (this.refs.playGame !== undefined) {
      this.refs.playGame.onclick = () => {
        if (this.refs.playGame.classList.contains('repeat')) {
          (this.refs.audio as HTMLAudioElement).play();
        } else {
          this.gameCycle();
        }
      };
    }
    listenDelegated(this.element, 'click', '.card-front', async (e) => {
      if (!e.delegateTarget.classList.contains('red')) {
        Game.audioPlay(`${e.delegateTarget.dataset.id}`);
        await this.localStorageStatistic.addToStorage(e.delegateTarget.innerText, 1, 0, 0);
        this.dispatch(setStatistics(await this.localStorageStatistic.getFromStorage()));
      }
    });
  }

  update(): void {
    if (this.collections.cards !== undefined) {
      this.collections.cards.forEach((card) => card.classList.toggle('red', this.state.game.learningMode));
    }
    if (this.refs.rating !== undefined || this.refs.playGame !== undefined) {
      this.refs.rating.classList.toggle('red', this.state.game.learningMode);
      this.refs.playGame.classList.toggle('red', this.state.game.learningMode);
    }
    this.clearGame();
  }
}
