import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, Modal, Form, Input } from "antd";
import { useRoleAPI } from "../api/role";
import type { Privilege } from "../types";
import { usePrivilegesAPI } from "../api/privileges";
import { usePrivilege } from "../context/AuthContext";
import { EDIT_ROLE } from "../const";

export default function Privileges() {
  const [roles, setRoles] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const {valid_privilege} = usePrivilege(EDIT_ROLE)
  const {getPrivileges, addPrivilege} = usePrivilegesAPI()
  const {deleteRole} = useRoleAPI()

  const fetchPrivileges = async () => {
    setLoading(true);
    try {
      const { data } = await getPrivileges();
      setRoles(data.privileges);
    } catch (err) {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivileges();
  }, []);

  const handleDelete = async (id:string) => {
    try {
      await deleteRole(id);
      message.success("Пользователь удалён");
      fetchPrivileges();
    } catch {
      message.error("Не удалось удалить");
    }
  };

  const handleAdd = async () => {
    form.resetFields();
    setIsModalVisible(true);
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await addPrivilege(values); // values: { privilege: string }
      message.success("Привилегия добавлена");
      setIsModalVisible(false);
      fetchPrivileges();
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

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Права", dataIndex: "privilege" },
    {
      title: "Действия",
      render: (_:unknown, record: Privilege) => (
        <Space>
            {
                valid_privilege && 
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
        valid_privilege &&
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Добавить привелегию
        </Button>
    }
    <Table
      loading={loading}
      columns={columns}
      dataSource={roles}
      rowKey="id"
    />
    <Modal
        title="Добавить новую привилегию"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="privilege"
            label="Привилегия"
            rules={[{ required: true, message: "Введите название привилегии" }]}
          >
            <Input placeholder="Например: admin.read" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    
  );
}
