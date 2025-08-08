# Project Guide: interaction-ui

## 1. 프로젝트 개요

- 이름: interaction-ui
- 목적: 범용 UI 인터랙션 레이어 구현
- 특징: 캔버스 기반 인터랙션, DOM 기반 요소 관리, 상태 최소화
- 추후 사용처: 
    1. make, n8n등 워크플로우 시스템의 ui요소.
    2. html로 작성된 elements를 받아 배치할 수 있는 시스템.

## 2. 핵심 철학

- 상태 최소화: 내부 상태는 실제 interaction에 필요한 것들만 유지. 외부에서 받아올 수 있는 데이터 요소는 배제. 현재는  `selectionState`와 `mouseDragState`를 유지 중.
- 책임 분리: 렌더러(Renderer)는 그리기만, 핸들러(Handler)는 이벤트만
- 범용성 유지: 도메인 특화 기능은 절대 구현하지 않음 (예: 포트 연결 X)
- 외부에서 데이터 요소인 `items`를 주입받아 UI를 렌더링하며, 내부에서는 오직 선택 및 드래그 등 상호작용 상태만 관리.

## 3. 디렉토리 구조 요약 (업데이트)

```
/interactions     → 마우스/키보드/컨텍스트 이벤트 처리기 (ex. ItemHandler, ContextMenuHandler)
/renderers        → 캔버스 기반 시각 요소 렌더링 (ex. GuideRenderer, SelectionRenderer)
/state            → 최소한의 내부 상태 관리 (ex. guideLineState, selectionState)
/utils            → 좌표 변환 및 계산 유틸 (ex. coordinateTransform.js, snap.js, guideLine.js, debounce.js)
```

## 4. 좌표계와 레이아웃 구조 (업데이트)

- `viewport`: 화면에 보이는 실제 영역 (DOM, 고정 크기)
- `box-layer`: 요소들이 배치되는 무한 캔버스 (스크롤 확장됨)
- `canvas`: `guide-layer`, `effect-layer` 등 UI 이펙트 전용 캔버스는 항상 `viewport` 기준 크기 유지
- 좌표 변환: `viewport ↔ box-layer` 변환 함수는 `utils/coordinateTransform.js`
- 가이드 렌더링: 보조선은 콘텐츠 좌표계(position)에 대해 계산되며, `GuideRenderer`에서 `viewport.offsetLeft/Top` 보정으로 화면 위치에 맞춰 그림

## 5. 주요 기능 구성 (업데이트)

| 기능 | 설명 |
|------|------|
| 선택 (Selection) | 캔버스 위 박스 선택 영역 구현 (marching ants 등) |
| 드래그 (Drag) | 선택된 요소 이동, ghost-layer와 함께 |
| 컨텍스트 메뉴 | `provider` 주입 방식으로 커스텀 HTML 렌더링 지원 |
| 스냅 가이드 | 주변 요소와의 거리 기반 보조선 표시 및 snap 보정 적용 (구현됨) |

## 6. 설계 원칙 (업데이트)

- Canvas는 이벤트/효과 목적에 맞춰 최소 개수만 사용 (`guide-layer`, `effect-layer`)하며 interaction UI 전용
- 커스터마이징은 config 수준에서만 허용 (예: 레이어 이름)
- 내부에서 관리하는 상태는 interaction에 필요한 것들만 관리. 이 외의 데이터적인 요소들은 전부 외부에 위임.

## 7. 스냅 & 가이드 아키텍처

- 책임 분리
  - 가이드 후보 계산: `utils/guideLine.js`의 `computeGuideLines(activeBox, allBoxes, threshold)`
  - 스냅 적용: `utils/snap.js`의 순수함수 `applySnap(position, lines, size, threshold)`
  - 렌더링: `renderers/snapGuideRenderer.js` (상태 읽기 및 그리기만 담당)
  - 상태: `state/snapGuideState.js`는 현재 표시할 보조선 목록만 보관

- 임계값
  - guideThreshold: 보조선 표시 기준(넓게). 현재 `interactions/itemHandler.js`에서 설정/사용
  - snapThreshold: 실제 스냅 적용 기준(타이트). 현재 `interactions/itemHandler.js`에서 설정/사용
  - 향후 두 값은 구성값(config)으로 외부 주입 예정

- 드로잉 루프
  - rAF 기반으로 `guideLineState`를 지속적으로 폴링하여 그립니다
  - 라인이 없으면 캔버스를 clear하고 조기 종료(early exit)하여 비용 최소화

## 7. 외부 의존 정책

- UI 요소는 순수 JS 기반으로 구현
- 외부 라이브러리 없음 (React 등 금지)
- 모든 인터랙션은 DOM 이벤트 기반 (버블링 활용)

## 8. 향후 확장 아이디어 (논의 중)

- `snapManager`, `guideLine` 관리 기능 추가
- 마우스 커서 상태 전환 시스템
- 좌표계 조작 유틸 개선 (e.g. 확대/축소 대비 보정)
