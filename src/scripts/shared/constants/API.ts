// const API = 'http://localhost:3001/api/';
const API = 'https://serene-sea-98956.herokuapp.com/api/';
export const API_URL = {
  CATEGORIES: `${API}categories/`,
  CARDS: `${API}cards/`,
  STATISTICS: `${API}statistics/`,
  USER: `${API}user/`,
  ENDPOINTS: {
    GET: 'get/',
    CREATE: 'create/',
    DELETE: 'delete/',
    UPDATE: 'put/',
    REGISTER: 'register/',
    LOGIN: 'login/',
    LOGOUT: 'logout/',
  },
};

export const HeaderJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};
