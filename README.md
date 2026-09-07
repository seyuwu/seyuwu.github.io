# Илья Нефонтов — портфолио

**[➜ Открыть сайт](https://seyuwu.github.io)**

Developer · Automation Engineer · AI-assisted Development

Статический сайт-портфолио: HTML/CSS/JS без сборки и зависимостей.
Хостится на GitHub Pages, обновляется пушем в `main`.

## Структура

```
index.html        — разметка страницы
css/style.css     — стили
js/projects.js    — данные проектов (редактируется здесь)
js/main.js        — рендер карточек и интерактив
```

## Локальный запуск

Просто открыть `index.html` в браузере.

## Добавить проект

Отредактируйте `js/projects.js` — скопируйте блок `{ ... }` и заполните поля.
Затем:

```bash
git add -A
git commit -m "Add project"
git push
```

Сайт обновится на https://seyuwu.github.io через 1–2 минуты.
