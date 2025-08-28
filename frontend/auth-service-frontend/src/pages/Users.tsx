import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space } from "antd";
import { getAllUsers, deleteUser } from "../api/users";
import type { UserSchema } from "../types";

export default function Users() {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [loading, setLoading] = useState(true);

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

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Имя", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Роль", dataIndex: "role" },
    {
      title: "Действия",
      render: (_:unknown, record: UserSchema) => (
        <Space>
          <Button type="link">Изменить</Button>
          <Popconfirm
            title="Удалить пользователя?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>Удалить</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={users}
      rowKey="id"
    />
  );
}
