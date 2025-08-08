const THRESHOLD = 10;

export function applySnap(position, snapLines, size = { width: 0, height: 0 }, threshold = THRESHOLD) {
  const originalX = position.x;
  const originalY = position.y;

  let bestX = { delta: 0, diff: Number.POSITIVE_INFINITY };
  let bestY = { delta: 0, diff: Number.POSITIVE_INFINITY };

  for (const line of snapLines) {
    if (line.axis === 'x') {
      const leftDiff = Math.abs(originalX - line.position);
      const rightDiff = Math.abs((originalX + size.width) - line.position);

      if (leftDiff < bestX.diff) {
        bestX = { delta: line.position - originalX, diff: leftDiff };
      }
      if (rightDiff < bestX.diff) {
        bestX = { delta: line.position - (originalX + size.width), diff: rightDiff };
      }
    } else if (line.axis === 'y') {
      const topDiff = Math.abs(originalY - line.position);
      const bottomDiff = Math.abs((originalY + size.height) - line.position);

      if (topDiff < bestY.diff) {
        bestY = { delta: line.position - originalY, diff: topDiff };
      }
      if (bottomDiff < bestY.diff) {
        bestY = { delta: line.position - (originalY + size.height), diff: bottomDiff };
      }
    }
  }

  const result = { x: originalX, y: originalY };
  if (bestX.diff <= threshold) result.x = originalX + bestX.delta;
  if (bestY.diff <= threshold) result.y = originalY + bestY.delta;
  return result;
}
 