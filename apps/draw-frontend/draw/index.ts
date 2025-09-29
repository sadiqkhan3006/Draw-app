interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number
}
export default function initDraw(canvas: HTMLCanvasElement) {
    const rect: Rectangle[] = [];
    let clicked: boolean = false;
    let startX = 0, startY = 0;
    let height = 0, width = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const handleMove = (e: MouseEvent) => {
        if (clicked) {
            width = (e.clientX - startX);
            height = (e.clientY - startY);
            ctx?.clearRect(0, 0, canvas.width, canvas.height);//doesnt work for -ve
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            rect.forEach(ele => {
                ctx.strokeStyle = "#FFFFFF";
                ctx?.strokeRect(ele.x, ele.y, ele.width, ele.height);
            });
            ctx.strokeStyle = "#FFFFFF";
            ctx?.strokeRect(startX, startY, width, height);
            //console.log("Mousemove:", e.clientX, e.clientY);
        }
    };
    const handleDown = (e: MouseEvent) => {
        clicked = !clicked;
        if (clicked === true) {
            startX = e.clientX;
            startY = e.clientY;
        }
        if (clicked === false && width !== 0 && height !== 0) {
            rect.push({ x: startX, y: startY, width, height });
            console.log(rect);
            width = 0;
            height = 0;
        }

    };
    const handleUp = (e: MouseEvent) => {
        console.log("Mouseup:", e.clientX, e.clientY);
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mouseup", handleUp);
    return {
        handleDown, handleMove, handleUp
    }
}