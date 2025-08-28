import { Modal, Form, Select, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { editRole } from "../api/role";
import type { Privilege, Role } from "../types";
import { getPrivileges } from "../api/privileges";

export default function RolePrivilegeModal(
    { open, onClose, role, onSuccess }:{open: boolean, onClose:()=>void, role:Role, onSuccess:()=>void}
) {
  const [form] = Form.useForm<{privileges: string[]}>();
  const [preveliges, setPreveliges] = useState<Privilege[]>([]);
  const [loading, setLoading] = useState(false);

  // загрузить все роли при открытии
    useEffect(() => {
        if (open) {
            form.setFieldValue("privileges", role.privileges.map(i=>i.privilege))
            setLoading(true);
            getPrivileges()
                .then(res => setPreveliges(res.data.privileges))   
                .catch(() => message.error("Ошибка загрузки прав"))
                .finally(() => setLoading(false));   
        }
    }, [open, role]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Отправляем: id пользователя и id роли + id привилегий
      const prev = preveliges.filter(item=>values.privileges.includes(item.privilege))
      await editRole({
        role_name: role.role_name,
        privileges: prev
      });
      message.success("Привилегии обновлены");
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Ошибка изменения привилегий");
    }
  };

  return (
    <Modal
      open={open}
      title={`Изменить привилегии для ${role.role_name || ""}`}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
    >
      {loading ? <Spin /> : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="privileges"
            label="Права"
            rules={[{ required: true, message: "Выберите права" }]}
          >
            <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Выберите права"
            >
            {
                preveliges.map((item, index)=>(
                    <Select.Option key={index} label={item.privilege} value={item.privilege}>{item.privilege}</Select.Option>
                ))
            }
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

