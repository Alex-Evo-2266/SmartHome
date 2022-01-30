"""made some changesf

Revision ID: cc59c0797154
Revises: 
Create Date: 2022-01-04 13:23:42.401430

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc59c0797154'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('UserName', sa.String(length=200), nullable=False),
    sa.Column('UserSurname', sa.String(length=200), nullable=True),
    sa.Column('UserPassword', sa.String(length=200), nullable=False),
    sa.Column('UserEmail', sa.String(length=200), nullable=False),
    sa.Column('UserMobile', sa.String(length=200), nullable=False),
    sa.Column('UserLevel', sa.Integer(), nullable=True),
    sa.Column('Style', sa.String(length=200), nullable=True),
    sa.Column('auteStyle', sa.Boolean(), nullable=True),
    sa.Column('staticBackground', sa.Boolean(), nullable=True),
    sa.Column('page', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('imagebackgrounds',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=200), nullable=True),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('image', sa.String(length=1000), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_imagebackgrounds_users_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menuelements',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('iconClass', sa.String(length=200), nullable=True),
    sa.Column('url', sa.String(length=200), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_menuelements_users_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('menuelements')
    op.drop_table('imagebackgrounds')
    op.drop_table('users')
    # ### end Alembic commands ###