document.addEventListener("DOMContentLoaded", () => {
    const sidePanelWidth = "85vw"
    let leftBottomHalfDrawer = document.getElementById("leftBottomHalfDrawer")
    let rightBottomHalfDrawer = document.getElementById("rightBottomHalfDrawer")

    let leftBottomHalf = document.getElementById("leftBottomHalf")
    let rightBottomHalf = document.getElementById("rightBottomHalf")    
    leftBottomHalfDrawer.onclick = () => {
        const computedStyles = window.getComputedStyle(leftBottomHalf);
        const isClosed = computedStyles.left != `0px`;
        rightBottomHalf.style.right = `-${sidePanelWidth}`;
        leftBottomHalf.style.left = isClosed ? "0" : `-${sidePanelWidth}`;
    }
    rightBottomHalfDrawer.onclick = () => {
        const computedStyles = window.getComputedStyle(rightBottomHalf);
        const isClosed = computedStyles.right != `0px`;
    
        leftBottomHalf.style.left = `-${sidePanelWidth}`;
        rightBottomHalf.style.right = isClosed ? "0" : `-${sidePanelWidth}`;
    }
    console.log("hi")
})
