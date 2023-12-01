from fastapi import FastAPI

app = FastAPI()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

@app.get("/api/python2")
def hello_world2():
    return {"message": "Hello World, again"}

@app.get("/api/python3")
def hello_world3():
    return {"message": "Hello World, again, again"}