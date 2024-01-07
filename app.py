import base64
import datetime
import json
import os
from typing import Literal, Optional

import googleapiclient
from fastapi import FastAPI, HTTPException
from google.oauth2 import service_account
from googleapiclient.discovery import build
from mangum import Mangum
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from starlette.middleware.cors import CORSMiddleware


class Settings(BaseSettings):
    GOOGLE_CREDENTIALS: str = os.environ["GOOGLE_CREDENTIALS"]
    GOOGLE_SHEET_ID: str = os.environ["GOOGLE_SHEET_ID"]


class GoogleSheetsClient:
    def __init__(self, settings, **kwargs):
        credentials = base64.b64decode(settings.GOOGLE_CREDENTIALS)
        credentials = json.loads(credentials)
        credentials = service_account.Credentials.from_service_account_info(
            credentials, scopes=["https://www.googleapis.com/auth/spreadsheets"]
        )
        self.service = build("sheets", "v4", credentials=credentials).spreadsheets()

    def get_sheet(self):
        return (
            self.service.values()
            .get(spreadsheetId=settings.GOOGLE_SHEET_ID, range="Sheet1")
            .execute()
        )

    def insert_row(self, row):
        values = self.get_sheet().get("values", [])
        next_row_number = len(values) + 1
        return (
            self.service.values()
            .update(
                spreadsheetId=settings.GOOGLE_SHEET_ID,
                range=f"Sheet1!A{next_row_number}",
                valueInputOption="RAW",
                body={
                    "values": [row],
                },
            )
            .execute()
        )


settings = Settings()
sheets_client = GoogleSheetsClient(settings)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

handler = Mangum(app)


class Expense(BaseModel):
    date: datetime.date
    price: float
    category: Literal[
        "FOOD_SHOP",
        "RENT",
        "WATER",
        "ELECTRIC",
        "PETROL",
        "PHARMACY",
        "INTERNET",
        "OTHER",
    ]
    description: Optional[str]


@app.post("/expenses")
def create_expense(expense: Expense):
    new_row = [
        (
            expense.date - datetime.date(1899, 12, 30)
        ).days,  # Credit - https://github.com/burnash/gspread/issues/511#issuecomment-386488606
        expense.price,
        expense.category,
    ]
    if expense.category == "OTHER" and expense.description is not None:
        new_row.append(expense.description)
    try:
        sheets_client.insert_row(new_row)
    except googleapiclient.errors.HttpError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.reason)
    return expense


@app.get("/hello")
def hello():
    return {"hello": "world"}
