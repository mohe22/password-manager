import jwt
import datetime
from cryptography.hazmat.primitives import serialization
from typing import Union
from config import Config



def load_private_key(file_path: str):
    with open(file_path, "rb") as key_file:
        return serialization.load_pem_private_key(
            key_file.read(),
            password=None,
        )

def load_public_key(file_path: str):
    with open(file_path, "rb") as key_file:
        return serialization.load_pem_public_key(
            key_file.read()
        )

def create_access_token(data: dict, expires_delta: Union[datetime.timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        # sets expire to the current UTC time plus the expires_delta.
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        #  sets expire to the current UTC time plus a default duration defined by ACCESS_TOKEN_EXPIRE_MINUTES.
        expire = datetime.datetime.utcnow() + datetime.timedelta(hours=Config.ACCESS_TOKEN_EXPIRE_HOURS)

    to_encode.update({"exp": expire})
    private_key = load_private_key(Config.PRIVATE_KEY_PATH)
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm="RS256")
    return encoded_jwt

def decode_access_token(token: str):
    public_key = load_public_key(Config.PUBLIC_KEY_PATH)
    try:
        # Decode the token using the public key and RS256 algorithm
        payload = jwt.decode(token, public_key, algorithms=["RS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        raise
    except jwt.InvalidTokenError:
        print("Invalid token")
        raise

