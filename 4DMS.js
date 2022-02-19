var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Int2 = /** @class */ (function () {
    function Int2(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
    return Int2;
}());
var Int3 = /** @class */ (function () {
    function Int3(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    return Int3;
}());
var Int4 = /** @class */ (function () {
    function Int4(_u, _x, _y, _z) {
        this.u = _u;
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    Int4.prototype.add = function (other) {
        return new Int4(this.u + other.u, this.x + other.x, this.y + other.y, this.z + other.z);
    };
    return Int4;
}());
var Color = /** @class */ (function () {
    function Color(_r, _g, _b) {
        this.r = _r;
        this.g = _g;
        this.b = _b;
    }
    return Color;
}());
var Pos3D = /** @class */ (function () {
    function Pos3D(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    return Pos3D;
}());
var Pos4D = /** @class */ (function () {
    function Pos4D(_u, _x, _y, _z) {
        this.u = _u;
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    return Pos4D;
}());
var Object4D = /** @class */ (function (_super) {
    __extends(Object4D, _super);
    function Object4D(_u, _x, _y, _z, _index) {
        var _this = _super.call(this, _u, _x, _y, _z) || this;
        _this.index = _index;
        _this.cartesian = new Pos3D(0, 0, 0);
        _this.project();
        return _this;
    }
    Object4D.prototype.project = function () {
        var f = gameManager.lightSource.u;
        this.cartesian = new Pos3D(f / (f - this.u) * this.x, f / (f - this.u) * this.y, f / (f - this.u) * this.z);
    };
    Object4D.prototype.projectParallel = function () {
        this.cartesian = new Pos3D(this.x, this.y, this.z);
    };
    Object4D.prototype.Euler = function (a, b, c) {
        var ra, rb, rc, ca, sa, cb, sb, sc, cc;
        ra = a * 2 * Math.PI / 360;
        rb = b * 2 * Math.PI / 360;
        rc = c * 2 * Math.PI / 360;
        ca = Math.cos(ra / 2);
        sa = Math.sin(ra / 2);
        cb = Math.cos(rb / 2);
        sb = Math.sin(rb / 2);
        cc = Math.cos(rc / 2);
        sc = Math.sin(rc / 2);
        return new Pos4D(ca * cb * cc + sa * sb * sc, sa * cb * cc - ca * sb * sc, ca * sb * cc + sa * cb * sc, ca * cb * sc - sa * sb * cc);
    };
    Object4D.prototype.mlt = function (l, r) {
        return new Pos4D(l.u * r.u - l.x * r.x - l.y * r.y - l.z * r.z, l.u * r.x + l.x * r.u + l.y * r.z - l.z * r.y, l.u * r.y - l.x * r.z + l.y * r.u + l.z * r.x, l.u * r.z + l.x * r.y - l.y * r.x + l.z * r.u);
    };
    Object4D.prototype.rotate = function (x1, y1, z1, x2, y2, z2) {
        var p = this.mlt(this.mlt(this.Euler(x1, y1, z1), new Pos4D(this.u, this.x, this.y, this.z)), this.Euler(x2, y2, z2));
        this.u = p.u;
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
    };
    return Object4D;
}(Pos4D));
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(_u, _x, _y, _z, _index) {
        var _this = _super.call(this, _u, _x, _y, _z, _index) || this;
        _this.neighbors = 0;
        _this.color = new Color(0, 0, 0);
        _this.danger = false;
        _this.demined = false;
        _this.flag = false;
        _this.label = "";
        return _this;
    }
    return Cell;
}(Object4D));
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller(_u, _x, _y, _z, _index, _color) {
        var _this = _super.call(this, _u, _x, _y, _z, _index) || this;
        _this.color = _color;
        return _this;
    }
    return Controller;
}(Object4D));
var GameArea = /** @class */ (function () {
    function GameArea() {
        this.canvas = new Int2(800, 800);
    }
    return GameArea;
}());
var Mouse = /** @class */ (function () {
    function Mouse() {
        this.downPos = new Int2(0, 0);
        this.escapePos = new Int2(0, 0);
        this.updatePos = new Int2(0, 0);
        this.upPos = new Int2(0, 0);
        this.is_down = false;
        this.is_longPress = false;
        this.is_init = false;
    }
    return Mouse;
}());
var GameManager = /** @class */ (function () {
    function GameManager() {
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
    return GameManager;
}());
var gameArea = new GameArea();
var mouse = new Mouse();
var gameManager = new GameManager();
var fixedPlane, date, spotLight;
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
canvas.width = gameArea.canvas.x;
canvas.height = gameArea.canvas.y;
ctx.fillStyle = "rgb(0, 0, 0)";
ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(0, 0, canvas.width, canvas.height);
fixedPlane = "ux";
var cellIndexList = [];
var cellList = [];
var controllerList = [];
var neighborList = [];
var haloList = [];
for (var i = -2; i < 3; ++i) {
    for (var j = -2; j < 3; ++j) {
        for (var k = -2; k < 3; ++k) {
            for (var l = -2; l < 3; ++l) {
                if (-1 <= i && i <= 1
                    && -1 <= j && j <= 1
                    && -1 <= k && k <= 1
                    && -1 <= l && l <= 1) {
                    if (!(i == 0 && j == 0 && k == 0 && l == 0)) {
                        neighborList.push(new Int4(i, j, k, l));
                    }
                }
                else {
                    haloList.push(new Int4(i, j, k, l));
                }
            }
        }
    }
}
gameInitialize();
function cellIndexListInitialize() {
    cellIndexList = [];
    for (var i = 0; i < gameManager.size.u; ++i) {
        for (var j = 0; j < gameManager.size.x; ++j) {
            for (var k = 0; k < gameManager.size.y; ++k) {
                for (var l = 0; l < gameManager.size.z; ++l) {
                    cellIndexList.push(new Int4(i, j, k, l));
                }
            }
        }
    }
}
function controllerListInitialize() {
    controllerList = [];
    for (var i = 0; i < 2; ++i) {
        var sgn = 2 * i - 1;
        controllerList.push(new Controller(100 * sgn, 0, 0, 0, new Int4(sgn, 0, 0, 0), new Color(100 * i + 50, 100 * i + 75, 100 * i + 100)));
        controllerList.push(new Controller(0, 100 * sgn, 0, 0, new Int4(0, sgn, 0, 0), new Color(200 * i, 100, 100)));
        controllerList.push(new Controller(0, 0, 100 * sgn, 0, new Int4(0, 0, sgn, 0), new Color(100, 200 * i, 100)));
        controllerList.push(new Controller(0, 0, 0, 100 * sgn, new Int4(0, 0, 0, sgn), new Color(100, 100, 200 * i)));
    }
}
function cellListInitialize() {
    cellList = Array(gameManager.size.u);
    for (var i = 0; i < gameManager.size.u; ++i) {
        cellList[i] = Array(gameManager.size.x);
        for (var j = 0; j < gameManager.size.x; ++j) {
            cellList[i][j] = Array(gameManager.size.y);
            for (var k = 0; k < gameManager.size.y; ++k) {
                cellList[i][j][k] = Array(gameManager.size.z);
                for (var l = 0; l < gameManager.size.z; ++l) {
                    cellList[i][j][k][l] = new Cell(gameManager.cellInterval * (i - (gameManager.size.u - 1) / 2), gameManager.cellInterval * (j - (gameManager.size.x - 1) / 2), gameManager.cellInterval * (k - (gameManager.size.y - 1) / 2), gameManager.cellInterval * (l - (gameManager.size.z - 1) / 2), new Int4(i, j, k, l));
                }
            }
        }
    }
    cellIndexListInitialize();
    dangerInitialize();
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        var neighbors = count(p);
        cellList[p.u][p.x][p.y][p.z].neighbors = neighbors;
        cellList[p.u][p.x][p.y][p.z].color = cellColor(neighbors);
        cellList[p.u][p.x][p.y][p.z].label = (cellList[p.u][p.x][p.y][p.z].danger)
            ? "b"
            : String(neighbors);
    }
}
function flagCounter() {
    var x = 0;
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        if (cellList[p.u][p.x][p.y][p.z].flag
            && !cellList[p.u][p.x][p.y][p.z].demined) {
            x++;
        }
    }
    return x;
}
function modeChange(m) {
    switch (m) {
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
function cellColor(x) {
    var R = (function () {
        switch (x % 4) {
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
    var G = (function () {
        switch (Math.floor(x / 2) % 4) {
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
    var B = (function () {
        switch (Math.floor(x / 3) % 4) {
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
    var counter = 0;
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        if (cellList[p.u][p.x][p.y][p.z].demined) {
            counter++;
        }
    }
    if (counter == (gameManager.volume - gameManager.mines)) {
        gameManager.gameclear = true;
        gameManager.gameover = true;
        mouse.is_init = false;
    }
    if (gameManager.gameclear) {
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
function dangerInitialize() {
    var mineIndex = [];
    var newIntFlag = true;
    while (mineIndex.length < gameManager.mines) {
        var rand = Math.floor(Math.random() * gameManager.volume);
        newIntFlag = true;
        for (var i = 0; i < mineIndex.length; ++i) {
            if (mineIndex[i] == rand) {
                newIntFlag = false;
                break;
            }
        }
        if (newIntFlag) {
            mineIndex.push(rand);
        }
    }
    for (var i = 0; i < gameManager.mines; ++i) {
        var p = cellIndexList[mineIndex[i]];
        cellList[p.u][p.x][p.y][p.z].danger = true;
    }
}
function is_inBoard(p) {
    if (p.u >= 0 && p.u < gameManager.size.u
        && p.x >= 0 && p.x < gameManager.size.x
        && p.y >= 0 && p.y < gameManager.size.y
        && p.z >= 0 && p.z < gameManager.size.z) {
        return true;
    }
    else {
        return false;
    }
}
function demine(p) {
    for (var i = 0; i < neighborList.length; ++i) {
        demine_internal(p.add(neighborList[i]));
    }
}
function demine_internal(p) {
    if (is_inBoard(p)
        && !cellList[p.u][p.x][p.y][p.z].demined) {
        cellList[p.u][p.x][p.y][p.z].demined = true;
        if (is_safe(p)) {
            demine(p);
        }
    }
    return;
}
function is_safe(p) {
    var ans = true;
    for (var i = 0; i < neighborList.length; ++i) {
        ans = ans && is_safe_internal(p.add(neighborList[i]));
    }
    return ans;
}
function is_safe_internal(p) {
    if (!is_inBoard(p)) {
        return true;
    }
    else {
        if (cellList[p.u][p.x][p.y][p.z].danger) {
            return false;
        }
        else {
            return true;
        }
    }
}
function count(p) {
    var sum = 0;
    for (var i = 0; i < neighborList.length; ++i) {
        sum += count_internal(p.add(neighborList[i]));
    }
    return sum;
}
function count_internal(p) {
    if (!is_inBoard(p)) {
        return 0;
    }
    else {
        return cellList[p.u][p.x][p.y][p.z].danger ? 1 : 0;
    }
}
function sortList(list) {
    for (var i = 0; i < list.length; ++i) {
        list[i].project();
        for (var j = i + 1; j < list.length; ++j) {
            list[j].project();
            if (list[i].cartesian.x > list[j].cartesian.x) {
                var t = list[i];
                list[i] = list[j];
                list[j] = t;
            }
        }
    }
    return list;
}
function gameDisplay() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(0, 0, canvas.width, canvas.height);
    var cellList_line = [];
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        cellList_line.push(cellList[p.u][p.x][p.y][p.z]);
    }
    var sortCellList = sortList(cellList_line);
    var _loop_1 = function (i) {
        var object = sortCellList[i];
        object.project;
        var fy = object.cartesian.y;
        var fz = object.cartesian.z;
        var fr = gameManager.lightSource.u / (gameManager.lightSource.u - object.cartesian.x);
        var oy = canvas.width / 2;
        var oz = canvas.height * 3 / 8;
        var size = gameManager.cellSize;
        var iu = object.index.u;
        var ix = object.index.x;
        var iy = object.index.y;
        var iz = object.index.z;
        var onCursor = (gameManager.cursor.u == iu)
            && (gameManager.cursor.x == ix)
            && (gameManager.cursor.y == iy)
            && (gameManager.cursor.z == iz);
        var alpha = (function () {
            if (!spotLight) {
                return 1.0;
            }
            var onStrongLight = (function () {
                for (var i_1 = 0; i_1 < neighborList.length; ++i_1) {
                    if (gameManager.cursor.u + neighborList[i_1].u == iu
                        && gameManager.cursor.x + neighborList[i_1].x == ix
                        && gameManager.cursor.y + neighborList[i_1].y == iy
                        && gameManager.cursor.z + neighborList[i_1].z == iz) {
                        return true;
                    }
                }
                return false;
            })();
            var onWeekLight = (function () {
                for (var i_2 = 0; i_2 < haloList.length; ++i_2) {
                    if (gameManager.cursor.u + haloList[i_2].u == iu
                        && gameManager.cursor.x + haloList[i_2].x == ix
                        && gameManager.cursor.y + haloList[i_2].y == iy
                        && gameManager.cursor.z + haloList[i_2].z == iz) {
                        return true;
                    }
                }
                return false;
            })();
            if (onStrongLight || onCursor) {
                return 1.0;
            }
            else if (onWeekLight) {
                return 0.05;
            }
            else {
                return 0.005;
            }
        })();
        var cellColor_1 = (function () {
            if (onCursor) {
                return new Color(254, 254, 254);
            }
            else {
                if (!object.demined) {
                    return new Color(Math.floor(fr * 100 + 44), Math.floor(fr * 100), Math.floor(fr * 100 + 22));
                }
                else {
                    return object.color;
                }
            }
        })();
        var cellText = (function () {
            if (!object.demined) {
                if (object.flag) {
                    return "f";
                }
                else {
                    return "";
                }
            }
            else {
                return object.label;
            }
        })();
        if (!(object.demined && (object.neighbors == 0))
            || onCursor) {
            ctx.fillStyle = "rgba("
                + cellColor_1.r + ","
                + cellColor_1.g + ","
                + cellColor_1.b + ","
                + alpha + ")";
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.arc(fy * fr + oy, fz * fr + oz, size * fr, 0, 2 * Math.PI, false);
            ctx === null || ctx === void 0 ? void 0 : ctx.fill();
            if (cellText != "0") {
                ctx.strokeStyle = "rgba(1, 1, 1, " + alpha + ")";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText(cellText, fy * fr + oy - 2, fz * fr + oz + 2);
            }
            if (gameManager.gameclear) {
                ctx.strokeStyle = "rgb(254, 254, 254)";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("GAME CLEAR", canvas.width / 2, canvas.height / 2);
            }
            else if (gameManager.gameover) {
                ctx.strokeStyle = "rgb(254, 254, 254)";
                ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
            }
        }
    };
    for (var i = 0; i < gameManager.volume; ++i) {
        _loop_1(i);
    }
    //controller
    var sortControllerList = sortList(controllerList);
    var _loop_2 = function (i) {
        var object = sortControllerList[i];
        object.project();
        var cy = object.cartesian.y;
        var cz = object.cartesian.z;
        var cr = gameManager.lightSource.u / (gameManager.lightSource.u - object.cartesian.x);
        var oy = canvas.width / 2;
        var oz = canvas.height * 13 / 16;
        var size = gameManager.cellSize;
        ctx.fillStyle = "rgb("
            + object.color.r + ","
            + object.color.g + ","
            + object.color.b + ")";
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        ctx === null || ctx === void 0 ? void 0 : ctx.arc(cy * cr + oy, cz * cr + oz, size * cr, 0, 2 * Math.PI, false);
        ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        var label = (function () {
            if (object.index.u != 0) {
                return "u";
            }
            else if (object.index.x != 0) {
                return "x";
            }
            else if (object.index.y != 0) {
                return "y";
            }
            else if (object.index.z != 0) {
                return "z";
            }
            else {
                return "";
            }
        })();
        ctx.strokeStyle = "rgb(254, 254, 254)";
        ctx === null || ctx === void 0 ? void 0 : ctx.strokeText(label, cy * cr * 1.4 + oy - 2.5, cz * cr * 1.4 + oz + 2.5);
        if (i == 3) {
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
            ctx === null || ctx === void 0 ? void 0 : ctx.arc(oy, oz, 2 * size, 0, 2 * Math.PI, false);
            ctx === null || ctx === void 0 ? void 0 : ctx.fill();
        }
    };
    for (var i = 0; i < 8; ++i) {
        _loop_2(i);
    }
    if (!gameManager.gameover) {
        gameManager.endTime = new Date().getTime();
    }
    ctx.strokeStyle = "rgb(254, 254, 254)";
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("Flag : " + flagCounter(), 20, canvas.width - 40);
    ctx === null || ctx === void 0 ? void 0 : ctx.strokeText("Time : " + Math.floor((gameManager.endTime - gameManager.startTime) / 1000), 20, canvas.height - 20);
    requestAnimationFrame(gameDisplay);
}
canvas.addEventListener("mousedown", function (e) {
    mouse.is_down = true;
    mouse.is_longPress = false;
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    mouse.downPos = new Int2(x, y);
    mouse.escapePos = new Int2(x, y);
    mouse.updatePos = new Int2(x, y);
});
canvas.addEventListener("mousemove", function (e) {
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    if (!mouse.is_longPress
        && Math.sqrt((x - mouse.downPos.x) * (x - mouse.downPos.x)
            + (y - mouse.downPos.y) * (y - mouse.downPos.y)) > 10) {
        mouse.is_longPress = true;
    }
    if (mouse.is_down) {
        mouse.updatePos = new Int2(x, y);
        var rotZ = (mouse.updatePos.x - mouse.escapePos.x) / 3;
        var rotY = (mouse.updatePos.y - mouse.escapePos.y) / 3;
        for (var i = 0; i < cellIndexList.length; ++i) {
            var p = cellIndexList[i];
            cellList[p.u][p.x][p.y][p.z].rotate(0, rotZ, rotY, 0, rotZ, rotY);
        }
        for (var i = 0; i < 8; ++i) {
            controllerList[i].rotate(0, rotZ, rotY, 0, rotZ, rotY);
        }
        mouse.escapePos = new Int2(x, y);
    }
});
canvas.addEventListener("mouseup", function (e) {
    mouse.is_down = false;
    if (mouse.is_longPress) {
        mouse.is_longPress = false;
        return;
    }
    var target = e.target;
    var rect = target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var p = ctx.getImageData(x, y, 1, 1).data;
    if (p[0] == 255
        && p[1] == 255
        && p[2] == 255) {
        mouse.is_longPress = false;
        var p_1 = gameManager.cursor;
        var object = cellList[p_1.u][p_1.x][p_1.y][p_1.z];
        if (!object.demined && !object.flag) {
            cellList[p_1.u][p_1.x][p_1.y][p_1.z].demined = true;
            if (object.danger) {
                gameManager.gameover = true;
                mouse.is_init = false;
                gameManager.endTime = new Date().getTime();
            }
            else if (is_safe(p_1)) {
                demine(p_1);
            }
            if (!gameManager.gameover
                && !mouse.is_init) {
                gameManager.startTime = new Date().getTime();
                mouse.is_init = true;
            }
        }
    }
    if (p[0] == 50
        && p[1] == 75
        && p[2] == 100) {
        gameManager.cursor.u--;
        if (gameManager.cursor.u < 0) {
            gameManager.cursor.u += gameManager.size.u;
        }
    }
    if (p[0] == 150
        && p[1] == 175
        && p[2] == 200) {
        gameManager.cursor.u++;
        if (gameManager.cursor.u >= gameManager.size.u) {
            gameManager.cursor.u -= gameManager.size.u;
        }
    }
    if (p[0] == 0
        && p[1] == 100
        && p[2] == 100) {
        gameManager.cursor.x--;
        if (gameManager.cursor.x < 0) {
            gameManager.cursor.x += gameManager.size.x;
        }
    }
    if (p[0] == 200
        && p[1] == 100
        && p[2] == 100) {
        gameManager.cursor.x++;
        if (gameManager.cursor.x >= gameManager.size.x) {
            gameManager.cursor.x -= gameManager.size.x;
        }
    }
    if (p[0] == 100
        && p[1] == 0
        && p[2] == 100) {
        gameManager.cursor.y--;
        if (gameManager.cursor.y < 0) {
            gameManager.cursor.y += gameManager.size.y;
        }
    }
    if (p[0] == 100
        && p[1] == 200
        && p[2] == 100) {
        gameManager.cursor.y++;
        if (gameManager.cursor.y >= gameManager.size.y) {
            gameManager.cursor.y -= gameManager.size.y;
        }
    }
    if (p[0] == 100
        && p[1] == 100
        && p[2] == 0) {
        gameManager.cursor.z--;
        if (gameManager.cursor.z < 0) {
            gameManager.cursor.z += gameManager.size.z;
        }
    }
    if (p[0] == 100
        && p[1] == 100
        && p[2] == 200) {
        gameManager.cursor.z++;
        if (gameManager.cursor.z >= gameManager.size.z) {
            gameManager.cursor.z -= gameManager.size.z;
        }
    }
    mouse.is_longPress = false;
});
document.addEventListener("keydown", function (e) {
    switch (e.key) {
        case "f":
            var p = gameManager.cursor;
            var object = cellList[p.u][p.x][p.y][p.z];
            if (object.flag && !object.demined) {
                cellList[p.u][p.x][p.y][p.z].flag = false;
            }
            else if (!object.flag && !object.demined) {
                cellList[p.u][p.x][p.y][p.z].flag = true;
            }
            break;
        case "s":
            if (spotLight) {
                spotLight = false;
            }
            else {
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
    var keyRot1 = 0, keyRot2 = 0;
    if (e.ctrlKey) {
        switch (e.key) {
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
    }
    else if (e.shiftKey) {
        switch (e.key) {
            case "ArrowLeft":
                gameManager.cursor.u -= 1;
                if (gameManager.cursor.u < 0) {
                    gameManager.cursor.u += gameManager.size.u;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.u += 1;
                if (gameManager.cursor.u >= gameManager.size.u) {
                    gameManager.cursor.u -= gameManager.size.u;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.x -= 1;
                if (gameManager.cursor.x < 0) {
                    gameManager.cursor.x += gameManager.size.x;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.x += 1;
                if (gameManager.cursor.x >= gameManager.size.x) {
                    gameManager.cursor.x -= gameManager.size.x;
                }
                break;
            default:
                break;
        }
    }
    else {
        switch (e.key) {
            case "Enter":
                mouse.is_longPress = false;
                var p = gameManager.cursor;
                var object = cellList[p.u][p.x][p.y][p.z];
                if (!object.demined && !object.flag) {
                    cellList[p.u][p.x][p.y][p.z].demined = true;
                    if (object.danger) {
                        gameManager.gameover = true;
                        mouse.is_init = false;
                        gameManager.endTime = new Date().getTime();
                    }
                    else if (is_safe(p)) {
                        demine(p);
                    }
                    if (!gameManager.gameover
                        && !mouse.is_init) {
                        gameManager.startTime = new Date().getTime();
                        mouse.is_init;
                    }
                }
                break;
            case "ArrowLeft":
                gameManager.cursor.y -= 1;
                if (gameManager.cursor.y < 0) {
                    gameManager.cursor.y += gameManager.size.y;
                }
                break;
            case "ArrowRight":
                gameManager.cursor.y += 1;
                if (gameManager.cursor.y >= gameManager.size.y) {
                    gameManager.cursor.y -= gameManager.size.y;
                }
                break;
            case "ArrowUp":
                gameManager.cursor.z -= 1;
                if (gameManager.cursor.z < 0) {
                    gameManager.cursor.z += gameManager.size.z;
                }
                break;
            case "ArrowDown":
                gameManager.cursor.z += 1;
                if (gameManager.cursor.z >= gameManager.size.z) {
                    gameManager.cursor.z -= gameManager.size.z;
                }
                break;
            default:
                break;
        }
    }
    for (var i = 0; i < cellIndexList.length; ++i) {
        var p = cellIndexList[i];
        cellList[p.u][p.x][p.y][p.z].rotate(0, keyRot1, keyRot2, 0, 0, 0);
    }
    for (var i = 0; i < 8; ++i) {
        controllerList[i].rotate(0, keyRot1, keyRot2, 0, 0, 0);
    }
});
