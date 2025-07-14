const box = document.querySelector('.box');

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

let isSelected = false;
let selectedTarget = null;

const selectBoxOnClick = (element) => {
    if (element.classList.contains('box')){
        // create svg
        const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
        svg.setAttribute("id", "overlay")
        svg.setAttribute("width", element.offsetWidth);
        svg.setAttribute("height", element.offsetHeight);
        svg.setAttribute("viewBox", `0 0 ${element.offsetWidth} ${element.offsetHeight}`);

        // create rect 
        const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
        rect.setAttribute("x", '0');
        rect.setAttribute("y", '0');
        rect.setAttribute("width", element.offsetWidth);
        rect.setAttribute("height", element.offsetHeight);
        rect.setAttribute("fill", "none");
        rect.setAttribute("stroke", "#000");
        rect.setAttribute("stroke-width", "10");
        rect.setAttribute("stroke-dasharray", "10 10");
        rect.setAttribute("stroke-dashoffset", "0");
        
        //create animate
        const animate = document.createElementNS(SVG_NAMESPACE, 'animate');
        animate.setAttribute("attributeName", 'stroke-dashoffset');
        animate.setAttribute("from", "0");
        animate.setAttribute("to", "20");
        animate.setAttribute("dur", "1.5s");
        animate.setAttribute("repeatCount", "indefinite");

        rect.appendChild(animate);
        svg.appendChild(rect);
        element.appendChild(svg);

        isSelected = true;
    }
}

const cancelSelectBoxInteraction = (event) => {
    const selectedBoxInteraction = document.querySelector('#overlay');
    selectedBoxInteraction.parentElement.removeChild(selectedBoxInteraction);
    isSelected = false;
}

const init = () => {
    document.addEventListener('click', e=> {
        e.stopPropagation();

        if(isSelected){
            cancelSelectBoxInteraction(e);
            selectBoxOnClick(e.target);
        }else{
            selectBoxOnClick(e.target);
        }
        
    })
}

init();