// Хавз — галерея: семь кои, нарисованных символами. Клик по портрету рисует новую рыбу той же породы.
import { renderPortrait, VARIETY_NAMES } from './pond.js';
import { GALLERY } from './data.js';

const wall = document.querySelector('.wall');
if (wall) {
    const items = GALLERY.map((g) => ({ ...g }));
    wall.innerHTML = items
        .map(
            (g, i) => `
        <figure class="work" data-index="${i}">
            <button type="button" class="work__frame" aria-label="Нарисовать новую рыбу: ${g.name}">
                <canvas aria-hidden="true"></canvas>
            </button>
            <figcaption class="work__caption">
                <span class="work__name">${g.name}</span>
                <span class="work__meta">${VARIETY_NAMES[g.variety] || g.variety} · ${g.size} · ${g.year}</span>
            </figcaption>
        </figure>`
        )
        .join('');

    const draw = (fig) => {
        const g = items[Number(fig.dataset.index)];
        const canvas = fig.querySelector('canvas');
        const koi = renderPortrait(canvas, { seed: g.seed, variety: g.variety, fontPx: 17 });
        fig.querySelector('.work__meta').textContent = `${VARIETY_NAMES[g.variety] || g.variety} · ${koi.len} узлов · ${g.year}`;
    };
    const drawAll = () => wall.querySelectorAll('.work').forEach(draw);

    wall.querySelectorAll('.work').forEach((fig) => {
        fig.querySelector('.work__frame').addEventListener('click', () => {
            const g = items[Number(fig.dataset.index)];
            g.seed = Math.floor(Math.random() * 1e9);
            draw(fig);
        });
    });

    drawAll();
    let t = 0;
    window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(drawAll, 120);
    });
    document.addEventListener('havz:theme', drawAll);
}
