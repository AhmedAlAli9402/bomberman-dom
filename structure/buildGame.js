import { DOM} from '../framework/dom.js';

export default function buildGame() {
    let app = document.getElementById('app');
    for (let i=0;i<30;i++){
        app.appendChild(DOM.createElement({ tag: 'div', attrs: { id: 'game' } }));
    }
}