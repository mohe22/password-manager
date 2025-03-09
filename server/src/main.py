from fastapi import FastAPI
from routers import auth
from routers import encryption
from routers import manager
from database import engine
from models import models
from fastapi.middleware.cors import CORSMiddleware
from config import Config

app = FastAPI()



# Add the CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.FRONTEND_URL,           # Specify allowed origins
    allow_credentials=True,          # Allow cookies and credentials
    allow_methods=["*"],             # Allow all HTTP methods
    allow_headers=["*"],             # Allow all headers
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router, prefix="/auth")
app.include_router(manager.router, prefix="/api/v1")  
app.include_router(encryption.router,prefix="/api/v1/encryption")
@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Manager API!"}




