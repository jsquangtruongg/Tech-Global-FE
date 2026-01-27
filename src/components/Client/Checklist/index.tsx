import "./style.scss";
import { useMemo, useRef, useState } from "react";
import {
  Card,
  Typography,
  Select,
  Progress,
  Row,
  Col,
  Checkbox,
  Space,
  Button,
  Tooltip,
  Alert,
  Modal,
} from "antd";
import {
  BarChartOutlined,
  BookOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

type Item = { key: string; label: string; enabled: boolean };
type Block = {
  id: string;
  title: string;
  tooltip?: string;
  items: Item[];
};

const DEFAULT_BLOCKS: Block[] = [
  {
    id: "context",
    title: "Bối cảnh thị trường",
    tooltip: "Chỉ trade khi thị trường có bối cảnh rõ ràng",
    items: [
      { key: "trend", label: "Xu hướng rõ ràng", enabled: true },
      { key: "no-sideway", label: "Không sideway", enabled: true },
      { key: "no-news", label: "Không sắp có tin mạnh", enabled: true },
    ],
  },
  {
    id: "strategy",
    title: "Điều kiện chiến lược",
    items: [
      {
        key: "match-strategy",
        label: "Đúng chiến lược đã chọn",
        enabled: true,
      },
      { key: "match-timeframe", label: "Đúng timeframe", enabled: true },
      { key: "valid-setup", label: "Setup hợp lệ", enabled: true },
    ],
  },
  {
    id: "confirmation",
    title: "Xác nhận kỹ thuật",
    items: [
      {
        key: "candle-confirm",
        label: "Có tín hiệu nến xác nhận",
        enabled: true,
      },
      { key: "entry-position", label: "Vị trí vào lệnh hợp lý", enabled: true },
      { key: "no-late", label: "Không vào trễ", enabled: true },
    ],
  },
  {
    id: "risk",
    title: "Quản lý rủi ro",
    items: [
      { key: "risk-limit", label: "Risk % ≤ giới hạn", enabled: true },
      { key: "rr-min", label: "RR ≥ tối thiểu", enabled: true },
      { key: "valid-sl", label: "Stop Loss hợp lệ", enabled: true },
    ],
  },
  {
    id: "psychology",
    title: "Tâm lý giao dịch",
    items: [
      { key: "no-fomo", label: "Không FOMO", enabled: true },
      { key: "no-revenge", label: "Không revenge trade", enabled: true },
      { key: "stable", label: "Tâm lý ổn định", enabled: true },
    ],
  },
  {
    id: "management",
    title: "Kế hoạch quản lý lệnh",
    items: [
      { key: "tp-plan", label: "Có kế hoạch chốt lời", enabled: true },
      { key: "tsl-plan", label: "Có kế hoạch dời SL", enabled: true },
      {
        key: "exit-conditions",
        label: "Biết điều kiện thoát lệnh",
        enabled: true,
      },
    ],
  },
];

const STRATEGIES = [
  { value: "trend-ema20", label: "Trend Pullback EMA20" },
  { value: "breakout-sr", label: "Breakout S/R" },
  { value: "pinbar-pa", label: "Pin Bar Price Action" },
];

const TIMEFRAMES = [
  { value: "M15", label: "M15" },
  { value: "H1", label: "H1" },
  { value: "H4", label: "H4" },
];

const ChecklistComponent = () => {
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<string>(STRATEGIES[0].value);
  const [timeframe, setTimeframe] = useState<string>(TIMEFRAMES[0].value);
  const [blocks, setBlocks] = useState<Block[]>(DEFAULT_BLOCKS);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [lossStreak, setLossStreak] = useState<number>(3);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fastTickCountRef = useRef(0);
  const lastTickRef = useRef<number>(0);

  const allItems = useMemo(() => {
    const list: Item[] = [];
    blocks.forEach((b) => b.items.forEach((it) => it.enabled && list.push(it)));
    return list;
  }, [blocks]);

  const completed = useMemo(
    () => allItems.filter((it) => checked[it.key]).length,
    [allItems, checked],
  );
  const total = allItems.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const strokeColor =
    percent < 70 ? "#ef4444" : percent < 100 ? "#f59e0b" : "#22c55e";

  const toggleItem = (key: string, value: boolean) => {
    const now = Date.now();
    if (lastTickRef.current && now - lastTickRef.current < 300) {
      fastTickCountRef.current += 1;
      if (fastTickCountRef.current >= 3) {
        setConfirmOpen(true);
        fastTickCountRef.current = 0;
      }
    } else {
      fastTickCountRef.current = 0;
    }
    lastTickRef.current = now;
    setChecked((prev) => ({ ...prev, [key]: value }));
  };

  const enableToggle = (blockId: string, itemKey: string, enabled: boolean) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              items: b.items.map((it) =>
                it.key === itemKey ? { ...it, enabled } : it,
              ),
            }
          : b,
      ),
    );
    setChecked((prev) => {
      const next = { ...prev };
      if (!enabled) delete next[itemKey];
      return next;
    });
  };

  return (
    <div className="checklist">
      {lossStreak >= 3 && (
        <Alert
          type="warning"
          message="Bạn vừa thua nhiều lệnh liên tiếp, hãy cẩn trọng"
          showIcon
          className="cl-alert"
        />
      )}

      <Card className="cl-head">
        <div className="cl-head__row">
          <Title level={3}>Checklist Vào Lệnh</Title>
          <Space>
            <Button
              icon={<BarChartOutlined />}
              onClick={() => navigate("/study")}
            >
              Nhật ký
            </Button>
            <Button
              icon={<WarningOutlined />}
              onClick={() => navigate("/library/common-errors")}
            >
              Lỗi thường gặp
            </Button>
            <Button
              icon={<BookOutlined />}
              onClick={() => navigate("/library/knowledge")}
            >
              Kiến thức
            </Button>
          </Space>
        </div>
        <div className="cl-head__controls">
          <Space wrap>
            <div className="cl-field">
              <Text>Chiến lược</Text>
              <Select
                value={strategy}
                onChange={setStrategy}
                options={STRATEGIES}
                style={{ width: 240 }}
              />
            </div>
            <div className="cl-field">
              <Text>Timeframe</Text>
              <Select
                value={timeframe}
                onChange={setTimeframe}
                options={TIMEFRAMES}
                style={{ width: 120 }}
              />
            </div>
          </Space>
        </div>
        <div className="cl-progress">
          <Text strong>
            {completed} / {total} điều kiện đã hoàn thành
          </Text>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor={strokeColor}
          />
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {blocks.map((b) => (
          <Col xs={24} md={12} key={b.id}>
            <Card
              className="cl-block"
              title={
                b.tooltip ? (
                  <Tooltip title={b.tooltip}>
                    <span>{b.title}</span>
                  </Tooltip>
                ) : (
                  b.title
                )
              }
            >
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {b.items.map((it) => (
                  <div key={it.key} className="cl-item-row">
                    <Checkbox
                      disabled={!it.enabled}
                      checked={!!checked[it.key]}
                      onChange={(e) => toggleItem(it.key, e.target.checked)}
                    >
                      {it.label}
                    </Checkbox>
                    <Checkbox
                      checked={it.enabled}
                      onChange={(e) =>
                        enableToggle(b.id, it.key, e.target.checked)
                      }
                    >
                      Bật
                    </Checkbox>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="cl-actions">
        <Space>
          <Tooltip title={percent === 100 ? "" : "Chưa đủ điều kiện vào lệnh"}>
            <Button type="primary" disabled={percent !== 100}>
              Vào Lệnh
            </Button>
          </Tooltip>
          <Button> Lưu checklist</Button>
          <Button danger>Hủy</Button>
        </Space>
      </div>

      <Modal
        title="Xác nhận"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        footer={<Button onClick={() => setConfirmOpen(false)}>Đã hiểu</Button>}
      >
        <Paragraph>Bạn có chắc đã kiểm tra kỹ?</Paragraph>
      </Modal>
    </div>
  );
};

export default ChecklistComponent;
