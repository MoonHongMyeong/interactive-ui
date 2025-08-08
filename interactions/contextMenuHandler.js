import { getContainerRect } from '../utils/coordinateTransform.js';

export class ContextMenuHandler {
    #container;
    #provider;

    constructor(container, provider){
        this.#container = container;
        this.#provider = provider;
    }

    on(){
        this.#container.addEventListener('contextmenu', this.#notifyContextEvent);
    }

    off(){
        this.#container.removeEventListener('contextmenu', this.#notifyContextEvent);
    }

    #notifyContextEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const { x, y } = { x: event.clientX, y: event.clientY };

        const html = this.#provider(event.target);
        this.#renderContextMenu(html, x, y)
    }

    #renderContextMenu(html, x, y) {
        if(html.length === 0) return;
        
        this.#container.querySelectorAll('.context-menu').forEach(el => el.remove());

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'absolute';
        menu.style.visibility = 'hidden';
        menu.innerHTML = html;

        // context menu size를 구하기 위함.
        this.#container.appendChild(menu);

        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;

        const viewport = getContainerRect(this.#container.querySelector('#viewport'));
        let adjustX = x;
        let adjustY = y;

        if ( x + menuWidth > viewport.width ) adjustX -= menuWidth;
        if ( y + menuHeight > viewport.height ) adjustY -= menuHeight;

        menu.style.left = `${adjustX}px`;
        menu.style.top = `${adjustY}px`;
        menu.style.visibility = 'visible';

        const onClickOutside = (e) => {
        if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', onClickOutside);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
    }
}