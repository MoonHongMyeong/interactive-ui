export function getLayerRelativePosition(event, layerElement) {
    const rect = layerElement.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

export function getBoxLayerRelativeRect(el, layerEl) {
    const elRect = el.getBoundingClientRect();
    const layerRect = layerEl.getBoundingClientRect();

    return {
        x: elRect.left - layerRect.left,
        y: elRect.top - layerRect.top,
        width: elRect.width,
        height: elRect.height,
    };
}