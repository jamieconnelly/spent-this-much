## Introduction

Expense tracker written with Next.js and FastAPI. Authentication is handled via Firebase and the expense data is stored in Google sheets.

## Requirements

- `Python>=3.9` \
- `Node>=18.17` \
- `poetry` - https://python-poetry.org/docs/#installation \
- `yarn` - https://python-poetry.org/docs/#installation
- A Google Cloud project with a service account enabled + service account key in JSON format
- A Firebase project linked to your Google Cloud project for authentication
- A blank Google sheet

## Getting Started

1. Install frontend dependencies:

```bash
yarn
```

2. Install backend dependencies:

```bash
poetry shell
poetry install
```

3. Run `uvicorn` to serve FastAPI app (by default this will be available on `http://localhost:8000`)

```bash
poetry run python -m uvicorn app:app --reload
```

4. In another shell run the Next.js dev server

```bash
env API_SERVER_URL='http://localhost:8000' yarn run next-dev
```

If not using the `uvicorn` default port, update the `API_SERVER_URL` accordingly

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
