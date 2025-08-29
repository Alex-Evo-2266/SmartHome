import { useEffect, useRef, useState } from "react";
import { Table, Button, Popconfirm, message, Space, Input, type InputRef, Typography } from "antd";
import type { Session } from "../types";
import { useSessionsAPI } from "../api/sessions";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@mui/icons-material";

export default function SessionPage() {
  const {getSessions, deleteSession} = useSessionsAPI()
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  type DataIndex = keyof Session;

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Session> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ''}`}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Typography style={{color: "red"}}>{text}</Typography>
      ) : (
        text
      ),
  });
  
  const columns = [
    { title: "ID", dataIndex: "id", ...getColumnSearchProps("id") },
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
