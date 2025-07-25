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

        const x = event.clientX;
        const y = event.clientY;

        const html = this.#provider(event.target);
        this.#renderContextMenu(html, x, y)
    }

    #renderContextMenu(html, x, y) {
        if(html.length === 0) return;
        
        document.querySelectorAll('.context-menu').forEach(el => el.remove());

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'absolute';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.innerHTML = html;

        this.#container.appendChild(menu);

        const onClickOutside = (e) => {
        if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', onClickOutside);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
    }
}