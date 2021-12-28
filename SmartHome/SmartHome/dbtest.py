import databases
import sqlalchemy
from sqlalchemy import create_engine
import ormar

metadata = sqlalchemy.MetaData()
database = databases.Database("mysql+pymysql://roothome:root@localhost:3306/djangoSmartHome")
engine = create_engine("mysql+pymysql://roothome:root@localhost:3306/djangoSmartHome")

class BaseMeta(ormar.ModelMeta):
    metadata = metadata
    database = database
