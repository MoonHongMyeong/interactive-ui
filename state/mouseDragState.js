let _isDragging = false;

export const mouseDragState = {
    isActive(){
        return _isDragging;
    },

    start() {
        _isDragging = true;
    },

    stop() {
        _isDragging = false;
    }
}