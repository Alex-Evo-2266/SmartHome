"""historyupdate

Revision ID: 3f5ef5983d64
Revises: 19ed3d5a3df3
Create Date: 2022-02-23 13:35:26.959181

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f5ef5983d64'
down_revision = '19ed3d5a3df3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devicehistorys', sa.Column('unit', sa.String(length=10), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('devicehistorys', 'unit')
    # ### end Alembic commands ###