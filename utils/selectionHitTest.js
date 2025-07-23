import { selectionState } from '../state/selectionState.js';

/**
 * 대상 rect가 박스 안에 완전히 포함되어 있는지 판단
 * @param {{x, y, width, height}} box
 * @param {{x, y, width, height}} target
 * @returns {boolean}
 */
export function isContainedInBox(box, target) {
    return (
        target.x >= box.x &&
        target.y >= box.y &&
        target.x + target.width <= box.x + box.width &&
        target.y + target.height <= box.y + box.height
    );
}

/**
 * 주어진 box에 포함되는 DOM 요소들을 반환
 * @param {{x, y, width, height}} boxRect
 * @param {Element[]} elements - 대상 DOM 요소들
 * @returns {Element[]}
 */
function getElementsInBox(boxRect, elements) {
    return elements.filter((el) => {
        const rect = el.getBoundingClientRect();
        return isContainedInBox(boxRect, rect);
    });
}

/**
 * selectionBox 안에 포함되는 요소들을 찾아 선택 상태를 갱신
 * @param {{x, y, width, height}} boxRect
 */
export function updateSelectionFromBox(boxRect) {
    const allSelectableObject = Array.from(document.querySelectorAll('.box'));
    const selectedElements = getElementsInBox(boxRect, allSelectableObject);

    selectedElements.forEach((element) => {
        selectionState.add(element);
    });
}
