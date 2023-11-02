"""device table

Revision ID: e38efe912cdf
Revises: 
Create Date: 2023-09-29 19:53:16.848780

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e38efe912cdf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('devicehistorys',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('deviceName', sa.String(length=200), nullable=False),
    sa.Column('field', sa.String(length=200), nullable=False),
    sa.Column('type', sa.String(length=100), nullable=False),
    sa.Column('value', sa.String(length=500), nullable=False),
    sa.Column('unit', sa.String(length=10), nullable=True),
    sa.Column('datatime', sa.String(length=20), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('devices',
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('system_name', sa.String(length=200), nullable=False),
    sa.Column('class_device', sa.String(length=200), nullable=False),
    sa.Column('type', sa.String(length=200), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('token', sa.String(length=200), nullable=True),
    sa.Column('type_command', sa.String(length=200), nullable=True),
    sa.Column('device_polling', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('system_name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=200), nullable=True),
    sa.Column('auth_service_name', sa.String(length=400), nullable=True),
    sa.Column('auth_service_id', sa.Integer(), nullable=True),
    sa.Column('auth_type', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=400), nullable=True),
    sa.Column('role', sa.String(length=10), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name', name='uc_users_name')
    )
    op.create_table('device_fields',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('type', sa.String(length=200), nullable=False),
    sa.Column('low', sa.String(length=200), nullable=True),
    sa.Column('high', sa.String(length=200), nullable=True),
    sa.Column('enum_values', sa.String(length=200), nullable=True),
    sa.Column('read_only', sa.Boolean(), nullable=False),
    sa.Column('icon', sa.String(length=200), nullable=True),
    sa.Column('unit', sa.String(length=200), nullable=True),
    sa.Column('device', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['device'], ['devices.system_name'], name='fk_device_fields_devices_system_name_device'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menuelements',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('iconClass', sa.String(length=200), nullable=True),
    sa.Column('icon', sa.String(length=200), nullable=True),
    sa.Column('url', sa.String(length=200), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_menuelements_users_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sessions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.Column('auth_type', sa.String(length=50), nullable=False),
    sa.Column('access', sa.Text(), nullable=False),
    sa.Column('refresh', sa.Text(), nullable=False),
    sa.Column('access_oauth', sa.Text(), nullable=True),
    sa.Column('refresh_oauth', sa.Text(), nullable=True),
    sa.Column('expires_at', sa.DateTime(), nullable=False),
    sa.Column('oauth_host', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['users.id'], name='fk_sessions_users_id_user'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('access', 'refresh', name='uc_sessions_access_refresh')
    )
    op.create_table('values',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('datatime', sa.String(length=20), nullable=False),
    sa.Column('deviceName', sa.String(length=200), nullable=False),
    sa.Column('field', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['field'], ['device_fields.id'], name='fk_values_device_fields_id_field'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('values')
    op.drop_table('sessions')
    op.drop_table('menuelements')
    op.drop_table('device_fields')
    op.drop_table('users')
    op.drop_table('devices')
    op.drop_table('devicehistorys')
    # ### end Alembic commands ###