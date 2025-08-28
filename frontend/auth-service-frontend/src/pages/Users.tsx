import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space } from "antd";
import { getAllUsers, deleteUser } from "../api/users";
import type { UserSchema } from "../types";
import { useAuth, usePrivilege } from "../context/AuthContext";
import { ADD_USER, DELETE_USER, EDIT_ROLE_USER, EDIT_USER } from "../const";
import RoleModal from "../components/RoleModal";
import { NavLink } from "react-router-dom";
import UserModal from "../components/UserEditModal";

export default function Users() {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()
  const {valid_privilege:valid_add} = usePrivilege(ADD_USER)
  const {valid_privilege:valid_edit} = usePrivilege(EDIT_USER)
  const {valid_privilege:valid_delete} = usePrivilege(DELETE_USER)
  const {valid_privilege:valid_edit_role} = usePrivilege(EDIT_ROLE_USER)
  const [editRoleUserModal, setEditRoleUserModal] = useState<null | UserSchema>(null);
  const [editUserModal, setEditUserModal] = useState<null | UserSchema>(null);
  

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      setUsers(data.users);
    } catch (err) {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id:string) => {
    try {
      await deleteUser(id);
      message.success("Пользователь удалён");
      fetchUsers();
    } catch {
      message.error("Не удалось удалить");
    }
  };

   const handleModal = () => {
      setEditRoleUserModal(null);
      setEditUserModal(null)
      fetchUsers();
    }

    const handleModalCancel = () => {
      setEditRoleUserModal(null);
      setEditUserModal(null)
    };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Имя", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Роль", dataIndex: "role" },
    {
      title: "Действия",
      render: (_:unknown, record: UserSchema) => (
        <Space>
          {
            (valid_edit || (user && user.userId === record.id)) &&
            <Button type="link" onClick={()=>setEditUserModal(record)}>Изменить</Button>
          }
          {
            valid_edit_role && user && user.userId !== record.id &&
            <Button type="link" onClick={()=>setEditRoleUserModal(record)}>Изменить роль</Button>
          }
          {
            valid_delete && user && user.userId !== record.id &&
            <Popconfirm
              title="Удалить пользователя?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" danger>Удалить</Button>
            </Popconfirm>
          }
        </Space>
      ),
    },
  ];

  return (
    <div>
        {
          valid_add &&
          <NavLink to={"/users/add"}>
            <Button type="primary" style={{ marginBottom: 16 }}>
              Добавить пользователя
            </Button>
          </NavLink>
        }
        <Table
          loading={loading}
          columns={columns}
          dataSource={users}
          rowKey="id"
        />
        {
          editRoleUserModal &&
          <RoleModal open={editRoleUserModal !== null} user={editRoleUserModal} onClose={handleModalCancel} onSuccess={handleModal}/>
        }
        {
          editUserModal &&
          <UserModal open={editUserModal !== null} user={editUserModal} onClose={handleModalCancel} onSuccess={handleModal}/>
        }
    </div>
    
  );
}
