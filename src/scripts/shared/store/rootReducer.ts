import { combineReducers } from 'redux';
import { game } from './game';
import { categories } from './categories';
import { preloader } from './preloader';
import { routing } from './route';
import { cards } from './cards';
import { statistics } from './statistics';
import { sorting } from './sort';

export default combineReducers({
  categories,
  game,
  preloader,
  routing,
  cards,
  statistics,
  sorting,
});
