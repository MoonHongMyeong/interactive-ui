export class ItemRenderer {
    #container;

    constructor(container){
        this.#container = container.querySelector('#box-layer');
    }
    
    getContainer() {
        return this.#container;
    }

    render(items) {
        this.#clear();
        for ( const item of items ) {
            const div = document.createElement('div');
            div.className = 'box';
            div.dataset.id = `${item.id}`;
            div.style.position = 'absolute';
            div.style.left = `${item.x}px`;
            div.style.top = `${item.y}px`;
            div.style.width = `${item.width}px`;
            div.style.height = `${item.height}px`;
            div.style.backgroundColor = `${item.bgColor}`;

            this.#container.appendChild(div);
        }
    }

    #clear(){
        this.#container.innerHTML = '';
    }
}