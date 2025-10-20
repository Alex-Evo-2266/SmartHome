import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space } from "antd";
import type { Session } from "../types";
import { useSessionsAPI } from "../api/sessions";

export default function SessionPage() {
  const {getSessions, deleteSession} = useSessionsAPI()
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getSessions();
      setSessions(data.sessions.map(i=>({...i, expires_at: new Date(i.expires_at)})));
    } catch (err) {
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async(id:string) => {
    await deleteSession(id)
    await fetchUsers();
  }
  
  const columns = [
    { title: "ID", dataIndex: "id"},
    { title: "сервис", dataIndex: "service" },
    { 
        title: "Дата", 
        sorter: (a:Session, b:Session) => a.expires_at.getTime() - b.expires_at.getTime(),
        render: (_:unknown, record: Session) => (<Space>{record.expires_at.toString()}</Space>)
    },
    { title: "host", dataIndex: "host" },
    {
      title: "Действия",
      render: (_:unknown, record: Session) => (
        <Space>
          {
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
        <Table
          loading={loading}
          columns={columns}
          dataSource={sessions}
          rowKey="id"
        />
    </div>
    
  );
}
