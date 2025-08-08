import { selectionState } from "../state/selectedItemsState.js";
import { guideLineState } from '../state/snapGuideState.js'
import { mouseDragState } from '../state/dragState.js';
import { SnapManager } from "../utils/snapManager.js";

export class ItemHandler {
  #renderer;
  #scrollContainer;
  #selectionRenderer;
  #snapManager;

  constructor(renderer, scrollContainer, selectionRenderer) {
    this.#renderer = renderer;
    this.#scrollContainer = scrollContainer;
    this.#selectionRenderer = selectionRenderer;
    this.#snapManager = new SnapManager();
  }

  init(items) {
    this.#renderer.render(items);
    const container = this.#renderer.getContainer();
    
    // 선택 렌더러 시작
    this.#selectionRenderer.start();
    
    // 이벤트 리스너 등록
    container.addEventListener('mousedown', this.#onMouseDown);
    container.addEventListener('click', this.#onClick);
  }

  #onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (mouseDragState.isActive()) {
      mouseDragState.stop();
      return;
    }

    const isCtrlKey = event.ctrlKey || event.metaKey;
    const target = event.target.closest('.box');

    if (!isCtrlKey) selectionState.clear();

    if (target) selectionState.toggle(target);
  }

  #onMouseDown = (e) => {
    e.preventDefault();

    const target = e.target.closest('.box');
    if (!target || !selectionState.get().has(target)) return;

    const selectedElements = [...selectionState.get()];
    const startX = e.clientX;
    const startY = e.clientY;

    const startScrollLeft = this.#scrollContainer.scrollLeft;
    const startScrollTop = this.#scrollContainer.scrollTop;

    const initialPositions = selectedElements.map(el => {
      return {
        element: el,
        initialLeft: el.offsetLeft,
        initialTop: el.offsetTop
      }
    })

    const onMouseMove = (e) => {
      const dx = (e.clientX - startX) + (this.#scrollContainer.scrollLeft - startScrollLeft);
      const dy = (e.clientY - startY) + (this.#scrollContainer.scrollTop - startScrollTop);

      const minInitialLeft = Math.min(...initialPositions.map(p => p.initialLeft));
      const minInitialTop = Math.min(...initialPositions.map(p => p.initialTop));

      const clampedDx = Math.max(dx, -minInitialLeft);
      const clampedDy = Math.max(dy, -minInitialTop);

      // 이동 전 좌표
      const draggingGroupBounds = {
        id: 'dragging-group',
        x: minInitialLeft + clampedDx,
        y: minInitialTop + clampedDy,
        width: 0,
        height: 0,
      };

      const allBoxes = Array.from(this.#renderer.getContainer().querySelectorAll('.box'))
        .filter(el => !selectionState.get().has(el))
        .map(el => ({
          id: el.dataset.id,
          x: el.offsetLeft,
          y: el.offsetTop,
          width: el.offsetWidth,
          height: el.offsetHeight
        }));

      // snap 후보 계산 및 상태 업데이트
      const snapLines = this.#snapManager.computeSnapLines(draggingGroupBounds, allBoxes);
      guideLineState.set(snapLines);

      // snap 보정 좌표 계산
      const snapped = this.#snapManager.applySnap({ x: draggingGroupBounds.x, y: draggingGroupBounds.y }, snapLines);

      const snapDx = snapped.x - minInitialLeft;
      const snapDy = snapped.y - minInitialTop;

      for ( const { element, initialLeft, initialTop } of initialPositions ) {
        element.style.left = `${initialLeft + snapDx}px`;
        element.style.top = `${initialTop + snapDy}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      guideLineState.clear();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
}