import { selectionState } from "../state/selectedItemsState.js";
import { guideLineState } from '../state/snapGuideState.js'
import { mouseDragState } from '../state/dragState.js';
import { applySnap } from "../utils/snap.js";
import { computeGuideLines } from "../utils/guideLine.js";

export class ItemHandler {
  #renderer;
  #scrollContainer;
  #selectionRenderer;

  constructor(renderer, scrollContainer, selectionRenderer) {
    this.#renderer = renderer;
    this.#scrollContainer = scrollContainer;
    this.#selectionRenderer = selectionRenderer;
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
      // Compute group bounds (min left/top and max right/bottom)
      const maxInitialRight = Math.max(...initialPositions.map(p => p.initialLeft + p.element.offsetWidth));
      const maxInitialBottom = Math.max(...initialPositions.map(p => p.initialTop + p.element.offsetHeight));

      const groupWidth = maxInitialRight - minInitialLeft;
      const groupHeight = maxInitialBottom - minInitialTop;

      const draggingGroupBounds = {
        id: 'dragging-group',
        x: minInitialLeft + clampedDx,
        y: minInitialTop + clampedDy,
        width: groupWidth,
        height: groupHeight,
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

      // 보조선 후보 계산 (표시 전용)
      const guideThreshold = 50; // 넓게: 시각적 안내용
      const guideLines = computeGuideLines(draggingGroupBounds, allBoxes, guideThreshold);
      guideLineState.set(guideLines);

      // snap 보정 좌표 계산
      // 스냅 후보 계산 (스냅 전용): 더 타이트하게
      const snapThreshold = 10; // 붙이기 기준은 더 좁게
      const snapLines = computeGuideLines(draggingGroupBounds, allBoxes, snapThreshold);
      const snapped = applySnap(
        { x: draggingGroupBounds.x, y: draggingGroupBounds.y },
        snapLines,
        { width: draggingGroupBounds.width, height: draggingGroupBounds.height },
        snapThreshold
      );

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