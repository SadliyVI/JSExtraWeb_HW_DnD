import './styles/board.css';
import './styles/card.css';
import './styles/columns.css';
import './styles/drag.css';

import App from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('board-root');
    App.init(root);
});