// Хавз — пруд с кои, нарисованный символами на <canvas>.
// Собственная реализация с нуля: World (симуляция), Renderer (отрисовка), Pond (движок страницы).
// Лицензия MIT.

export const TAU = Math.PI * 2;

/** Детерминированный генератор случайных чисел, чтобы ?seed= давал одну и ту же картину. */
export function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Целочисленный хеш в [0, 1): символы на теле не мигают от кадра к кадру. */
export function hash2(a, b) {
    let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => a + (b - a) * t;
function angleDiff(a, b) {
    let d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
}

const VARIETY_WEIGHTS = [
    ['kohaku', 3],
    ['sanke', 2],
    ['tancho', 1],
    ['showa', 1],
];
export const VARIETY_NAMES = { kohaku: 'кохаку', sanke: 'санке', tancho: 'танчо', showa: 'сёва' };
const HALF_W = 3; // максимум клеток в каждую сторону от хребта

function pickVariety(rnd) {
    let r = rnd() * 7;
    for (const [v, w] of VARIETY_WEIGHTS) {
        r -= w;
        if (r <= 0) return v;
    }
    return 'kohaku';
}

/**
 * Рисунок рыбы: для каждого узла хребта — цвет клеток j ∈ [-3..3].
 * 'w' белый, 'r' красный, 'k' чёрный. Кохаку — красные пятна на белом, санке — плюс чёрные точки,
 * танчо — одно красное пятно на голове, сёва — чёрная основа с белым и красным.
 */
export function makePattern(variety, len, rnd) {
    const patches = [];
    if (variety === 'tancho') {
        patches.push({ start: 0.03, end: 0.2, side: 0, width: 1.5, color: 'r' });
    } else {
        const count = 1 + Math.floor(rnd() * 3);
        for (let p = 0; p < count; p++) {
            const start = 0.06 + rnd() * 0.6;
            patches.push({
                start,
                end: start + 0.14 + rnd() * 0.32,
                side: (rnd() - 0.5) * 3,
                width: 1.7 + rnd() * 2.2,
                color: variety === 'showa' && rnd() < 0.5 ? 'w' : 'r',
            });
        }
    }
    const spots = [];
    if (variety === 'sanke' || variety === 'showa') {
        const m = 2 + Math.floor(rnd() * 4);
        for (let s = 0; s < m; s++) {
            spots.push({ u: 0.15 + rnd() * 0.7, side: (rnd() - 0.5) * 4, r: 0.7 + rnd() * 1.1, color: variety === 'showa' ? 'w' : 'k' });
        }
    }
    const rows = [];
    for (let i = 0; i < len; i++) {
        const u = i / (len - 1);
        const row = [];
        for (let j = -HALF_W; j <= HALF_W; j++) {
            let c = variety === 'showa' ? 'k' : 'w';
            for (const p of patches) {
                if (u < p.start || u > p.end) continue;
                const t = (u - p.start) / (p.end - p.start);
                const shape = Math.sqrt(Math.sin(Math.PI * t));
                if (Math.abs(j - p.side) <= p.width * shape) c = p.color;
            }
            for (const s of spots) {
                const di = ((u - s.u) * (len - 1)) / 1.6;
                const dj = j - s.side;
                if (di * di + dj * dj <= s.r * s.r) c = s.color;
            }
            row.push(c);
        }
        rows.push(row);
    }
    return rows;
}

/** Симуляция: рыбы, корм, круги на воде, укусы, курсор, зоны, которые рыбы обходят. */
export class World {
    constructor({ seed = null, koiCount = 7 } = {}) {
        this.rnd = seed == null ? Math.random : mulberry32(seed);
        this.koiCount = koiCount;
        this.w = 0;
        this.h = 0;
        this.time = 0;
        this.koi = [];
        this.pellets = [];
        this.ripples = [];
        this.bites = [];
        this.pointer = { x: 0, y: 0, active: false, speed: 0 };
        this.avoid = [];
        this.nextId = 1;
    }

    resize(w, h) {
        const first = this.w === 0;
        this.w = w;
        this.h = h;
        if (first) for (let i = 0; i < this.koiCount; i++) this.koi.push(this.makeKoi());
        for (const k of this.koi) this.keepInside(k);
    }

    makeKoi(opts = {}) {
        const rnd = this.rnd;
        const variety = opts.variety || pickVariety(rnd);
        const len = opts.len || 15 + Math.floor(rnd() * 6);
        const seg = opts.seg || 9;
        const x = opts.x ?? rnd() * this.w;
        const y = opts.y ?? rnd() * this.h;
        const heading = opts.heading ?? rnd() * TAU;
        const nodes = new Float32Array(len * 2);
        for (let i = 0; i < len; i++) {
            nodes[i * 2] = x - Math.cos(heading) * seg * i;
            nodes[i * 2 + 1] = y - Math.sin(heading) * seg * i;
        }
        const seed = opts.seed ?? Math.floor(rnd() * 1e9);
        return {
            id: this.nextId++,
            variety,
            len,
            seg,
            nodes,
            heading,
            speed: 24,
            baseSpeed: 20 + rnd() * 10,
            phase: rnd() * TAU,
            beat: 0.4,
            wander: 0,
            wanderT: 0,
            curiosity: 0.3 + rnd() * 0.7,
            depth: 1,
            depthTarget: 1,
            nextDive: 3 + rnd() * 10,
            burstUntil: 0,
            nextBurst: 1 + rnd() * 3,
            startle: 0,
            fleeX: 0,
            fleeY: 0,
            food: null,
            rush: 0,
            gulp: 0,
            turn: 0,
            nextWake: 0,
            seed,
            pattern: makePattern(variety, len, mulberry32(seed)),
        };
    }

    /** Бросить корм в точку (x, y). Рыбы поблизости срываются с места. */
    feed(x, y) {
        this.pellets.push({ x, y, born: this.time, landAt: 0.45, landed: false, vx: (this.rnd() - 0.5) * 6, vy: (this.rnd() - 0.5) * 6 });
        this.ripples.push({ x, y, born: this.time + 0.45, strength: 0.6 });
        for (const k of this.koi) {
            const d = Math.hypot(k.nodes[0] - x, k.nodes[1] - y);
            if (d < 620) k.rush = Math.max(k.rush, 1 - d / 720);
        }
    }

    keepInside(k) {
        k.nodes[0] = clamp(k.nodes[0], 4, this.w - 4);
        k.nodes[1] = clamp(k.nodes[1], 4, this.h - 4);
    }

    step(dt) {
        this.time += dt;
        const t = this.time;
        const rnd = this.rnd;

        for (const p of this.pellets) {
            if (!p.landed && t - p.born >= p.landAt) p.landed = true;
            if (p.landed) {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.vx *= 0.995;
                p.vy *= 0.995;
            }
        }
        this.ripples = this.ripples.filter((r) => t - r.born < 2.6);
        this.bites = this.bites.filter((b) => t - b.born < 0.5);

        const ptr = this.pointer;
        for (const k of this.koi) {
            const hx = k.nodes[0];
            const hy = k.nodes[1];

            // Блуждание: плавно меняем желаемый курс.
            k.wanderT -= dt;
            if (k.wanderT <= 0) {
                k.wander = (rnd() - 0.5) * 1.4;
                k.wanderT = 0.6 + rnd() * 2.2;
            }
            let sx = Math.cos(k.heading + k.wander);
            let sy = Math.sin(k.heading + k.wander);

            // Края пруда.
            const m = 90;
            if (hx < m) sx += ((m - hx) / m) * 2.5;
            if (hx > this.w - m) sx -= ((hx - (this.w - m)) / m) * 2.5;
            if (hy < m) sy += ((m - hy) / m) * 2.5;
            if (hy > this.h - m) sy -= ((hy - (this.h - m)) / m) * 2.5;

            // Текст: обходим стороной.
            for (const b of this.avoid) {
                const pad = 40;
                const cx = clamp(hx, b.left, b.right);
                const cy = clamp(hy, b.top, b.bottom);
                const dx = hx - cx;
                const dy = hy - cy;
                const d = Math.hypot(dx, dy);
                if (d >= pad) continue;
                const f = (1 - d / pad) * 2.4;
                if (d < 1) {
                    sx += (hx < (b.left + b.right) / 2 ? -1 : 1) * f;
                    sy += (hy < (b.top + b.bottom) / 2 ? -1 : 1) * f;
                } else {
                    sx += (dx / d) * f;
                    sy += (dy / d) * f;
                }
            }

            // Корм: выбираем цель и держимся её.
            if (k.food && !this.pellets.includes(k.food)) k.food = null;
            if (!k.food) {
                let best = null;
                let bd = 480 + k.rush * 320;
                for (const p of this.pellets) {
                    if (!p.landed) continue;
                    const d = Math.hypot(p.x - hx, p.y - hy);
                    if (d < bd) {
                        bd = d;
                        best = p;
                    }
                }
                k.food = best;
            }
            if (k.food) {
                const dx = k.food.x - hx;
                const dy = k.food.y - hy;
                const d = Math.hypot(dx, dy) || 1;
                sx += (dx / d) * 3.2;
                sy += (dy / d) * 3.2;
                k.gulp = clamp(1 - d / 60, 0, 1);
                if (d < 7) {
                    const idx = this.pellets.indexOf(k.food);
                    if (idx >= 0) this.pellets.splice(idx, 1);
                    this.bites.push({ x: k.food.x, y: k.food.y, born: t });
                    this.ripples.push({ x: k.food.x, y: k.food.y, born: t, strength: 0.45 });
                    k.food = null;
                    k.rush = 0;
                    k.gulp = 0;
                    k.burstUntil = t + 0.3;
                }
            } else {
                k.gulp = Math.max(0, k.gulp - dt * 3);
            }

            // Курсор: любопытство к медленному, испуг от резкого.
            if (ptr.active) {
                const dx = ptr.x - hx;
                const dy = ptr.y - hy;
                const d = Math.hypot(dx, dy) || 1;
                if (ptr.speed > 1400 && d < 170) {
                    k.startle = 1;
                    k.fleeX = -dx / d;
                    k.fleeY = -dy / d;
                } else if (d < 240 && d > 30 && ptr.speed < 300 && !k.food) {
                    const f = k.curiosity * 0.9 * (1 - d / 240);
                    sx += (dx / d) * f;
                    sy += (dy / d) * f;
                }
            }
            if (k.startle > 0) {
                sx += k.fleeX * k.startle * 3;
                sy += k.fleeY * k.startle * 3;
                k.startle = Math.max(0, k.startle - dt * 0.8);
            }

            // Не слипаться.
            for (const o of this.koi) {
                if (o === k) continue;
                const dx = hx - o.nodes[0];
                const dy = hy - o.nodes[1];
                const d = Math.hypot(dx, dy);
                if (d < 46 && d > 0.1) {
                    const f = (1 - d / 46) * 1.2;
                    sx += (dx / d) * f;
                    sy += (dy / d) * f;
                }
            }

            // Поворот с ограничением угловой скорости.
            const desired = Math.atan2(sy, sx);
            const maxTurn = (k.startle > 0.3 ? 5.5 : k.food ? 4 : 2.2) * dt;
            const dh = clamp(angleDiff(k.heading, desired), -maxTurn, maxTurn);
            k.heading += dh;
            k.turn = lerp(k.turn, dh / dt, 0.15);

            // Рывки хвостом, потом скольжение.
            k.nextBurst -= dt;
            if (k.nextBurst <= 0) {
                k.burstUntil = t + 0.5 + rnd() * 0.5;
                k.nextBurst = 1.5 + rnd() * 3.5;
            }
            const bursting = t < k.burstUntil;
            const target =
                k.baseSpeed * (bursting ? 2.1 : 0.75) * (1 + k.rush * 1.4) * (1 + k.startle * 1.8) * (k.food ? 1.5 : 1) * lerp(0.85, 1, k.depth);
            k.speed = lerp(k.speed, target, bursting || k.startle > 0 ? 0.2 : 0.04);
            k.beat = lerp(k.beat, bursting || k.food || k.startle > 0.2 ? 1 : 0.25, 0.08);
            k.phase += dt * (4 + k.speed / 10);
            k.rush = Math.max(0, k.rush - dt * 0.5);

            // Нырнуть и всплыть.
            k.nextDive -= dt;
            if (k.nextDive <= 0) {
                k.depthTarget = k.depthTarget < 0.9 ? 1 : 0.55 + rnd() * 0.2;
                k.nextDive = 4 + rnd() * 12;
            }
            k.depth = lerp(k.depth, k.depthTarget, 0.02);

            // Голова плывёт, хребет тянется следом.
            k.nodes[0] += Math.cos(k.heading) * k.speed * dt;
            k.nodes[1] += Math.sin(k.heading) * k.speed * dt;
            this.keepInside(k);
            for (let i = 1; i < k.len; i++) {
                const px = k.nodes[(i - 1) * 2];
                const py = k.nodes[(i - 1) * 2 + 1];
                let x = k.nodes[i * 2];
                let y = k.nodes[i * 2 + 1];
                const dx = x - px;
                const dy = y - py;
                const d = Math.hypot(dx, dy) || 1;
                if (d > k.seg) {
                    x = px + (dx / d) * k.seg;
                    y = py + (dy / d) * k.seg;
                } else if (d < k.seg * 0.6) {
                    x = px + (dx / d) * k.seg * 0.6;
                    y = py + (dy / d) * k.seg * 0.6;
                }
                k.nodes[i * 2] = x;
                k.nodes[i * 2 + 1] = y;
            }

            // След на воде у быстрой рыбы под поверхностью.
            if (k.depth > 0.9 && k.speed > 34 && t > k.nextWake) {
                const tail = (k.len - 1) * 2;
                this.ripples.push({ x: k.nodes[tail], y: k.nodes[tail + 1], born: t, strength: 0.18 });
                k.nextWake = t + 0.6;
            }
        }
        ptr.speed *= 0.9;
    }
}

const BODY_GLYPHS = ['8', '%', '&', '#', 'x', '+', '*', 'S'];

export const THEMES = {
    dark: {
        bg: '#0f1719',
        white: '#e9e1d0',
        red: '#d6522f',
        black: '#2c2d33',
        inkW: 'rgba(26,36,38,0.72)',
        inkR: 'rgba(72,18,6,0.78)',
        inkK: 'rgba(214,218,224,0.5)',
        shadow: 'rgba(0,0,0,0.55)',
        ripple: '#a0b8b0',
        pellet: '#e7c98b',
        bite: '#fff1c9',
    },
    light: {
        bg: '#f1f3ef',
        white: '#cdc8bb',
        red: '#e2572b',
        black: '#3b3b42',
        inkW: 'rgba(38,46,46,0.78)',
        inkR: 'rgba(96,24,8,0.75)',
        inkK: 'rgba(225,228,232,0.55)',
        shadow: 'rgba(30,40,40,0.16)',
        ripple: '#607a74',
        pellet: '#8f6a2a',
        bite: '#5a4a1a',
    },
};

const FONT = (px) => `${px}px "JetBrains Mono", "Cascadia Mono", Consolas, ui-monospace, monospace`;

/** Отрисовка мира символами на 2D-canvas. */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.theme = THEMES.dark;
        this.boxes = [];
        this.fontPx = 12;
        this.cw = 7;
        this.ch = 12;
        this.w = 0;
        this.h = 0;
        this.dpr = 1;
    }

    setTheme(name) {
        this.theme = THEMES[name] || THEMES.dark;
    }

    /** Прямоугольники с текстом: под ними рыбы бледнеют. */
    setDimBoxes(boxes) {
        this.boxes = boxes;
    }

    resize(w, h, dpr, fontPx = 12) {
        this.w = w;
        this.h = h;
        this.dpr = dpr;
        this.fontPx = fontPx;
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        const ctx = this.ctx;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = FONT(fontPx);
        this.cw = Math.max(5, ctx.measureText('8').width + 1);
        this.ch = fontPx;
    }

    glyph(ch, x, y, color, alpha) {
        const ctx = this.ctx;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillText(ch, x, y);
    }

    cell(x, y, color, alpha) {
        const ctx = this.ctx;
        const w = this.cw - 1;
        const h = this.ch - 1;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 2);
        ctx.fill();
    }

    dimAt(x, y) {
        for (const b of this.boxes) if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) return 0.22;
        return 1;
    }

    render(world) {
        const ctx = this.ctx;
        const T = this.theme;
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        ctx.font = FONT(this.fontPx);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 1;
        ctx.fillStyle = T.bg;
        ctx.fillRect(0, 0, this.w, this.h);
        this.drawRipples(world);
        this.drawPellets(world);
        const sorted = [...world.koi].sort((a, b) => a.depth - b.depth);
        const rasters = sorted.map((k) => [k, this.rasterKoi(k)]);
        for (const [k, cells] of rasters) this.drawCells(cells, k, true);
        for (const [k, cells] of rasters) this.drawCells(cells, k, false);
        this.drawBites(world);
        ctx.globalAlpha = 1;
    }

    drawRipples(world) {
        const T = this.theme;
        const life = 2.6;
        for (const r of world.ripples) {
            const age = world.time - r.born;
            if (age < 0) continue;
            const p = age / life;
            const radius = 10 + age * 48;
            const alpha = (1 - p) * 0.9 * r.strength;
            const count = Math.max(8, Math.floor((TAU * radius) / (this.cw * 1.7)));
            for (let i = 0; i < count; i++) {
                const ang = (i / count) * TAU;
                const x = r.x + Math.cos(ang) * radius;
                const y = r.y + Math.sin(ang) * radius;
                const c = Math.abs(Math.cos(ang));
                const ch = c < 0.3 ? '-' : c > 0.93 ? '|' : Math.sin(ang) * Math.cos(ang) > 0 ? '\\' : '/';
                this.glyph(ch, x, y, T.ripple, alpha * this.dimAt(x, y));
            }
        }
    }

    drawPellets(world) {
        const T = this.theme;
        for (const p of world.pellets) {
            if (!p.landed) {
                const t = (world.time - p.born) / p.landAt;
                const y = p.y - (1 - t) * this.ch * 2.5;
                this.glyph("'", p.x, y, T.pellet, 0.9);
            } else {
                const pulse = 0.75 + 0.25 * Math.sin(world.time * 4 + p.x);
                this.glyph('o', p.x, p.y, T.pellet, pulse * this.dimAt(p.x, p.y));
            }
        }
    }

    drawBites(world) {
        const T = this.theme;
        for (const b of world.bites) {
            const age = world.time - b.born;
            const a = 1 - age / 0.5;
            this.glyph(age < 0.2 ? '*' : '+', b.x, b.y, T.bite, a);
        }
    }

    /**
     * Рыба растрируется в сетку символов: каждая точка тела попадает в свою клетку,
     * поэтому при любом повороте тело выглядит цельным, как пиксель-арт.
     */
    rasterKoi(k) {
        const T = this.theme;
        const cw = this.cw;
        const ch = this.ch;
        const n = k.len;
        const depthA = lerp(0.35, 1, k.depth);
        const cells = new Map();
        const put = (x, y, color, ink, glyph, mul, priority) => {
            const col = Math.round(x / cw);
            const row = Math.round(y / ch);
            const key = row * 65536 + col;
            const prev = cells.get(key);
            if (prev && prev.priority > priority) return;
            cells.set(key, { col, row, color, ink, glyph, alpha: this.dimAt(x, y) * depthA * mul, priority });
        };
        const maxHalf = cw * 2.1;
        const across = Math.min(cw, ch) * 0.75;
        const along = Math.min(cw, ch) * 0.7;
        const sway = (t) => Math.sin(k.phase - t * 0.55) * k.beat * (t / n) * 3.5;
        let hdx = 1;
        let hdy = 0;
        let ldx = 1;
        let ldy = 0;
        let tailX = k.nodes[(n - 1) * 2];
        let tailY = k.nodes[(n - 1) * 2 + 1];
        const finAt = Math.round(n * 0.28);
        for (let i = 0; i < n - 1; i++) {
            const x0 = k.nodes[i * 2];
            const y0 = k.nodes[i * 2 + 1];
            const x1 = k.nodes[(i + 1) * 2];
            const y1 = k.nodes[(i + 1) * 2 + 1];
            let dx = x0 - x1;
            let dy = y0 - y1;
            const d = Math.hypot(dx, dy) || 1;
            dx /= d;
            dy /= d;
            if (i === 0) {
                hdx = dx;
                hdy = dy;
            }
            ldx = dx;
            ldy = dy;
            const nx = -dy;
            const ny = dx;
            const steps = Math.max(1, Math.ceil(d / along));
            for (let s = 0; s < steps; s++) {
                const t = i + s / steps;
                const u = t / (n - 1);
                const prof = u < 0.15 ? lerp(0.45, 1, u / 0.15) : u < 0.55 ? 1 : lerp(1, 0.18, (u - 0.55) / 0.45);
                const half = maxHalf * prof;
                const sw = sway(t);
                const cx = lerp(x0, x1, s / steps) + nx * sw;
                const cy = lerp(y0, y1, s / steps) + ny * sw;
                const jn = Math.ceil(half / across);
                for (let jj = -jn; jj <= jn; jj++) {
                    const jp = clamp(jj * across, -half, half);
                    const j = clamp(Math.round((jp / maxHalf) * HALF_W), -HALF_W, HALF_W);
                    const c = k.pattern[i][j + HALF_W];
                    const color = c === 'r' ? T.red : c === 'k' ? T.black : T.white;
                    const ink = c === 'r' ? T.inkR : c === 'k' ? T.inkK : T.inkW;
                    const glyph = BODY_GLYPHS[Math.floor(hash2(k.seed + i * 17, j + 9) * BODY_GLYPHS.length)];
                    put(cx + nx * jp, cy + ny * jp, color, ink, glyph, 1, 0);
                }
                if (i === 1 && s === 0) {
                    for (const side of [-1, 1]) put(cx + nx * side * half, cy + ny * side * half, T.white, T.inkR, 'o', 1, 2);
                }
                if (i === finAt && s === 0) {
                    const spread = across * (1.2 + Math.min(0.8, Math.abs(k.turn) * 0.3));
                    for (const side of [-1, 1]) {
                        const fx = cx + nx * side * (half + spread) - dx * across * 0.5;
                        const fy = cy + ny * side * (half + spread) - dy * across * 0.5;
                        put(fx, fy, null, T.inkW, side < 0 ? '/' : '\\', 0.85, 1);
                    }
                }
            }
            if (i === n - 2) {
                tailX = x1 + nx * sway(n - 1);
                tailY = y1 + ny * sway(n - 1);
            }
        }
        // Хвост: раздвоенный, качается сильнее тела.
        const tnx = -ldy;
        const tny = ldx;
        const ts = Math.sin(k.phase - n * 0.55) * k.beat * 4;
        for (const [a, b, g] of [
            [0.9, 0.9, '\\'],
            [0.9, -0.9, '/'],
            [1.8, 1.7, '\\'],
            [1.8, -1.7, '/'],
            [2.6, 2.3, '.'],
            [2.6, -2.3, '.'],
        ]) {
            put(tailX - ldx * across * a + tnx * (b * across + ts), tailY - ldy * across * a + tny * (b * across + ts), null, T.inkW, g, 0.8, 1);
        }
        if (k.gulp > 0.3) put(k.nodes[0] + hdx * cw, k.nodes[1] + hdy * ch * 0.8, null, T.inkR, 'O', k.gulp, 3);
        return cells;
    }

    drawCells(cells, k, shadow) {
        const cw = this.cw;
        const ch = this.ch;
        const T = this.theme;
        if (shadow) {
            for (const c of cells.values()) {
                if (c.color) this.cell(c.col * cw + cw * 0.55, c.row * ch + ch * 0.45, T.shadow, c.alpha * 0.35 * k.depth);
            }
            return;
        }
        for (const c of cells.values()) {
            const x = c.col * cw;
            const y = c.row * ch;
            if (c.color) this.cell(x, y, c.color, c.alpha);
            if (c.glyph) this.glyph(c.glyph, x, y + 0.5, c.ink, c.alpha);
        }
    }
}

const STEP = 1 / 60;
const MAX_STEPS = 4;
const MEASURE_EVERY = 30;
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [data-ignore]';

/** Движок страницы: цикл, события мыши, обход текста, экономия ресурсов. */
export class Pond {
    constructor(canvas, { theme = 'dark', onStats = null, onFeed = null, seed = null, koiCount = 7, avoidSelector = '[data-avoid]' } = {}) {
        this.canvas = canvas;
        this.onStats = onStats;
        this.onFeed = onFeed;
        this.avoidSelector = avoidSelector;
        this.world = new World({ seed, koiCount });
        this.renderer = new Renderer(canvas);
        this.renderer.setTheme(theme);
        this.raf = 0;
        this.last = 0;
        this.acc = 0;
        this.frames = 0;
        this.visible = true;
        this.disposed = false;
        this.lastPointerTime = 0;
        this.reported = { koi: -1, pellets: -1 };
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onPointerLeave = this.onPointerLeave.bind(this);
        this.schedule = this.schedule.bind(this);
        this.frame = this.frame.bind(this);
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
            this.visible = entry.isIntersecting;
            this.schedule();
        });
        this.resizeObserver.observe(canvas);
        this.intersectionObserver.observe(canvas);
        this.reducedMotion.addEventListener('change', this.schedule);
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        window.addEventListener('click', this.onClick);
        document.documentElement.addEventListener('pointerleave', this.onPointerLeave);
        window.addEventListener('blur', this.onPointerLeave);
        document.addEventListener('visibilitychange', this.schedule);
        this.resize();
        this.schedule();
    }

    destroy() {
        this.disposed = true;
        cancelAnimationFrame(this.raf);
        this.resizeObserver.disconnect();
        this.intersectionObserver.disconnect();
        this.reducedMotion.removeEventListener('change', this.schedule);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('click', this.onClick);
        document.documentElement.removeEventListener('pointerleave', this.onPointerLeave);
        window.removeEventListener('blur', this.onPointerLeave);
        document.removeEventListener('visibilitychange', this.schedule);
    }

    setTheme(name) {
        this.renderer.setTheme(name);
        if (this.reducedMotion.matches) this.drawStill();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        this.renderer.resize(rect.width, rect.height, Math.min(window.devicePixelRatio || 1, 2));
        this.world.resize(rect.width, rect.height);
        this.measure();
        this.report();
        if (this.reducedMotion.matches) this.drawStill();
    }

    measure() {
        const origin = this.canvas.getBoundingClientRect();
        const boxes = Array.from(document.querySelectorAll(this.avoidSelector), (el) => {
            const b = el.getBoundingClientRect();
            return { left: b.left - origin.left, top: b.top - origin.top, right: b.right - origin.left, bottom: b.bottom - origin.top };
        }).filter((b) => b.right > b.left && b.bottom > b.top);
        this.renderer.setDimBoxes(boxes);
        this.world.avoid = boxes;
    }

    report() {
        const koi = this.world.koi.length;
        const pellets = this.world.pellets.length;
        if (koi === this.reported.koi && pellets === this.reported.pellets) return;
        this.reported = { koi, pellets };
        this.onStats?.(this.reported);
    }

    schedule() {
        cancelAnimationFrame(this.raf);
        if (this.disposed || !this.visible || document.hidden) return;
        if (this.reducedMotion.matches) {
            this.drawStill();
            return;
        }
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
    }

    frame(now) {
        const dt = Math.min(0.1, (now - this.last) / 1000);
        this.last = now;
        this.acc += dt;
        let steps = 0;
        while (this.acc >= STEP && steps < MAX_STEPS) {
            this.world.step(STEP);
            this.acc -= STEP;
            steps++;
        }
        if (steps === MAX_STEPS) this.acc = 0;
        if (++this.frames % MEASURE_EVERY === 0) this.measure();
        this.renderer.render(this.world);
        this.report();
        this.raf = requestAnimationFrame(this.frame);
    }

    /** Режим «меньше движения»: даём рыбам разойтись и держим один кадр. */
    drawStill() {
        if (this.world.time < 4) for (let i = 0; i < 240; i++) this.world.step(STEP);
        this.measure();
        this.renderer.render(this.world);
        this.report();
    }

    toLocal(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    }

    onPointerMove(e) {
        const { x, y, inside } = this.toLocal(e);
        const p = this.world.pointer;
        const elapsed = Math.max(1, e.timeStamp - this.lastPointerTime) / 1000;
        const speed = Math.hypot(x - p.x, y - p.y) / elapsed;
        p.speed += (Math.min(speed, 5000) - p.speed) * 0.5;
        this.lastPointerTime = e.timeStamp;
        p.x = x;
        p.y = y;
        p.active = inside && e.pointerType !== 'touch';
    }

    /** Клик по пустой воде — корм. Ссылки, кнопки и выделение текста не трогаем. */
    onClick(e) {
        if (this.reducedMotion.matches) return;
        if (e.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE))) return;
        if (window.getSelection()?.toString()) return;
        const { x, y, inside } = this.toLocal(e);
        if (!inside) return;
        this.world.feed(x, y);
        this.onFeed?.(this.world.pellets.length);
        this.report();
    }

    onPointerLeave() {
        this.world.pointer.active = false;
        this.world.pointer.speed = 0;
    }
}

/** Статичный портрет одной рыбы для галереи. */
export function renderPortrait(canvas, { seed, variety, fontPx = 16 } = {}) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(200, rect.width || 320);
    const h = Math.max(140, rect.height || 220);
    const world = new World({ seed, koiCount: 0 });
    world.w = w;
    world.h = h;
    const rnd = mulberry32(seed + 11);
    const len = 15 + Math.floor(rnd() * 5);
    const seg = fontPx * 0.8;
    // Голова слева, смотрит влево, тело уходит вправо.
    const k = world.makeKoi({ variety, seed, len, seg, x: w * 0.22, y: h * 0.5, heading: Math.PI });
    // Лёгкая дуга: хвост уводим вверх или вниз.
    const bend = (rnd() - 0.5) * 0.09;
    for (let i = 1; i < len; i++) {
        const ang = Math.PI + bend * i;
        k.nodes[i * 2] = k.nodes[(i - 1) * 2] - Math.cos(ang) * seg;
        k.nodes[i * 2 + 1] = k.nodes[(i - 1) * 2 + 1] - Math.sin(ang) * seg;
    }
    k.phase = rnd() * TAU;
    k.beat = 0.8;
    world.koi.push(k);
    world.time = 1;
    const r = new Renderer(canvas);
    r.setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    r.resize(w, h, Math.min(window.devicePixelRatio || 1, 2), fontPx);
    r.render(world);
    return k;
}
