/* Block Pusher */
/* Last Edited: 2025.4.15 */
/* Author: Seojin Park */

function log(a) {console.log(a)}

//Defining canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";

//Disabling smoothing
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

map = []

//Defining images
let imgList = ["blank.png", "brick.png", "block.png", "block_done.png", "goal.png", "player.png", "next.svg", "win.svg"];
for (let i=0; i<imgList.length; i++) {
    let loadimg = new Image();
    loadimg.src = imgList[i];
    imgList[i] = loadimg
    loadimg.complete = () => [imgList[i] = loadimg]
}

//Defining drawImg'() function
function drawImg(imgIdx, x, y, size=64) {
    let img = imgList[imgIdx];

    if (!img.complete) {
        img.onload = () => drawImg(imgIdx, x, y, size);
    }
    ctx.drawImage(img, x * size, y * size, size, size);
}

//Defining load() function
function load(mapnum, width, height) {

    let _map = leveldata[mapnum][0]
    let loadmap = [];
    let tempmap = [];

    if (_map.length === 0) {
        for (let i=0; i<height; i++) {
        tempmap.push(4);
        }

        for (let i=0; i<width; i++) {
        loadmap.push(tempmap);
        }

    } else {
        for (let x=0; x<width; x++) {
            tempmap = [];
            for (let y=0; y<height; y++) {
                tempmap.push(parseInt(_map[x * height + y]));
            }
            loadmap.push(tempmap);
        }
    }
    return loadmap;
}

//Defining draw() function
function draw(size) {
    let mapwidth = map.length;
    let mapheight  = map[0].length;

    for (let x=0; x<mapwidth; x++) {
        for (let y=0; y<mapheight; y++) {
            drawImg(map[x][y], x, y, size);
        }
    }
}

leveldata = [
    ["0011100000141000001011111112024114020111111121000001410000011100", [4,4]],
    ["0011110001100100010201000112011001102010014200100144041001111110", [2,2]],
    ["0111110001001110010200101110101114101001142001011400020111111111", [1,3]],
    ["0011111100100001111222011002440110244411111100100001111000000000", [4,1]],
    ["0011111011100010100240111004240111100201001000110011111000000000", [1,5]],
    ["0011110000144100011041100100241011020011100122011000000111111111", [6,3]],
    ["1111111110010001102442011024001110244201100100011111111100000000", [3,1]],
    ["0111111011000011102022011444444110220201111001110011110000000000", [5,4]],
    ["",[0,0]]
]
levelnum = 0

dir = [0,0]
pressed = [false, false, false, false]
let pressedkey = null
let keyup = false
let mobilepress = null

document.addEventListener("keydown", (e) => {
    pressedkey = e.key
});

let keydetect = () => {
    if ((!pressed[0] && pressedkey == "ArrowUp") || mobilepress == 0) {
        dir = [0,-1];
        pressed[0] = true;
    }

    if (!pressed[1] && pressedkey == "ArrowDown" || mobilepress == 1) {
        dir = [0,1];
        pressed[1] = true;
    }

    if (!pressed[2] && pressedkey == "ArrowRight" || mobilepress == 2) {
        dir = [1,0];
        pressed[2] = true;
    }

    if (!pressed[3] && pressedkey == "ArrowLeft" || mobilepress == 3) {
        dir = [-1,0];
        pressed[3] = true;
    }

    if (pressedkey == "r") {
        set(levelnum)
    }

    if (pressedkey == "|") {
        switchlevel = prompt()
        set(switchlevel)
    }

    pressedkey = null
    mobilepress = null
}

document.addEventListener("keyup", (e) => {keyup = true});

let keyupdetect = () => {
    if (keyup) {
        pressed = [false, false, false, false];
        dir = [0,0];
    }
}

let mouseup = false
document.addEventListener("mouseup", (e) => mouseup = true);

function check(mult, list) {
    for (let i=0; i<list.length; i++) {
        if (map[player[0] + mult * dir[0]][player[1] + mult * dir[1]] == list[i]) {
            return true
        }
    }
    return false
}

function move() {
    if (check(1, "04")) {
        player = [player[0] + dir[0], player[1] + dir[1]]
    } else if (check(1, "23")) {
        if (check(2, "04")) {
            if (check(2, "4")) {
                map[player[0] + (2 * dir[0])][player[1] + (2 * dir[1])] = 3
            } else {
                map[player[0] + (2 * dir[0])][player[1] + (2 * dir[1])] = 2
            }
            if (check(1, "2")) {
                map[player[0] + dir[0]][player[1] + dir[1]] = 0
            } else {
                map[player[0] + dir[0]][player[1] + dir[1]] = 4
            }
            player = [player[0] + dir[0], player[1] + dir[1]]
        }
    }
}

function set(num) {
    levelnum = num
    map = load(levelnum, 8,8)
    player = leveldata[levelnum][1]
    advancelevel = false
}

map = load(levelnum, 8,8);
player = leveldata[levelnum][1]
let advancelevel = false
let focused = false

setInterval(() => {

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    keydetect();
    if (pressed.includes(true)) {
        advancelevel = true;
        move();
        
        for (let i=0; i<map.length; i++) {
            if (map[i].includes(4)) {
                advancelevel = false;
                break;
            }
        }

        dir = [0,0]
    }
    keyupdetect();

    draw(64);
    drawImg(5, player[0], player[1], 64)

    if (advancelevel) {
        ctx.fillStyle = "rgba(200, 200, 200, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (levelnum == leveldata.length) {
            drawImg(7, 0, 0, canvas.width)
        } else {
            drawImg(6, 0, 0, canvas.width)
        }
        
        if (mouseup && !(levelnum == leveldata.length) && focused) {
            levelnum++
            map = load(levelnum, 8,8)
            player = leveldata[levelnum][1]
            advancelevel = false
        }
    }

    mouseup = false
    log(focused)
}, 1000/500)
