import { updateRects, initCanvas, startAnts } from './canvas-ants.js'

let selectedTargets = new Set();

const syncRect = () => {
    const rects = [...selectedTargets].map( element => {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        }
    });
    updateRects(rects);
}

const selectBoxOnClick = (element) => {
    if (selectedTargets.has(element)) return;
    selectedTargets.add(element);
    syncRect();
}

const clearAllSelection = () => {
    selectedTargets.clear();
    syncRect();
}

const deselectBoxOnClick = (element) => {
    selectedTargets.delete(element);
    syncRect();
}
    
const init = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        initCanvas(canvas);
        startAnts();
    });

    document.addEventListener('click', e => {
        const isCtrlKey = e.ctrlKey || e.metaKey;
        const target = e.target.closest('.box');

        if (!target){
            clearAllSelection();
            return;
        } 

        if(isCtrlKey){
            if (selectedTargets.has(target)){
                deselectBoxOnClick(target);
            }else{
                selectBoxOnClick(target);
            }
        }else{
            clearAllSelection();
            selectBoxOnClick(target);
        }
    })
}

init();