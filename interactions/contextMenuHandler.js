import { getContainerRect, getElementRelativePosition } from '../utils/coordinateTransform.js';

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

        const viewport = this.#container.parentElement?.querySelector('#viewport');
        const { x, y } = viewport
            ? getElementRelativePosition(event, viewport)
            : getElementRelativePosition(event, this.#container);

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

        const viewportEl = this.#container.parentElement?.querySelector('#viewport');
        const viewportRect = viewportEl ? getContainerRect(viewportEl) : getContainerRect(this.#container);

        let adjustX = x;
        let adjustY = y;

        // Clamp within viewport bounds
        if (adjustX + menuWidth > viewportRect.width) adjustX = Math.max(0, viewportRect.width - menuWidth);
        if (adjustY + menuHeight > viewportRect.height) adjustY = Math.max(0, viewportRect.height - menuHeight);

        const baseLeft = viewportEl ? viewportEl.offsetLeft : 0;
        const baseTop = viewportEl ? viewportEl.offsetTop : 0;

        menu.style.left = `${baseLeft + adjustX}px`;
        menu.style.top = `${baseTop + adjustY}px`;
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