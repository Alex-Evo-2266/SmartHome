"""role

Revision ID: 5deb10093bce
Revises: d9d7d5f9d7fa
Create Date: 2022-10-08 10:41:53.027065

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '5deb10093bce'
down_revision = 'd9d7d5f9d7fa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('sessions', 'user',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=False)
    op.alter_column('users', 'role',
               existing_type=mysql.VARCHAR(length=400),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'role',
               existing_type=mysql.VARCHAR(length=400),
               nullable=False)
    op.alter_column('sessions', 'user',
               existing_type=mysql.INTEGER(display_width=11),
               nullable=True)
    # ### end Alembic commands ###
