"""id

Revision ID: 701a49772960
Revises: 7edc5a5ec327
Create Date: 2022-11-04 18:10:27.748872

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '701a49772960'
down_revision = '7edc5a5ec327'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('auth_service_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'auth_service_id')
    # ### end Alembic commands ###
