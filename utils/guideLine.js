export function computeGuideLines(activeBox, allBoxes, threshold) {
  const lines = [];

  const activeLeft = activeBox.x;
  const activeRight = activeBox.x + (activeBox.width ?? 0);
  const activeTop = activeBox.y;
  const activeBottom = activeBox.y + (activeBox.height ?? 0);

  for (const box of allBoxes) {
    if (box.id === activeBox.id) continue;

    const boxLeft = box.x;
    const boxRight = box.x + (box.width ?? 0);
    const boxTop = box.y;
    const boxBottom = box.y + (box.height ?? 0);

    // Vertical guidelines (x-axis alignment)
    if (Math.abs(activeLeft - boxLeft) <= threshold) {
      lines.push({ axis: 'x', position: boxLeft, targetId: box.id, match: 'left-left' });
    }
    if (Math.abs(activeLeft - boxRight) <= threshold) {
      lines.push({ axis: 'x', position: boxRight, targetId: box.id, match: 'left-right' });
    }
    if (Math.abs(activeRight - boxLeft) <= threshold) {
      lines.push({ axis: 'x', position: boxLeft, targetId: box.id, match: 'right-left' });
    }
    if (Math.abs(activeRight - boxRight) <= threshold) {
      lines.push({ axis: 'x', position: boxRight, targetId: box.id, match: 'right-right' });
    }

    // Horizontal guidelines (y-axis alignment)
    if (Math.abs(activeTop - boxTop) <= threshold) {
      lines.push({ axis: 'y', position: boxTop, targetId: box.id, match: 'top-top' });
    }
    if (Math.abs(activeTop - boxBottom) <= threshold) {
      lines.push({ axis: 'y', position: boxBottom, targetId: box.id, match: 'top-bottom' });
    }
    if (Math.abs(activeBottom - boxTop) <= threshold) {
      lines.push({ axis: 'y', position: boxTop, targetId: box.id, match: 'bottom-top' });
    }
    if (Math.abs(activeBottom - boxBottom) <= threshold) {
      lines.push({ axis: 'y', position: boxBottom, targetId: box.id, match: 'bottom-bottom' });
    }
  }

  return lines;
}


