export class ContextMenuHandler {
    #container;
    #transformer;
    #provider;

    constructor(container, transformer, provider){
        this.#container = container;
        this.#transformer = transformer;
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

        const { x, y } = this.#transformer.layerToViewportCoords( { x: event.clientX, y: event.clientY} );

        const html = this.#provider(event.target);
        this.#renderContextMenu(html, x, y)
    }

    #renderContextMenu(html, x, y) {
        if(html.length === 0) return;
        
        this.#container.querySelectorAll('.context-menu').forEach(el => el.remove());

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.position = 'fixed';
        menu.style.visibility = 'hidden';
        menu.innerHTML = html;

        // context menu size를 구하기 위함.
        this.#container.appendChild(menu);

        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;

        const viewport = this.#transformer.getViewportRect();
        const viewportPosition = this.#transformer.getViewportOffsetStyle();

        let adjustX = x;
        let adjustY = y;

        if ( x + menuWidth > viewport.width ) adjustX = adjustX - menuWidth - viewportPosition.left;
        if ( y + menuHeight > viewport.height ) adjustY = adjustY - menuHeight - viewportPosition.top;

        menu.style.left = `${adjustX}px`;
        menu.style.top = `${adjustY}px`;
        menu.style.visibility = 'visible';

        console.log(menuWidth, menuHeight)
        console.log(viewport)
        console.log(viewportPosition)
        console.log(x,y)
        console.log(adjustX, adjustY)

        const onClickOutside = (e) => {
        if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('mousedown', onClickOutside);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
    }
}