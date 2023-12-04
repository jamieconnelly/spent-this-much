import base64
import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from fastapi import FastAPI
from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GOOGLE_CREDENTIALS: str = os.environ['GOOGLE_CREDENTIALS']
    GOOGLE_SHEET_ID: str = os.environ["GOOGLE_SHEET_ID"]

settings = Settings()
app = FastAPI()


class Expense(BaseModel):
    date: str
    price: float


@app.post("/api/expense")
def create_expense(expense: Expense):
    print(expense)
    return expense


@app.get('/api/sheet')
def get_expense():
    credentials = base64.b64decode(settings.GOOGLE_CREDENTIALS)
    credentials = json.loads(credentials)
    credentials = service_account.Credentials.from_service_account_info(
        credentials, scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )

    service = build("sheets", "v4", credentials=credentials)
    request = service.spreadsheets().get(
        spreadsheetId=settings.GOOGLE_SHEET_ID, ranges=[], includeGridData=False
    )
    sheet_props = request.execute()

    print(sheet_props["properties"]["title"])
    return {"result": sheet_props["properties"]}
