from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Expense(BaseModel):
    date: str
    price: float

@app.post("/api/expense")
def create_expense(expense: Expense):
    print(expense)
    return expense
