from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from database import get_db
from models.models import PasswordEntry, User
from utils.jwt import decode_access_token
from utils.auth import encrypt_password, decrypt_password, is_strong_password, verify_password
from pydantic import BaseModel, EmailStr

router = APIRouter()


# Pydantic Models
class Data(BaseModel):
    serviceID: str
    email: EmailStr
    password: str


class PasswordEntryCreate(BaseModel):
    title: str
    url: str | None = None
    username: str
    password: str
    notes: str | None = None


class PasswordEntryUpdate(BaseModel):
    title: str
    url: str
    username: str
    password: str
    notes: str
    is_deleted: bool
    is_Favrout: bool


# Helper Functions
async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id") or payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token or missing user ID"
            )
        return user_id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def get_password_entry_by_id(db: Session, service_id: int, user_id: int):
    password_entry = db.query(PasswordEntry).filter(
        PasswordEntry.id == service_id,
        PasswordEntry.user_id == user_id,
        PasswordEntry.is_deleted == False
    ).first()

    if not password_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password entry not found or already deleted."
        )
    return password_entry


def handle_db_operation(db: Session, operation):
    try:
        db.commit()
        db.refresh(operation)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )


def validate_user_credentials(db: Session, user_id: int, password: str):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials."
        )

    if not verify_password(password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    return db_user


# Endpoints
@router.put("/toggle-favorite/{service_id}")
def toggle_favorite(
    service_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    password_entry = get_password_entry_by_id(db, service_id, user_id)
    password_entry.is_Favrout = not password_entry.is_Favrout
    handle_db_operation(db, password_entry)

    return {
        "id": password_entry.id,
        "user_id": password_entry.user_id,
        "title": password_entry.title,
        "url": password_entry.url,
        "username": password_entry.username,
        "notes": password_entry.notes,
        "created_at": password_entry.created_at,
        "updated_at": password_entry.updated_at,
        "is_deleted": password_entry.is_deleted,
        "is_Favrout": password_entry.is_Favrout
    }


@router.get("/get-password-entry/{service_id}")
def get_password_entry(
    service_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    password_entry = get_password_entry_by_id(db, service_id, user_id)
    return {
        "id": password_entry.id,
        "user_id": password_entry.user_id,
        "title": password_entry.title,
        "url": password_entry.url,
        "username": password_entry.username,
        "password": decrypt_password(password_entry.encrypted_password),
        "notes": password_entry.notes,
        "created_at": password_entry.created_at,
        "updated_at": password_entry.updated_at,
        "is_deleted": password_entry.is_deleted,
        "is_Favrout": password_entry.is_Favrout
    }


@router.put("/update-password/{service_id}")
def update_password(
    service_id: int,
    update_data: PasswordEntryUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    password_entry = get_password_entry_by_id(db, service_id, user_id)

    if not is_strong_password(update_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.",
        )

    password_entry.title = update_data.title
    password_entry.url = update_data.url
    password_entry.username = update_data.username
    password_entry.encrypted_password = encrypt_password(update_data.password)
    password_entry.notes = update_data.notes
    password_entry.is_deleted = update_data.is_deleted
    password_entry.is_Favrout = update_data.is_Favrout

    handle_db_operation(db, password_entry)

    return {
        "id": password_entry.id,
        "user_id": password_entry.user_id,
        "title": password_entry.title,
        "url": password_entry.url,
        "username": password_entry.username,
        "notes": password_entry.notes,
        "created_at": password_entry.created_at,
        "updated_at": password_entry.updated_at,
        "is_deleted": password_entry.is_deleted,
        "is_Favrout": password_entry.is_Favrout
    }


@router.post("/get-password")
def get_password(
    data: Data,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = validate_user_credentials(db, user_id, data.password)

    password_entry = db.query(
        PasswordEntry.id,
        PasswordEntry.encrypted_password
    ).filter(
        PasswordEntry.id == data.serviceID,
        PasswordEntry.user_id == db_user.id
    ).first()

    if not password_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password entry not found."
        )

    decrypted_password = decrypt_password(password_entry.encrypted_password)
    return {
        "id": password_entry.id,
        "password": decrypted_password
    }


@router.delete("/delete-password")
def delete_password(
    data: Data,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = validate_user_credentials(db, user_id, data.password)

    password_entry = db.query(PasswordEntry).filter(
        PasswordEntry.id == data.serviceID,
        PasswordEntry.user_id == db_user.id
    ).first()

    if not password_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password entry not found"
        )

    password_entry.is_deleted = True
    db.commit()

    return {"detail": "Password entry marked as deleted successfully."}



@router.post("/create-password")
def create_password(
    password_data: PasswordEntryCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not is_strong_password(password_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 12 characters long, include uppercase, lowercase, a number, and a special character.",
        )

    encrypted_password = encrypt_password(password_data.password)
    new_password_entry = PasswordEntry(
        user_id=user_id,
        title=password_data.title,
        url=password_data.url,
        username=password_data.username,
        encrypted_password=encrypted_password,
        notes=password_data.notes
    )

    db.add(new_password_entry)
    handle_db_operation(db, new_password_entry)

    return {
        "id": new_password_entry.id,
        "user_id": new_password_entry.user_id,
        "title": new_password_entry.title,
        "url": new_password_entry.url,
        "username": new_password_entry.username,
        "notes": new_password_entry.notes,
        "created_at": new_password_entry.created_at,
        "updated_at": new_password_entry.updated_at,
        "is_deleted": new_password_entry.is_deleted
    }


@router.get("/passwords-list")
def get_passwords_list(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    password_entries = db.query(
        PasswordEntry.id,
        PasswordEntry.user_id,
        PasswordEntry.title,
        PasswordEntry.url,
        PasswordEntry.username,
        PasswordEntry.notes,
        PasswordEntry.created_at,
        PasswordEntry.updated_at,
        PasswordEntry.is_deleted,
        PasswordEntry.is_Favrout
    ).filter(
        PasswordEntry.user_id == user_id,
        PasswordEntry.is_deleted == False
    ).all()

    return [
        {
            "id": entry.id,
            "user_id": entry.user_id,
            "title": entry.title,
            "url": entry.url,
            "is_Favrout": entry.is_Favrout,
            "username": entry.username,
            "notes": entry.notes,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at,
            "is_deleted": entry.is_deleted
        }
        for entry in password_entries
    ]