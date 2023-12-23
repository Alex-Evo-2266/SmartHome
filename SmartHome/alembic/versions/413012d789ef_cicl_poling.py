"""cicl poling

Revision ID: 413012d789ef
Revises: 964e0ff15815
Create Date: 2023-12-23 20:09:00.618175

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '413012d789ef'
down_revision = '964e0ff15815'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devices', sa.Column('device_cyclic_polling', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('devices', 'device_cyclic_polling')
    # ### end Alembic commands ###
