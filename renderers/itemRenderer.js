export class ItemRenderer {
    #container;

    constructor(container){
        this.#container = container;
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

        this.#setContainerSize(items);
    }

    #clear(){
        const boxes = this.#container.querySelectorAll('.box');
        boxes.forEach(box => box.remove());
    }

    #setContainerSize(items) {
        let maxX = 0;
        let maxY = 0;
        const offset = 50;

        for ( const item of items ) {
            maxX = Math.max(maxX, item.x + item.width);
            maxY = Math.max(maxY, item.y + item.height);
        }

        this.#container.style.width = `${maxX + offset}px`;
        this.#container.style.height = `${maxY + offset}px`;
    }
}