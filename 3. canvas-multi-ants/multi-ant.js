import { AntsRenderer } from './canvas-ants.js'

let renderer;
let selectedTargets = new Set();

const updateSelectionRects = () => {
    console.log(selectedTargets)
    renderer.setTargets([...selectedTargets]);
}

const toggleSelection = (element, isKeyEvent = false) => {
    if (!isKeyEvent) selectedTargets.clear();

    selectedTargets.has(element)
        ? selectedTargets.delete(element)
        : selectedTargets.add(element);

    updateSelectionRects();
}

const init = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.querySelector('#box-canvas');
        renderer = new AntsRenderer(canvas);
        renderer.start();
    });

    document.addEventListener('click', e => {
        const isCtrlKey = e.ctrlKey || e.metaKey;
        const target = e.target.closest('.box');

        if(!target){
            selectedTargets.clear();
            updateSelectionRects();
            return;
        }

        toggleSelection(target, isCtrlKey);
    })
}

init();