import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, Typography, Modal, Form, Input } from "antd";
import { getRoles, deleteRole, addRole } from "../api/role";
import type { Role } from "../types";
import { usePrivilege } from "../context/AuthContext";
import { EDIT_ROLE } from "../const";
import RolePrivilegeModal from "../components/RolePrivilegeModal";

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const {valid_privilege} = usePrivilege(EDIT_ROLE)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState<null | Role>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await getRoles();
      setRoles(data.roles);
    } catch (err) {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id:string) => {
    try {
      await deleteRole(id);
      message.success("Пользователь удалён");
      fetchRoles();
    } catch {
      message.error("Не удалось удалить");
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  }

  const handleModalOk = async () => {
      try {
        const values = await form.validateFields();
        await addRole(values); // values: { privilege: string }
        message.success("Привилегия добавлена");
        setIsModalVisible(false);
        fetchRoles();
      } catch (err) {
        if (err instanceof Error) {
          message.error(err.message);
        } else {
          message.error("Не удалось добавить привилегию");
        }
      }
    };
  
    const handleModalCancel = () => {
      setIsModalVisible(false);
    };

    const handleModalPrivileges = () => {
      setModalEditVisible(null);
      fetchRoles();
    }

    const handleModalPrivilegesCancel = () => {
      setModalEditVisible(null);
    };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Роль", dataIndex: "role_name" },
    { title: "Права",
        render: (_:unknown, record: Role) => {
            const data = record.privileges
            return(<Typography>{data.map(i=>i.privilege).join(", ")}</Typography>)
        }
    },
    {
      title: "Действия",
      render: (_:unknown, record: Role) => ( valid_privilege &&
        <Space>
          <Button type="link" onClick={()=>setModalEditVisible(record)}>Изменить</Button>
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
    <div>
        {
            valid_privilege &&
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Добавить роль
            </Button>
        }
        <Table
        loading={loading}
        columns={columns}
        dataSource={roles}
        rowKey="id"
        />
        <Modal
            title="Добавить новую роль"
            visible={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="Сохранить"
            cancelText="Отмена"
        >
            <Form form={form} layout="vertical">
            <Form.Item
                name="role_name"
                label="роль"
                rules={[{ required: true, message: "Введите название роли" }]}
            >
                <Input placeholder="Например: admin" />
            </Form.Item>
            </Form>
        </Modal>
        {
            modalEditVisible && 
            <RolePrivilegeModal role={modalEditVisible} onSuccess={handleModalPrivileges} onClose={handleModalPrivilegesCancel} open={modalEditVisible !== null}/>
        }
    </div>
    
  );
}
