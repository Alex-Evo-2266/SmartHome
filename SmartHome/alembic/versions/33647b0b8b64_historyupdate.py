"""historyupdate

Revision ID: 33647b0b8b64
Revises: bf4d0c3de18e
Create Date: 2022-02-23 13:26:16.793082

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '33647b0b8b64'
down_revision = 'bf4d0c3de18e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('devicehistorys', sa.Column('datatime', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('devicehistorys', 'datatime')
    # ### end Alembic commands ###
