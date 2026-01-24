import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Checkbox,
  Col,
  Divider,
  Progress,
  Row,
  Space,
  Typography,
  Button,
  message,
} from "antd";

const { Title, Paragraph } = Typography;

type MetricKey = "knowledge" | "system" | "risk" | "psychology" | "execution";

type MetricItem = {
  key: string;
  label: string;
  points: number;
};

type Metric = {
  title: string;
  items: MetricItem[];
  max: number;
};

const METRICS: Record<MetricKey, Metric> = {
  knowledge: {
    title: "Kiến thức thị trường",
    max: 20,
    items: [
      {
        key: "trend_sideway",
        label: "Hiểu sự khác biệt Trend / Sideway",
        points: 4,
      },
      { key: "sr_levels", label: "Biết xác định hỗ trợ – kháng cự", points: 4 },
      {
        key: "indicator_reason",
        label: "Hiểu rõ chỉ báo mình dùng (lý do dùng)",
        points: 4,
      },
      {
        key: "setup_quality",
        label: "Phân biệt setup tốt & setup xấu",
        points: 4,
      },
      {
        key: "theory_test",
        label: "Vượt qua test lý thuyết nền tảng",
        points: 4,
      },
    ],
  },
  system: {
    title: "Hệ thống giao dịch",
    max: 20,
    items: [
      { key: "fixed_strategy", label: "Có chiến lược cố định", points: 4 },
      { key: "clear_entry", label: "Có điều kiện vào lệnh rõ ràng", points: 4 },
      { key: "not_trade_rules", label: "Có quy tắc KHÔNG trade", points: 4 },
      {
        key: "exit_plan",
        label: "Có kế hoạch thoát lệnh nhất quán",
        points: 4,
      },
      {
        key: "checklist_execute",
        label: "Có checklist thực thi trước mỗi lệnh",
        points: 4,
      },
    ],
  },
  risk: {
    title: "Quản lý vốn",
    max: 20,
    items: [
      { key: "fixed_risk", label: "Rủi ro %/lệnh cố định", points: 4 },
      { key: "min_rr", label: "Có tỷ lệ RR tối thiểu", points: 4 },
      { key: "no_allin", label: "Không gồng lỗ / không all-in", points: 4 },
      {
        key: "know_drawdown",
        label: "Hiểu 'drawdown' và giới hạn cá nhân",
        points: 4,
      },
      {
        key: "stoploss_every_trade",
        label: "Đặt stop-loss cho mọi lệnh",
        points: 4,
      },
    ],
  },
  psychology: {
    title: "Tâm lý & kỷ luật",
    max: 20,
    items: [
      { key: "no_revenge", label: "Không revenge trade", points: 4 },
      { key: "no_fomo", label: "Không FOMO", points: 4 },
      {
        key: "keep_discipline",
        label: "Giữ kỷ luật sau chuỗi thua",
        points: 4,
      },
      { key: "emotion_journal", label: "Có journal cảm xúc", points: 4 },
      {
        key: "planned_rest",
        label: "Có lịch nghỉ ngơi khi quá tải",
        points: 4,
      },
    ],
  },
  execution: {
    title: "Thực hành & cải thiện",
    max: 20,
    items: [
      { key: "trade_journal", label: "Có journal giao dịch", points: 4 },
      { key: "weekly_review", label: "Review tuần/tháng đều đặn", points: 4 },
      {
        key: "know_personal_mistakes",
        label: "Biết lỗi thường gặp của bản thân",
        points: 4,
      },
      {
        key: "improve_over_time",
        label: "Có cải thiện theo thời gian",
        points: 4,
      },
      { key: "improve_plan", label: "Có kế hoạch cải thiện cụ thể", points: 4 },
    ],
  },
};

type Answers = Record<MetricKey, Record<string, boolean>>;

const STORAGE_KEY = "tg_evaluate_trader_answers";

const EvaluateTraderComponent = () => {
  const [answers, setAnswers] = useState<Answers>({
    knowledge: {},
    system: {},
    risk: {},
    psychology: {},
    execution: {},
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setAnswers(parsed);
      } catch {
        /* noop */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const metricScore = (key: MetricKey) => {
    const metric = METRICS[key];
    return metric.items.reduce(
      (sum, it) => sum + (answers[key][it.key] ? it.points : 0),
      0,
    );
  };

  const totalScore = useMemo(() => {
    return (
      ["knowledge", "system", "risk", "psychology", "execution"] as MetricKey[]
    ).reduce((sum, k) => sum + metricScore(k), 0);
  }, [answers]);

  const level = useMemo(() => {
    if (totalScore <= 35) return "Trader Mới (0–35)";
    if (totalScore <= 65) return "Trader Đang Phát Triển (36–65)";
    if (totalScore <= 85) return "Trader Ổn Định (66–85)";
    return "Trader Chuyên Nghiệp (86–100)";
  }, [totalScore]);

  const guidance = useMemo(() => {
    if (totalScore <= 35) return "Tập trung học nền tảng và xây dựng kỷ luật.";
    if (totalScore <= 65) return "Tối ưu hệ thống và củng cố tâm lý.";
    if (totalScore <= 85) return "Tối ưu hiệu suất, chuẩn hóa quy trình.";
    return "Duy trì tiêu chuẩn cao, mentor người khác nếu phù hợp.";
  }, [totalScore]);

  const toggle = (metric: MetricKey, itemKey: string, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [itemKey]: checked,
      },
    }));
  };

  const resetAll = () => {
    setAnswers({
      knowledge: {},
      system: {},
      risk: {},
      psychology: {},
      execution: {},
    });
    message.success("Đã đặt lại đánh giá");
  };

  return (
    <div className="evaluate-trader">
      <div className="evaluate-trader__header">
        <Title level={2}>Hệ thống đánh giá trình độ Trader</Title>
        <Paragraph className="subtitle">
          Không đánh giá bằng tiền kiếm được. Đánh giá bằng tư duy – kỷ luật –
          quy trình.
        </Paragraph>
      </div>

      <Card className="score-card">
        <Row gutter={24} align="middle">
          <Col span={8}>
            <Progress
              type="circle"
              percent={Math.round((totalScore / 100) * 100)}
              width={140}
            />
          </Col>
          <Col span={16}>
            <div className="score-info">
              <Title level={4}>Tổng điểm: {totalScore}/100</Title>
              <Paragraph className="level">{level}</Paragraph>
              <Paragraph className="guide">Hướng dẫn: {guidance}</Paragraph>
              <Space>
                <Button onClick={resetAll}>Đặt lại</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <Divider />

      <Row gutter={[24, 24]}>
        {(Object.keys(METRICS) as MetricKey[]).map((key) => {
          const metric = METRICS[key];
          const current = metricScore(key);
          return (
            <Col xs={24} lg={12} key={key}>
              <Card
                className="metric-card"
                title={metric.title}
                extra={
                  <span>
                    {current}/{metric.max}
                  </span>
                }
              >
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {metric.items.map((item) => (
                    <Checkbox
                      key={item.key}
                      checked={!!answers[key][item.key]}
                      onChange={(e) => toggle(key, item.key, e.target.checked)}
                    >
                      {item.label}{" "}
                      <span className="points">+{item.points}</span>
                    </Checkbox>
                  ))}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default EvaluateTraderComponent;
