let guideLines = [];

export const guideLineState = {
    get() {
        return guideLines;
    },  
    
    set(newLine){
        guideLines = newLine;
    },

    clear(){
        guideLines = [];
    }
}