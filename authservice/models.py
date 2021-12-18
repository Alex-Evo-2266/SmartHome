import ormar
from db import metadata, database
from typing import Optional

class User(ormar.Model):
    class Meta:
        database = database
        metadata = metadata
    id: int = ormar.Integer(primary_key=True)
    login: str = ormar.String(max_length=50)
    password: str = ormar.String(max_length=50)
    name: str = ormar.String(max_length=50)
    surname: str = ormar.String(max_length=50)

class TokenList(ormar.Model):
    class Meta:
        database = database
        metadata = metadata
    id: int = ormar.Integer(primary_key=True)
    # user: Optional[User] = ormar.ForeignKey(User)
    toket: str = ormar.String(max_length=500)
