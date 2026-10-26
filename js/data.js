// Хавз — все данные сайта в одном месте. Тексты главной лежат прямо в index.html,
// здесь — карточки-сноски, проекты и галерея. Правьте под себя.

/** Карточки, которые всплывают при наведении на подчёркнутые названия на главной. */
export const CITES = {
    tomo24: {
        name: 'Tomo24',
        role: 'Телерадиология для клиник',
        dates: '2026 · в проде',
        summary: 'Кабинеты врача, клиники, менеджера и админа: исследования, дедлайны, DICOM, заключения PDF.',
        href: 'https://tomo24.online',
    },
    mdb: {
        name: 'MDB · Medical Digital Bridge',
        role: 'Ядро медицинской платформы',
        dates: '2026',
        summary: 'Ядро МИС и блоки-модули: OKO24 (офтальмология), Me (приложение пациента).',
        href: null,
    },
    ravand: {
        name: 'Ravand',
        role: 'Контент-завод',
        dates: '2026 · в проде',
        summary: 'Сценарий → озвучка → монтаж → публикация, с проверяющими на каждом этапе.',
        href: 'https://ravand.mabida.tj',
    },
    guloro: {
        name: 'Guloro',
        role: 'Доставка цветов по Худжанду',
        dates: '2026 · в проде',
        summary: 'Витрина, корзина, местные платёжки, админка, четыре языка интерфейса.',
        href: 'https://guloro.com',
    },
    orzu: {
        name: 'Orzu 3D',
        role: 'Маркетплейс 3D-печати',
        dates: '2026',
        summary: 'Каталог моделей, поиск на таджикском, русском и узбекском, заказ печати на ферме.',
        href: null,
    },
};

/** Лента проектов. Обложки рисуются CSS-градиентами: c1/c2 — цвета, index — номер на обложке. */
export const PROJECTS = [
    {
        slug: 'tomo24',
        name: 'Tomo24',
        tagline: 'Телерадиология для клиник.',
        description:
            'Врач, клиника, менеджер и админ в одном кабинете: исследования с дедлайнами, DICOM-файлы, заключения в PDF на бланках, аналитика по врачам.',
        tech: ['TypeScript', 'Hono + tRPC', 'PostgreSQL'],
        year: '2026',
        href: 'https://tomo24.online',
        c1: '#1f5f6b',
        c2: '#0c2227',
    },
    {
        slug: 'mdb',
        name: 'MDB',
        tagline: 'Medical Digital Bridge.',
        description:
            'Ядро медицинской информационной системы и модули-блоки с единым контрактом: OKO24 для офтальмологии, Me — приложение пациента.',
        tech: ['TypeScript', 'Контракт модулей', 'Docker'],
        year: '2026',
        href: null,
        c1: '#4a3a7a',
        c2: '#17122a',
    },
    {
        slug: 'ravand',
        name: 'Ravand',
        tagline: 'Контент-завод.',
        description:
            'Из идеи в готовый ролик: сценарий, озвучка, монтаж, публикация. На каждом этапе — проверяющие, чтобы брак не доезжал до канала.',
        tech: ['Python', 'Docker', 'OpenRouter'],
        year: '2026',
        href: 'https://ravand.mabida.tj',
        c1: '#8a4a2a',
        c2: '#2a150c',
    },
    {
        slug: 'guloro',
        name: 'Guloro',
        tagline: 'Цветы с доставкой по Худжанду.',
        description:
            'Витрина, корзина и заказ за минуту, оплата местными сервисами, админка с товарами и заказами, интерфейс на четырёх языках.',
        tech: ['FastAPI', 'MongoDB', 'React'],
        year: '2026',
        href: 'https://guloro.com',
        c1: '#2e4b3a',
        c2: '#0e1a13',
    },
    {
        slug: 'orzu3d',
        name: 'Orzu 3D',
        tagline: 'Маркетплейс 3D-печати.',
        description:
            'Каталог моделей с поиском на таджикском, русском и узбекском, расчёт цены по материалу и масштабу, заказ печати на ферме из пяти принтеров.',
        tech: ['FastAPI', 'SQLite FTS5', 'React'],
        year: '2026',
        href: null,
        c1: '#6b5a1f',
        c2: '#231d0a',
    },
];

/** Галерея: семь кои, нарисованных символами. seed задаёт рисунок, variety — породу. */
export const GALLERY = [
    { name: 'Анор', variety: 'kohaku', seed: 101, size: '18 узлов', year: '2026' },
    { name: 'Шабнам', variety: 'sanke', seed: 202, size: '17 узлов', year: '2026' },
    { name: 'Ситора', variety: 'tancho', seed: 303, size: '19 узлов', year: '2026' },
    { name: 'Дарё', variety: 'showa', seed: 404, size: '16 узлов', year: '2026' },
    { name: 'Лола', variety: 'kohaku', seed: 505, size: '18 узлов', year: '2026' },
    { name: 'Нур', variety: 'sanke', seed: 606, size: '15 узлов', year: '2026' },
    { name: 'Барф', variety: 'tancho', seed: 707, size: '17 узлов', year: '2026' },
];
