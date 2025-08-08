export function getElementRelativePosition(event, containerElement) {
    const rect = containerElement.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
}

export function getElementRelativeRect(element, containerElement) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    return {
        x: elementRect.left - containerRect.left,
        y: elementRect.top - containerRect.top,
        width: elementRect.width,
        height: elementRect.height,
    };
}

export function getContainerRect(containerElement) {
    return containerElement.getBoundingClientRect();
}
