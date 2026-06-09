# Local Marketplace

Това е учебен проект за локален пазар на услуги с Django backend и React/Vite frontend.

## Какво прави проектът
- `backend/` съдържа Django REST API за профили, услуги, ревюта и потребителска автентикация.
- `frontend/Django-with-RTS/` съдържа React приложение, което консумира бекенда и показва начална страница, регистрация, вход, профил, търсене на услуги, свързване и локални продавачи.

## Проектна структура
- `src/` - допълнителен Python пакет за общи помощни функции и за да се изпълни изискването за наличен `src` каталог.
- `tests/` - unit тестове за проекта.
- `backend/` - цял Django backend проект.
- `frontend/Django-with-RTS/` - фронтендът на приложението.

## Инсталация
1. Създайте виртуална среда (препоръчително):

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Инсталирайте backend зависимостите:

```bash
pip install -r requirements.txt
```

3. За разработка и тестване инсталирайте допълнителните зависимости:

```bash
pip install -r requirements-dev.txt
```

## Как се пуска backend

От корена на проекта стартирайте:

```bash
python backend/manage.py migrate
python backend/manage.py runserver
```

> Настройките по подразбиране използват PostgreSQL. Ако не разполагате с PostgreSQL, променете `backend/config/settings.py` или използвайте SQLite.

## Как се пуска frontend

Отидете в `frontend/Django-with-RTS/`:

```bash
cd frontend/Django-with-RTS
npm install
npm run dev
```

## Тестване

От корена на проекта можете да изпълните:

```bash
python -m unittest discover -s tests
```

## Изисквания
- Python 3.11+
- Django 6.0.5
- Django REST Framework
- django-cors-headers
- psycopg2-binary (за PostgreSQL)
- pytest/lib/unittest за тестове

## Допълнително
Файловете `requirements.txt` и `requirements-dev.txt` съдържат всички необходими библиотеки за backend и разработка.
