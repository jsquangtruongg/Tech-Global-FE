import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Space,
  Button,
  Table,
  Input,
  Select,
  Modal,
  Popconfirm,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAdminDiariesAPI, deleteAdminDiaryAPI } from "../../../api/my-diary";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";

type DiaryItem = {
  id: number;
  user_id: number;
  emotion?: "positive" | "negative" | "neutral";
  title: string;
  content: string;
  createdAt: string;
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

const FeelingAdminComponent = () => {
  const [items, setItems] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [viewer, setViewer] = useState<{
    open: boolean;
    record?: DiaryItem;
  }>({ open: false });

  const handleViewJournal = (record: DiaryItem) => {
    const name = record.user
      ? `${record.user.firstName || ""} ${record.user.lastName || ""}`.trim() ||
        record.user.email ||
        `User #${record.user.id}`
      : "";
    const emoMap: Record<string, { color: string; label: string }> = {
      positive: { color: "green", label: "Tích cực" },
      negative: { color: "red", label: "Tiêu cực" },
      neutral: { color: "blue", label: "Bình tĩnh" },
    };
    const emo = record.emotion ? emoMap[record.emotion] : undefined;
    setViewer({ open: true, record });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminDiariesAPI({
        page,
        limit,
        q: q || undefined,
        user_id: userId || undefined,
      });
      if (res?.data) {
        const mapped: DiaryItem[] = res.data.map((d: any) => ({
          id: Number(d.id),
          user_id: Number(d.user_id),
          emotion: d.emotion,
          title: String(d.title),
          content: String(d.content || ""),
          createdAt: d.createdAt || d.created_at || new Date().toISOString(),
          user: d.user
            ? {
                id: Number(d.user.id),
                firstName: d.user.firstName,
                lastName: d.user.lastName,
                email: d.user.email,
              }
            : undefined,
        }));
        setItems(mapped);
        setTotal(res.pagination?.total || 0);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, q, userId]);

  const userOptions = useMemo(() => {
    const map = new Map<number, { label: string; value: number }>();
    items.forEach((i) => {
      if (i.user) {
        const label =
          `${i.user.firstName || ""} ${i.user.lastName || ""}`.trim() ||
          i.user.email ||
          `User #${i.user.id}`;
        if (!map.has(i.user.id))
          map.set(i.user.id, { label, value: i.user.id });
      }
    });
    return Array.from(map.values());
  }, [items]);

  const onDelete = async (id: number) => {
    try {
      await deleteAdminDiaryAPI(id);
      fetchData();
    } catch (e) {}
  };

  const emotionSummary = useMemo(() => {
    const summary = { positive: 0, negative: 0, neutral: 0 };
    items.forEach((i) => {
      if (i.emotion && summary[i.emotion] !== undefined) {
        summary[i.emotion] += 1;
      }
    });
    return [
      { emotion: "Tích cực", value: summary.positive, color: "#52c41a" },
      { emotion: "Tiêu cực", value: summary.negative, color: "#ff4d4f" },
      { emotion: "Bình tĩnh", value: summary.neutral, color: "#1677ff" },
    ];
  }, [items]);

  const userEmotionData = useMemo(() => {
    const map = new Map<
      number,
      {
        name: string;
        positive: number;
        negative: number;
        neutral: number;
        total: number;
      }
    >();
    items.forEach((i) => {
      const uid = i.user?.id ?? i.user_id;
      const name = i.user
        ? `${i.user.firstName || ""} ${i.user.lastName || ""}`.trim() ||
          i.user.email ||
          `User #${i.user.id}`
        : `User #${uid}`;
      const cur = map.get(uid) || {
        name,
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
      };
      if (i.emotion === "positive") cur.positive += 1;
      else if (i.emotion === "negative") cur.negative += 1;
      else cur.neutral += 1;
      cur.total = cur.positive + cur.negative + cur.neutral;
      map.set(uid, cur);
    });
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [items]);

  return (
    <div className="feeling-admin">
      <div className="page-header">
        <h1>Nhật ký cảm xúc (Admin)</h1>
        <p>Quản lý nhật ký cảm xúc của người dùng.</p>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <Card
          title="Thống kê cảm xúc tổng quan"
          style={{ flex: "1 1 0", minWidth: 0 }}
        >
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={emotionSummary}
                  dataKey="value"
                  nameKey="emotion"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {emotionSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card
          title="Emotion distribution by user (Top)"
          style={{ flex: "1 1 0", minWidth: 0 }}
        >
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart
                data={userEmotionData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="positive"
                  name="Tích cực"
                  stackId="a"
                  fill="#52c41a"
                />
                <Bar
                  dataKey="neutral"
                  name="Bình tĩnh"
                  stackId="a"
                  fill="#1677ff"
                />
                <Bar
                  dataKey="negative"
                  name="Tiêu cực"
                  stackId="a"
                  fill="#ff4d4f"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card className="fa-toolbar">
        <Space wrap>
          <Input.Search
            placeholder="Tìm theo tiêu đề"
            allowClear
            onSearch={(v) => {
              setPage(1);
              setQ(v);
            }}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Lọc theo người dùng"
            options={userOptions}
            value={userId}
            onChange={(v) => {
              setPage(1);
              setUserId(v);
            }}
            style={{ minWidth: 220 }}
          />
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
            },
          }}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              width: 80,
            },
            {
              title: "Người dùng",
              dataIndex: "user",
              render: (u: DiaryItem["user"]) => {
                if (!u) return "-";
                const name =
                  `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                  u.email ||
                  `User #${u.id}`;
                return (
                  <Space>
                    <span>{name}</span>
                  </Space>
                );
              },
            },
            {
              title: "Tiêu đề",
              dataIndex: "title",
            },
            {
              title: "Cảm xúc",
              dataIndex: "emotion",
              render: (v: string) => {
                if (!v) return "-";
                const map: Record<string, string> = {
                  positive: "green",
                  negative: "red",
                  neutral: "blue",
                };
                const label =
                  v === "positive"
                    ? "Tích cực"
                    : v === "negative"
                      ? "Tiêu cực"
                      : "Bình tĩnh";
                return <Tag color={map[v] || "blue"}>{label}</Tag>;
              },
            },
            {
              title: "Thời gian",
              dataIndex: "createdAt",
              render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
              width: 160,
            },
            {
              title: "Thao tác",
              key: "actions",
              render: (_: any, record: DiaryItem) => (
                <Space>
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    title="Xem"
                    onClick={() => handleViewJournal(record)}
                  />
                  <Popconfirm
                    title="Xóa nhật ký"
                    description="Bạn có chắc chắn muốn xóa nhật ký này?"
                    onConfirm={() => onDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
              width: 220,
            },
          ]}
        />
      </Card>

      <Modal
        open={viewer.open}
        title={viewer.record?.title}
        onCancel={() => setViewer({ open: false })}
        footer={null}
        width={800}
      >
        <Space style={{ marginBottom: 12 }} wrap>
          {viewer.record?.emotion && (
            <Tag
              color={
                viewer.record.emotion === "positive"
                  ? "green"
                  : viewer.record.emotion === "negative"
                    ? "red"
                    : "blue"
              }
            >
              {viewer.record.emotion === "positive"
                ? "Tích cực"
                : viewer.record.emotion === "negative"
                  ? "Tiêu cực"
                  : "Bình tĩnh"}
            </Tag>
          )}
          {viewer.record?.user && (
            <span>
              Người dùng:{" "}
              {`${viewer.record.user.firstName || ""} ${
                viewer.record.user.lastName || ""
              }`.trim() ||
                viewer.record.user.email ||
                `User #${viewer.record.user.id}`}
            </span>
          )}
          {viewer.record?.createdAt && (
            <span>
              {dayjs(viewer.record.createdAt).format("DD/MM/YYYY HH:mm")}
            </span>
          )}
        </Space>
        {viewer.record?.content && (
          <div dangerouslySetInnerHTML={{ __html: viewer.record.content }} />
        )}
      </Modal>
    </div>
  );
};
export default FeelingAdminComponent;
