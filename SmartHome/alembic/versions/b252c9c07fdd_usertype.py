"""usertype

Revision ID: b252c9c07fdd
Revises: 3d704de748a7
Create Date: 2022-10-07 20:57:33.057680

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b252c9c07fdd'
down_revision = '3d704de748a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('sessions', sa.Column('auth_type', sa.String(length=50), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('sessions', 'auth_type')
    # ### end Alembic commands ###