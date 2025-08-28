import { Modal, Form, message, Card, Input, Button } from "antd";
import { useEffect } from "react";
import type { UserSchema } from "../types";
import { editUser } from "../api/users";

export default function UserModal(
    { open, onClose, user, onSuccess }:{open: boolean, onClose:()=>void, user:UserSchema, onSuccess:()=>void}
) {
  const [form] = Form.useForm<{name: string, email: string}>();

  // загрузить все роли при открытии
    useEffect(() => {
        if (open) {
            form.setFields([
                {name: "name", value: user.name},
                {name: "email", value: user.email},
            ])
        }
    }, [open, user]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Отправляем: id пользователя и id роли + id привилегий
      await editUser(user.id, {
        name: values.name,
        email: values.email
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
      title={`Изменить пользователя ${user.name || ""}`}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
    >
        <Form layout="vertical" form={form} onFinish={handleOk}>
          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Создать</Button>
        </Form>
    </Modal>
  );
}

