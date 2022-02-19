class Int2 {
    x: number;
    y: number;
    
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }
}

class Int3 {
    x: number;
    y: number;
    z: number;

    constructor(_x: number, _y: number, _z: number) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
}

class Int4 {
    u: number;
    x: number;
    y: number;
    z: number;

    constructor(
        _u: number,
        _x: number,
        _y: number,
        _z: number) {
            this.u = _u;
            this.x = _x;
            this.y = _y;
            this.z = _z;
        }
    
    add(other: Int4) {
        return new Int4(
            this.u + other.u,
            this.x + other.x,
            this.y + other.y,
            this.z + other.z
        );
    }
}

class Color {
    r: number;
    g: number;
    b: number;

    constructor(_r: number, _g: number, _b: number) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
    }
}

class Pos3D {
    x: number;
    y: number;
    z: number;

    constructor(_x: number, _y: number, _z: number) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
}

class Pos4D {
    u: number;
    x: number;
    y: number;
    z: number;

    constructor(
        _u: number,
        _x: number,
        _y: number,
        _z: number) {
            this.u = _u;
            this.x = _x;
            this.y = _y;
            this.z = _z;
        }
}

class Object4D extends Pos4D {
    index: Int4;
    cartesian: Pos3D;
 
    constructor(
        _u: number,
        _x: number,
        _y: number,
        _z: number,
        _index: Int4) {
            super(_u, _x, _y, _z);
            this.index = _index;
            this.cartesian = new Pos3D(0, 0, 0);
            this.project();
    }

    project() {
        let f = gameManager.lightSource.u;
        this.cartesian = new Pos3D(
            f / (f - this.u) * this.x,
            f / (f - this.u) * this.y,
            f / (f - this.u) * this.z
        );
    }

    projectParallel() {
        this.cartesian = new Pos3D(
            this.x,
            this.y,
             this.z
        );
    }
    
    Euler(a: number, b: number, c: number) {
        let ra: number, rb: number, rc: number,
            ca: number, sa: number, 
            cb: number, sb: number,
            sc: number, cc: number;

        ra = a * 2 * Math.PI / 360;
        rb = b * 2 * Math.PI / 360;
        rc = c * 2 * Math.PI / 360;
        ca = Math.cos(ra / 2);
        sa = Math.sin(ra / 2);
        cb = Math.cos(rb / 2);
        sb = Math.sin(rb / 2);
        cc = Math.cos(rc / 2);
        sc = Math.sin(rc / 2);
        
        return new Pos4D(
            ca * cb * cc + sa * sb * sc,
            sa * cb * cc - ca * sb * sc,
            ca * sb * cc + sa * cb * sc,
            ca * cb * sc - sa * sb * cc
        );
    }

    mlt(l: Pos4D, r: Pos4D) {
        return new Pos4D(
            l.u * r.u - l.x * r.x - l.y * r.y - l.z * r.z,
            l.u * r.x + l.x * r.u + l.y * r.z - l.z * r.y,
            l.u * r.y - l.x * r.z + l.y * r.u + l.z * r.x,
            l.u * r.z + l.x * r.y - l.y * r.x + l.z * r.u
        );
    }

    rotate(x1: number, y1: number, z1: number,
            x2: number, y2: number, z2: number) {
        let p = this.mlt(
            this.mlt(
                this.Euler(x1, y1, z1),
                new Pos4D(this.u, this.x, this.y, this.z)
            ),
            this.Euler(x2, y2, z2)
        );

        this.u = p.u;
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
    }
}

class Cell extends Object4D {
    neighbors: number;
    color: Color;

    danger: boolean;
    demined: boolean;
    flag: boolean;

    label: string;

    constructor(
        _u: number,
        _x: number,
        _y: number,
        _z: number,
        _index: Int4) {
            super(_u, _x, _y, _z, _index);
            
            this.neighbors = 0;
            this.color = new Color(0, 0, 0);
            
            this.danger = false;
            this.demined = false;
            this.flag = false;

            this.label = "";
        }
}

class Controller extends Object4D {
    color: Color;

    constructor(
        _u: number,
        _x: number,
        _y: number,
        _z: number,
        _index: Int4,
        _color: Color) {
        super(_u, _x, _y, _z, _index);
        this.color = _color;
    } 
}

class GameArea {
    canvas: Int2;

    constructor() {
        this.canvas = new Int2(800, 800);
    }
}

class Mouse {
    downPos: Int2;
    escapePos: Int2;
    updatePos: Int2;
    upPos: Int2;

    is_down: boolean;
    is_longPress: boolean;
    is_init: boolean;

    constructor() {
        this.downPos = new Int2(0, 0);
        this.escapePos = new Int2(0, 0);
        this.updatePos = new Int2(0, 0);
        this.upPos = new Int2(0, 0);

        this.is_down = false;
        this.is_longPress = false;
        this.is_init = false;
    }
}

class GameManager {
    cursor: Int4;
    size: Int4;
    volume: number;
    mines: number;

    lightSource: Pos4D;

    cellSize: number;
    cellInterval: number;

    gameclear: boolean;
    gameover: boolean;

    startTime: number;
    endTime: number;

    constructor() {
        this.cursor = new Int4(2, 2, 2, 2);
        this.size = new Int4(4, 4, 4, 4);
        this.volume = 4 * 4 * 4 * 4;
        this.mines = 10;

        this.lightSource = new Pos4D(800, 0, 0, 0);

        this.cellSize = 10;
        this.cellInterval = 50;

        this.gameclear = false;
        this.gameover = false;

        this.startTime = 0;
        this.endTime = 0;
    }
}

let gameArea = new GameArea();
let mouse = new Mouse();
let gameManager = new GameManager();

let fixedPlane: string, date: number, spotLight: boolean;

let canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];
let ctx = canvas.getContext("2d");
canvas.width = gameArea.canvas.x;
canvas.height = gameArea.canvas.y;

ctx!.fillStyle = "rgb(0, 0, 0)";
ctx?.fillRect(0, 0, canvas.width, canvas.height);

fixedPlane = "ux";

let cellIndexList: Int4[] = [];
let cellList: Cell[][][][] = [];
let controllerList: Controller[] = [];

let neighborList: Int4[] = [];
let haloList: Int4[] = [];

for(let i = -2; i < 3; ++i) {
    for(let j = -2; j < 3; ++j) {
        for(let k = -2; k < 3; ++k) {
            for(let l = -2; l < 3; ++l) {
                if(-1 <= i && i <= 1
                && -1 <= j && j <= 1
                && -1 <= k && k <= 1
                && -1 <= l && l <= 1) {
                    if(!(i == 0 && j == 0 && k == 0 && l == 0)) {
                        neighborList.push(new Int4(i, j, k, l));
                    }
                } else {
                    haloList.push(new Int4(i, j, k, l));
                }
            }
        }
    }
}

gameInitialize();

function cellIndexListInitialize(): void {
    cellIndexList = [];
    for(let i = 0; i < gameManager.size.u; ++i) {
        for(let j = 0; j < gameManager.size.x; ++j) {
            for(let k = 0; k < gameManager.size.y; ++k) {
                for(let l = 0; l < gameManager.size.z; ++l) {
                    cellIndexList.push(new Int4(i, j, k, l));
                }
            }
        }
    }
}

function controllerListInitialize(): void {
    controllerList = [];
    for(let i = 0; i < 2; ++i) {
        let sgn: number = 2 * i - 1;
        controllerList.push(new Controller(
            100 * sgn, 0, 0, 0, new Int4(sgn, 0, 0, 0), new Color(100 * i + 50, 100 * i + 75, 100 * i + 100)
        ));
        controllerList.push(new Controller(
            0, 100 * sgn, 0, 0, new Int4(0, sgn, 0, 0), new Color(200 * i, 100, 100)
        ));
        controllerList.push(new Controller(
            0, 0, 100 * sgn, 0, new Int4(0, 0, sgn, 0), new Color(100, 200 * i, 100)
        ));
        controllerList.push(new Controller(
            0, 0, 0, 100 * sgn, new Int4(0, 0, 0, sgn), new Color(100, 100, 200 * i)
        ));
    }
}

function cellListInitialize(): void {
    cellList = Array(gameManager.size.u);
    for(let i = 0; i < gameManager.size.u; ++i) {
        cellList[i] = Array(gameManager.size.x);
        for(let j = 0; j < gameManager.size.x; ++j) {
            cellList[i][j] = Array(gameManager.size.y);
            for(let k = 0; k < gameManager.size.y; ++k) {
                cellList[i][j][k] = Array(gameManager.size.z);
                for(let l = 0; l < gameManager.size.z; ++l) {
                    cellList[i][j][k][l] = new Cell(
                        gameManager.cellInterval * (i - (gameManager.size.u - 1) / 2),
                        gameManager.cellInterval * (j - (gameManager.size.x - 1) / 2),
                        gameManager.cellInterval * (k - (gameManager.size.y - 1) / 2),
                        gameManager.cellInterval * (l - (gameManager.size.z - 1) / 2),
                        new Int4(i, j, k, l)
                    )
                }
            }
        }
    }

    cellIndexListInitialize();

    dangerInitialize();

    for(let i = 0; i < cellIndexList.length; ++i) {
        let p: Int4 = cellIndexList[i];
        let neighbors: number = count(p);

        cellList[p.u][p.x][p.y][p.z].neighbors = neighbors;
        cellList[p.u][p.x][p.y][p.z].color = cellColor(neighbors);
        cellList[p.u][p.x][p.y][p.z].label = (cellList[p.u][p.x][p.y][p.z].danger)
            ? "b"
            : String(neighbors);
    }
}

function flagCounter(): number {
    let x: number = 0;
    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        if(cellList[p.u][p.x][p.y][p.z].flag
        && !cellList[p.u][p.x][p.y][p.z].demined) {
            x++;
        }
    }
    return x;
}

function modeChange(m: string): void {
    switch(m) {
        case "easy":
            gameManager.size = new Int4(4, 4, 4, 4);
            gameManager.volume = 4 * 4 * 4 * 4;
            gameManager.mines = 10;
            gameManager.lightSource = new Pos4D(400, 0, 0, 0);
            break;
        case "normal":
            gameManager.size = new Int4(6, 6, 6, 6);
            gameManager.volume = 6 * 6 * 6 * 6;
            gameManager.mines = 100;
            gameManager.lightSource = new Pos4D(600, 0, 0, 0);
            break;
        case "hard":
            gameManager.size = new Int4(8, 8, 8, 8);
            gameManager.volume = 8 * 8 * 8 * 8;
            gameManager.mines = 999;
            gameManager.lightSource = new Pos4D(800, 0, 0, 0);
            break;
    }
    
    gameInitialize();
}

function cellColor(x: number): Color {
    let R: number = (() => {
        switch(x % 4) {
            case 0:
                return 0x11;
            case 1:
                return 0x55;
            case 2:
                return 0x99;
            case 3:
                return 0xdd;
            default:
                return 0;
        }
    })();
    
    let G: number = (() => {
        switch(Math.floor(x / 2) % 4) {
            case 0:
                return 0x22;
            case 1:
                return 0x66;
            case 2:
                return 0xaa;
            case 3:
                return 0xee;
            default:
                return 0;
        }
    })();

    let B: number = (() => {
        switch(Math.floor(x / 3) % 4) {
            case 0:
                return 0x33;
            case 1:
                return 0x77;
            case 2:
                return 0xbb;
            case 3:
                return 0xff;
            default:
                return 0;
        }
    })();

    return new Color(R, G, B);
}

function gameClearJudge() {
    let counter: number = 0;
    for(let i = 0; i < cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        if(cellList[p.u][p.x][p.y][p.z].demined) {
            counter++;
        }
    }

    if(counter == (gameManager.volume - gameManager.mines)) {
        gameManager.gameclear = true;
        gameManager.gameover = true;
        mouse.is_init = false;
    }

    if(gameManager.gameclear) {
        console.log("game clear");
    }
}

function gameInitialize() {
    gameManager.gameover = false;
    gameManager.gameclear = false;
    
    gameManager.startTime = 0;
    gameManager.endTime = 0;

    mouse.is_init = false;

    mouse.downPos = new Int2(0, 0);
    mouse.updatePos = new Int2(0, 0);
    mouse.upPos = new Int2(0, 0);

    gameManager.cursor = new Int4(2, 2, 2, 2);

    controllerListInitialize();

    cellListInitialize();

    gameDisplay();
}

function dangerInitialize(): void {
    let mineIndex: number[] = [];
    let newIntFlag: boolean = true;

    while(mineIndex.length < gameManager.mines) {
        let rand: number = Math.floor(Math.random() * gameManager.volume);

        newIntFlag = true;

        for(let i = 0; i < mineIndex.length; ++i) {
            if(mineIndex[i] == rand) {
                newIntFlag = false;
                break;
            }
        }
        if(newIntFlag) {
            mineIndex.push(rand);
        }
    }

    for(let i = 0; i <gameManager.mines; ++i) {
        let p: Int4 = cellIndexList[mineIndex[i]];
        cellList[p.u][p.x][p.y][p.z].danger = true;
    }
}

function is_inBoard(p: Int4): boolean {
    if(p.u >= 0 && p.u < gameManager.size.u
    && p.x >= 0 && p.x < gameManager.size.x
    && p.y >= 0 && p.y < gameManager.size.y
    && p.z >= 0 && p.z < gameManager.size.z) {
        return true;    
    } else {
        return false;
    }
}

function demine(p: Int4): void {
    for(let i = 0; i < neighborList.length; ++i) {
        demine_internal(
            p.add(neighborList[i])
        );
    }
}

function demine_internal(p: Int4): void {
    if(is_inBoard(p)
    && !cellList[p.u][p.x][p.y][p.z].demined) {
        cellList[p.u][p.x][p.y][p.z].demined = true;
        if(is_safe(p)) {
            demine(p);
        }
    }

    return;
}

function is_safe(p: Int4): boolean {
    let ans: boolean = true;

    for(let i = 0; i < neighborList.length; ++i) {
        ans = ans && is_safe_internal(
            p.add(neighborList[i])
        );
    }

    return ans;
}

function is_safe_internal(p: Int4): boolean {
    if(!is_inBoard(p)) {
        return true;
    } else {
        if(cellList[p.u][p.x][p.y][p.z].danger) {
            return false;
        } else {
            return true;
        }
    }
}

function count(p: Int4): number {
    let sum: number = 0;
    
    for(let i = 0; i < neighborList.length; ++i) {
        sum += count_internal(
            p.add(neighborList[i])
        );
    }

    return sum;
}

function count_internal(p: Int4): number {
    if(!is_inBoard(p)) {
        return 0;
    } else {
        return cellList[p.u][p.x][p.y][p.z].danger ? 1 : 0;
    }
}

function sortList(list: any[]): any[] {
    for(let i = 0; i < list.length; ++i) {
        list[i].project();
        for(let j = i + 1; j < list.length; ++j) {
            list[j].project();
            if(list[i].cartesian.x > list[j].cartesian.x) {
                let t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
        }
    }
    return list;
}

function gameDisplay(): void {
    ctx!.fillStyle = "rgb(0, 0, 0)";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    let cellList_line: Cell[]= [];
    for(let i = 0; i <cellIndexList.length; ++i) {
        let p = cellIndexList[i];
        cellList_line.push(cellList[p.u][p.x][p.y][p.z]);
    }
    let sortCellList = sortList(cellList_line);

    for(let i = 0; i < gameManager.volume; ++i) {
        let object = sortCellList[i];
        object.project;

        let fy: number = object.cartesian.y;
        let fz: number = object.cartesian.z;
        let fr: number = gameManager.lightSource.u / (gameManager.lightSource.u - object.cartesian.x);
        let oy: number = canvas.width / 2;
        let oz: number = canvas.height * 3 / 8;
        let size = gameManager.cellSize;

        let iu: number = object.index.u;
        let ix: number = object.index.x;
        let iy: number = object.index.y;
        let iz: number = object.index.z;
        let onCursor: boolean
             = (gameManager.cursor.u == iu)
            && (gameManager.cursor.x == ix)
            && (gameManager.cursor.y == iy)
            && (gameManager.cursor.z == iz);

        let alpha: number = (() => {
            if(!spotLight) {
                return 1.0;
            }
            let onStrongLight: boolean = (() => {
                for(let i = 0; i < neighborList.length; ++i) {
                    if(gameManager.cursor.u + neighborList[i].u == iu
                    && gameManager.cursor.x + neighborList[i].x == ix
                    && gameManager.cursor.y + neighborList[i].y == iy
                    && gameManager.cursor.z + neighborList[i].z == iz) {
                        return true;
                    }
                }
                return false;
            })();
            
            let onWeekLight: boolean = (() => {
                for(let i = 0; i < haloList.length; ++i) {
                    if(gameManager.cursor.u + haloList[i].u == iu
                    && gameManager.cursor.x + haloList[i].x == ix
                    && gameManager.cursor.y + haloList[i].y == iy
                    && gameManager.cursor.z + haloList[i].z == iz) {
                        return true;
                    }
                }
                return false;
            })();

            if(onStrongLight || onCursor) {
                return 1.0;
            } else if(onWeekLight) {
                return 0.05;
            } else {
                return 0.005;
            }
        })();
        
        let cellColor: Color = (() => {
            if(onCursor) {
                return new Color(254, 254, 254);
            } else {
                if(!object.demined) {
                    return new Color(
                        Math.floor(fr * 100 + 44),
                        Math.floor(fr * 100),
                        Math.floor(fr * 100 + 22)
                    );
                } else {
                    return object.color;
                }
            }
        })();

        let cellText: string = (() => {
            if(!object.demined) {
                if(object.flag) {
                    return "f";
                } else {
                    return "";
                }
            } else {
                return object.label;
            }
        })();

        if(!(object.demined && (object.neighbors == 0))
        || onCursor) {
            ctx!.fillStyle = "rgba("
                + cellColor.r + ","
                + cellColor.g + ","
                + cellColor.b + ","
                + alpha + ")";

            ctx?.beginPath();
            ctx?.arc(
                fy * fr + oy, fz * fr + oz, size * fr,
                0, 2 * Math.PI, false
            );
            ctx?.fill();

            if(cellText != "0") {
                ctx!.strokeStyle = "rgba(1, 1, 1, " + alpha + ")";
                ctx?.strokeText(cellText, fy * fr + oy - 2, fz * fr + oz + 2);
            }
            if(gameManager.gameclear) {
                ctx!.strokeStyle = "rgb(254, 254, 254)";
                ctx?.strokeText("GAME CLEAR", canvas.width / 2, canvas.height / 2);
            } else if(gameManager.gameover) {
                ctx!.strokeStyle = "rgb(254, 254, 254)";
                ctx?.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
            }
        }
    }

    //controller
    let sortControllerList = sortList(controllerList);

    for(let i = 0; i < 8; ++i) {
        let object: Controller = sortControllerList[i];
        object.project();

        let cy: number = object.cartesian.y;
        let cz: number = object.cartesian.z;
        let cr: number = gameManager.lightSource.u / (gameManager.lightSource.u - object.cartesian.x);
        let oy: number = canvas.width / 2;
        let oz: number = canvas.height * 13 / 16;
        let size : number = gameManager.cellSize;

        ctx!.fillStyle = "rgb("
            + object.color.r + ","
            + object.color.g + ","
            + object.color.b + ")"; 
            
        ctx?.beginPath();
        ctx?.arc(
            cy * cr + oy, cz * cr + oz, size * cr,
            0, 2 * Math.PI, false
        );
        ctx?.fill();

        let label: string = (() => {
            if(object.index.u != 0) {
                return "u";
            } else if(object.index.x != 0) {
                return "x";
            } else if(object.index.y != 0) {
                return "y";
            } else if(object.index.z != 0) {
                return "z";
            } else {
                return "";
            }
        })();

        ctx!.strokeStyle = "rgb(254, 254, 254)";
        ctx?.strokeText(label, cy * cr * 1.4 + oy - 2.5, cz * cr * 1.4 + oz + 2.5);
        
        if(i == 3) {
            ctx!.fillStyle = "rgb(255, 255, 255)";
            ctx?.beginPath();
            ctx?.arc(oy, oz, 2 * size, 0, 2 * Math.PI, false);
            ctx?.fill();
        }
    }

    if(!gameManager.gameover) {
        gameManager.endTime = new Date().getTime();
    }

    ctx!.strokeStyle = "rgb(254, 254, 254)";
    ctx?.strokeText("Flag : " + flagCounter(), 20, canvas.width - 40);
    ctx?.strokeText("Time : " + Math.floor((gameManager.endTime - gameManager.startTime) / 1000),
                    20, canvas.height - 20);
    
    requestAnimationFrame(gameDisplay);
}

canvas.addEventListener("mousedown", e => {
    mouse.is_down = true;
    mouse.is_longPress = false;

    let target = e!.target as any;
    let rect = target!.getBoundingClientRect();
    let x: number = e.clientX - rect.left;
    let y: number = e.clientY - rect.top;
    mouse.downPos = new Int2(x, y);
    mouse.escapePos = new Int2(x, y);
    mouse.updatePos = new Int2(x, y);
});

canvas.addEventListener("mousemove", e => {
    let target = e!.target as any;
    let rect = target!.getBoundingClientRect();
    let x: number = e.clientX - rect.left;
    let y: number = e.clientY - rect.top;

    if(!mouse.is_longPress
    && Math.sqrt(
        (x - mouse.downPos.x) * (x - mouse.downPos.x)
        + (y - mouse.downPos.y) * (y - mouse.downPos.y)
    ) > 10) {
        mouse.is_longPress = true;
    }

    if(mouse.is_down) {

        mouse.updatePos = new Int2(x, y);
        let rotZ: number = (mouse.updatePos.x - mouse.escapePos.x) / 3;
        let rotY: number = (mouse.updatePos.y - mouse.escapePos.y) / 3;

        for(let i = 0; i < cellIndexList.length; ++i) {
            let p: Int4 = cellIndexList[i];
            cellList[p.u][p.x][p.y][p.z].rotate(0, rotZ, rotY, 0, rotZ, rotY);
        }

        for(let i = 0; i < 8; ++i) {
            controllerList[i].rotate(0, rotZ, rotY, 0, rotZ, rotY);
        }

        mouse.escapePos = new Int2(x, y);
    }
});

canvas.addEventListener("mouseup", e => {
    mouse.is_down = false;
    if(mouse.is_longPress) {
        mouse.is_longPress = false;
        return;
    }

    let target = e!.target as any;
    let rect = target.getBoundingClientRect();
    let x: number = e.clientX - rect.left;
    let y: number = e.clientY - rect.top;
    let p = ctx!.getImageData(x, y, 1, 1).data;

    if(p[0] == 255
    && p[1] == 255
    && p[2] == 255) {
        mouse.is_longPress = false;
        let p: Int4 = gameManager.cursor;
        let object: Cell = cellList[p.u][p.x][p.y][p.z];
        if(!object.demined && !object.flag) {
            cellList[p.u][p.x][p.y][p.z].demined = true;
            if(object.danger) {
                gameManager.gameover = true;
                mouse.is_init = false;
                gameManager.endTime = new Date().getTime();
            } else if(is_safe(p)) {
                demine(p);
            }

            if(!gameManager.gameover
            && !mouse.is_init) {
                gameManager.startTime = new Date().getTime();
                mouse.is_init = true;
            }
        }
    }
    
    if(p[0] == 50
    && p[1] == 75
    && p[2] == 100) {
        gameManager.cursor.u--;
        if(gameManager.cursor.u < 0) {
            gameManager.cursor.u += gameManager.size.u;
        }
    }

    if(p[0] == 150
    && p[1] == 175
    && p[2] == 200) {
        gameManager.cursor.u++;
        if(gameManager.cursor.u >= gameManager.size.u) {
            gameManager.cursor.u -= gameManager.size.u;
        }
    }


    if(p[0] == 0
    && p[1] == 100
    && p[2] == 100) {
        gameManager.cursor.x--;
        if(gameManager.cursor.x < 0) {
            gameManager.cursor.x += gameManager.size.x;
        }
    }

    if(p[0] == 200
    && p[1] == 100
    && p[2] == 100) {
        gameManager.cursor.x++;
        if(gameManager.cursor.x >= gameManager.size.x) {
            gameManager.cursor.x -= gameManager.size.x;
        }
    }


    if(p[0] == 100
    && p[1] == 0
    && p[2] == 100) {
        gameManager.cursor.y--;
        if(gameManager.cursor.y < 0) {
            gameManager.cursor.y += gameManager.size.y;
        }
    }

    if(p[0] == 100
    && p[1] == 200
    && p[2] == 100) {
        gameManager.cursor.y++;
        if(gameManager.cursor.y >= gameManager.size.y) {
            gameManager.cursor.y -= gameManager.size.y;
        }
    }


    if(p[0] == 100
    && p[1] == 100
    && p[2] == 0) {
        gameManager.cursor.z--;
        if(gameManager.cursor.z < 0) {
            gameManager.cursor.z += gameManager.size.z;
        }
    }

    if(p[0] == 100
    && p[1] == 100
    && p[2] == 200) {
        gameManager.cursor.z++;
        if(gameManager.cursor.z >= gameManager.size.z) {
            gameManager.cursor.z -= gameManager.size.z;
        }
    }

    mouse.is_longPress = false;
});

document.addEventListener("keydown", e => {
    switch(e.key) {
        case "f":
            let p: Int4 = gameManager.cursor;
            let object: Cell = cellList[p.u][p.x][p.y][p.z];
            if(object.flag && !object.demined) {
                cellList[p.u][p.x][p.y][p.z].flag = false;
            } else if(!object.flag && !object.demined) {
                cellList[p.u][p.x][p.y][p.z].flag = true;
            }
            break;
        case "s":
            if(spotLight) {
                spotLight = false;
            } else {
                spotLight = true;
            }
            break;
        case "e":
            modeChange("easy");
            break;
        case "n":
            modeChange("normal");
            break;
        case "h":
            modeChange("hard");
            break;
        case "r":
            gameInitialize();
            break;
    }

    let keyRot1: number = 0, keyRot2: number = 0;

    if(e.ctrlKey) {
        switch(e.key) {
            case "ArrowLeft":
                keyRot1 = -10;
                break;
            case "ArrowRight":
                keyRot1 = 10;
                break;
            case "ArrowUp":
                keyRot2 = -10;
                break;
            case "ArrowDown":
                keyRot2 = 10;
                break;
            default:
                break;
        }
    } else if(e.shiftKey) {
        switch(e.key) {
            case "ArrowLeft":
                gameManager.cursor.u -= 1;
                if(gameManager.cursor.u < 0) {
                    gameManager.cursor.u += gameManager.size.u;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.u += 1;
                if(gameManager.cursor.u >= gameManager.size.u) {
                    gameManager.cursor.u -= gameManager.size.u;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.x -= 1;
                if(gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.x += 1;
                if(gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
            default:
                break;

        }
    } else {
        switch(e.key) {
            case "Enter":
                mouse.is_longPress = false;
                let p: Int4 = gameManager.cursor;
                let object = cellList[p.u][p.x][p.y][p.z];
                if(!object.demined && !object.flag) {
                    cellList[p.u][p.x][p.y][p.z].demined = true;
                    if(object.danger) {
                        gameManager.gameover = true;
                        mouse.is_init = false;
                        gameManager.endTime = new Date().getTime();
                    } else if(is_safe(p)) {
                        demine(p);
                    }

                    if(!gameManager.gameover
                    && !mouse.is_init) {
                        gameManager.startTime = new Date().getTime();
                        mouse.is_init;
                    }
                }
                break;
            case "ArrowLeft":
                gameManager.cursor.y -= 1;
                if(gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.y += 1;
                if(gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.z -= 1;
                if(gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.z += 1;
                if(gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
            default:
                break;

        }

    }

    for(let i = 0; i < cellIndexList.length; ++i) {
        let p: Int4 = cellIndexList[i];
        cellList[p.u][p.x][p.y][p.z].rotate(0, keyRot1, keyRot2,0, 0, 0);
    }

    for(let i = 0; i < 8; ++i) {
        controllerList[i].rotate(0, keyRot1, keyRot2, 0, 0, 0);
    }

});
