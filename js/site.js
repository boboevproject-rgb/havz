// Хавз — общий код страниц: тема, навигация, сноски, пруд на главной, лента проектов.
import { Pond } from './pond.js';
import { CITES, PROJECTS } from './data.js';

const THEME_KEY = 'havz-theme';
const html = document.documentElement;

function initTheme() {
    const q = new URL(location.href).searchParams.get('theme');
    let theme = q === 'light' || q === 'dark' ? q : null;
    if (!theme) {
        try {
            theme = localStorage.getItem(THEME_KEY);
        } catch {
            theme = null;
        }
    }
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    html.dataset.theme = theme;
    return theme;
}

function setTheme(theme) {
    html.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        /* приватный режим — не страшно */
    }
    document.querySelectorAll('.theme-toggle').forEach((b) => b.setAttribute('aria-label', theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'));
    document.dispatchEvent(new CustomEvent('havz:theme', { detail: theme }));
}

function initNav() {
    const path = location.pathname.replace(/\/index\.html$/, '/');
    document.querySelectorAll('.nav a[data-page]').forEach((a) => {
        const page = a.dataset.page;
        const active = page === 'pond' ? /\/$|index\.html$/.test(path) : path.endsWith(`${page}.html`);
        if (active) a.setAttribute('aria-current', 'page');
    });
    document.querySelectorAll('.theme-toggle').forEach((b) => b.addEventListener('click', () => setTheme(html.dataset.theme === 'light' ? 'dark' : 'light')));
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav__menu');
    burger?.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
        if (nav?.classList.contains('open') && !nav.contains(e.target)) nav.classList.remove('open');
    });
}

/** Сноски: на десктопе карточка при наведении, на тач-экранах — сразу ссылка. */
function initCites() {
    const touch = window.matchMedia('(hover: none)').matches;
    let card = null;
    let timer = 0;

    const open = (btn) => {
        const data = CITES[btn.dataset.cite];
        if (!data) return;
        close();
        card = document.createElement('div');
        card.className = 'cite-card';
        card.setAttribute('data-ignore', '');
        card.innerHTML = `
            <span class="cite-card__row"><span class="cite-card__name">${data.name}</span><span class="cite-card__dates">${data.dates}</span></span>
            <span class="cite-card__role">${data.role}</span>
            <span class="cite-card__summary">${data.summary}</span>`;
        if (data.href) card.addEventListener('click', () => window.open(data.href, '_blank', 'noopener'));
        btn.parentElement.insertBefore(card, btn.nextSibling);
        const r = btn.getBoundingClientRect();
        card.style.left = `${btn.offsetLeft}px`;
        card.style.bottom = `${btn.offsetParent.clientHeight - btn.offsetTop + 8}px`;
        if (r.left + 340 > window.innerWidth) card.style.left = `${Math.max(0, btn.offsetLeft - (r.left + 340 - window.innerWidth) - 16)}px`;
        card.addEventListener('mouseenter', () => clearTimeout(timer));
        card.addEventListener('mouseleave', scheduleClose);
        btn.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => card?.classList.add('is-open'));
    };
    const close = () => {
        if (!card) return;
        card.remove();
        card = null;
        document.querySelectorAll('.cite[aria-expanded]').forEach((b) => b.removeAttribute('aria-expanded'));
    };
    const scheduleClose = () => {
        clearTimeout(timer);
        timer = setTimeout(close, 120);
    };

    document.querySelectorAll('.cite').forEach((btn) => {
        const data = CITES[btn.dataset.cite];
        if (!data) return;
        btn.setAttribute('aria-label', `${data.name}, ${data.role}`);
        if (touch) {
            if (data.href) {
                const a = document.createElement('a');
                a.className = btn.className;
                a.href = data.href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = btn.textContent;
                btn.replaceWith(a);
            }
            return;
        }
        btn.addEventListener('mouseenter', () => {
            clearTimeout(timer);
            timer = setTimeout(() => open(btn), 60);
        });
        btn.addEventListener('mouseleave', scheduleClose);
        btn.addEventListener('focus', () => open(btn));
        btn.addEventListener('blur', scheduleClose);
        btn.addEventListener('click', () => {
            if (data.href) window.open(data.href, '_blank', 'noopener');
        });
    });
    window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
}

function initPond() {
    const canvas = document.querySelector('canvas.pond');
    if (!canvas) return;
    const url = new URL(location.href);
    const seedParam = url.searchParams.get('seed');
    const seed = seedParam != null && seedParam !== '' ? Number(seedParam) : null;
    const koiEl = document.getElementById('stat-koi');
    const foodEl = document.getElementById('stat-food');
    const stats = document.querySelector('.stats');
    const pond = new Pond(canvas, {
        theme: html.dataset.theme,
        seed: Number.isFinite(seed) ? seed : null,
        onStats: ({ koi, pellets }) => {
            if (koiEl) koiEl.textContent = String(koi);
            if (foodEl) {
                foodEl.textContent = String(pellets);
                foodEl.classList.remove('flash');
                void foodEl.offsetWidth;
                foodEl.classList.add('flash');
            }
            stats?.classList.toggle('is-visible', koi > 0);
        },
    });
    document.addEventListener('havz:theme', (e) => pond.setTheme(e.detail));
    window.havzPond = pond;
}

function initProjects() {
    const strip = document.querySelector('.strip');
    if (!strip) return;
    strip.innerHTML = PROJECTS.map((p, i) => {
        const tag = p.href ? 'a' : 'div';
        const attrs = p.href ? `href="${p.href}" target="_blank" rel="noopener noreferrer"` : '';
        return `
        <${tag} class="card" ${attrs} style="--c1:${p.c1};--c2:${p.c2}">
            <span class="card__cover" aria-hidden="true">
                <span class="card__index">${String(i + 1).padStart(2, '0')}</span>
                <span class="card__name">${p.name}</span>
            </span>
            <span class="card__meta"><span class="card__title">${p.name}</span><span class="card__year">${p.year}</span></span>
            <span class="card__tagline">${p.tagline}</span>
            <span class="card__text">${p.description}</span>
            <span class="card__tech">${p.tech.map((t) => `<span>${t}</span>`).join('')}</span>
        </${tag}>`;
    }).join('');

    // Колёсико мыши листает ленту по горизонтали.
    strip.addEventListener(
        'wheel',
        (e) => {
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
            if (strip.scrollWidth <= strip.clientWidth) return;
            e.preventDefault();
            strip.scrollLeft += e.deltaY;
        },
        { passive: false }
    );
}

initTheme();
initNav();
initCites();
initPond();
initProjects();
