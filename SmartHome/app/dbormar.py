import databases
import sqlalchemy
from sqlalchemy import create_engine
import ormar
from app.settings import DB_URL

metadata = sqlalchemy.MetaData()
database = databases.Database(DB_URL)
engine = create_engine(DB_URL)

class BaseMeta(ormar.ModelMeta):
    metadata = metadata
    database = database
