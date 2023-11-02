"""virtual field bool field

Revision ID: fca8d24e0bd6
Revises: 72fa494fd004
Create Date: 2023-09-29 20:44:32.221429

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'fca8d24e0bd6'
down_revision = '72fa494fd004'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('device_fields', sa.Column('virtual_field', sa.Boolean(), nullable=True))
    op.drop_column('devices', 'virtual_field')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devices', sa.Column('virtual_field', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.drop_column('device_fields', 'virtual_field')
    # ### end Alembic commands ###