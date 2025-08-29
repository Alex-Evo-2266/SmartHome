import { Modal, Form, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useRoleAPI } from "../api/role";
import type { Role, UserSchema } from "../types";
import { useUserAPI } from "../api/users";

export default function RoleModal(
    { open, onClose, user, onSuccess }:{open: boolean, onClose:()=>void, user:UserSchema, onSuccess:()=>void}
) {
  const [form] = Form.useForm<{role: string}>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const {changeRole} = useUserAPI()
  const {getRoles} = useRoleAPI()

  // загрузить все роли при открытии
    useEffect(() => {
        if (open) {
            console.log(user)
            setLoading(true);
            getRoles()
                .then(res => setRoles(res.data.roles))   
                .catch(() => message.error("Ошибка загрузки ролей"))
                .finally(() => setLoading(false));   
        }
    }, [open, user]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Отправляем: id пользователя и id роли + id привилегий
      await changeRole({
        id: user.id,
        role: values.role
      });
      message.success("Пользователь обновлен");
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Ошибка изменения Пользователя");
    }
  };

  return (
    <Modal
      open={open}
      title={`Изменить роль для ${user.name || ""}`}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
    >
      {loading ? <Spin /> : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="role"
            label="Роль"
            rules={[{ required: true, message: "Выберите роль" }]}
          >
            <Select
                    style={{ width: '100%' }}
                    placeholder="выбрать роль"
            >
            {
                roles.map((item, index)=>(
                    <Select.Option key={index} label={item.role_name} value={item.role_name}>{item.role_name}</Select.Option>
                ))
            }
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

