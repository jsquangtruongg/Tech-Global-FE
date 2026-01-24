import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Progress,
  Space,
  Button,
  Checkbox,
  Tabs,
  Tag,
  message,
} from "antd";

const { Title, Paragraph } = Typography;

type Level = "BEGINNER" | "GROWING" | "STABLE";

type Task = {
  key: string;
  label: string;
};

type Module = {
  id: string;
  title: string;
  tasks: Task[];
};

type PathConfig = Record<
  Level,
  { title: string; goal: string; modules: Module[] }
>;

const PATHS: PathConfig = {
  BEGINNER: {
    title: "Lộ trình Trader Mới",
    goal: "Không cháy tài khoản",
    modules: [
      {
        id: "overview",
        title: "Tổng quan thị trường",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "trend-sideway",
        title: "Trend – Sideway",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "sr",
        title: "Hỗ trợ & Kháng cự",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "risk-basics",
        title: "Quản lý vốn cơ bản",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
          { key: "journal", label: "Thực hành journal" },
        ],
      },
      {
        id: "psychology-foundation",
        title: "Tâm lý giao dịch nền tảng",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "journal", label: "Journal cảm xúc" },
        ],
      },
    ],
  },
  GROWING: {
    title: "Lộ trình Trader Đang Phát Triển",
    goal: "Giao dịch có hệ thống",
    modules: [
      {
        id: "market-structure",
        title: "Market Structure",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "strategy",
        title: "Chiến lược giao dịch cụ thể",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "checklist",
        title: "Checklist vào lệnh",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "practice", label: "Thực hành checklist" },
        ],
      },
      {
        id: "backtest",
        title: "Backtest chiến lược",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "practice", label: "Thực hành backtest" },
        ],
      },
      {
        id: "journal-review",
        title: "Journal & Review",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "journal", label: "Journal giao dịch" },
          { key: "review", label: "Review tuần/tháng" },
        ],
      },
    ],
  },
  STABLE: {
    title: "Lộ trình Trader Ổn Định",
    goal: "Tối ưu hiệu suất",
    modules: [
      {
        id: "optimize-strategy",
        title: "Tối ưu chiến lược",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "practice", label: "Thực hành tối ưu" },
        ],
      },
      {
        id: "drawdown",
        title: "Quản lý drawdown",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "quiz", label: "Làm quiz" },
        ],
      },
      {
        id: "advanced-psychology",
        title: "Tâm lý nâng cao",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "journal", label: "Journal cảm xúc nâng cao" },
        ],
      },
      {
        id: "statistics",
        title: "Phân tích thống kê",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "practice", label: "Thực hành thống kê" },
        ],
      },
      {
        id: "personal-style",
        title: "Xây dựng phong cách cá nhân",
        tasks: [
          { key: "lesson", label: "Hoàn thành bài học" },
          { key: "practice", label: "Thực hành định hình phong cách" },
        ],
      },
    ],
  },
};

type ProgressState = Record<string, Record<string, boolean>>;

const STORAGE_KEY = "tg_learning_path_progress";
const EVALUATE_KEY = "tg_evaluate_trader_answers";

const LearningPatComponent = () => {
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [progress, setProgress] = useState<Record<Level, ProgressState>>({
    BEGINNER: {},
    GROWING: {},
    STABLE: {},
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProgress(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const setTask = (moduleId: string, taskKey: string, checked: boolean) => {
    setProgress((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [moduleId]: {
          ...(prev[level][moduleId] || {}),
          [taskKey]: checked,
        },
      },
    }));
  };

  const getModuleDone = (module: Module) => {
    const p = progress[level][module.id] || {};
    return module.tasks.every((t) => !!p[t.key]);
  };

  const unlocked = (index: number) => {
    if (index === 0) return true;
    const prevModule = PATHS[level].modules[index - 1];
    return getModuleDone(prevModule);
  };

  const allTasks = useMemo(
    () => PATHS[level].modules.reduce((sum, m) => sum + m.tasks.length, 0),
    [level],
  );
  const doneTasks = useMemo(() => {
    return PATHS[level].modules.reduce((sum, m) => {
      const p = progress[level][m.id] || {};
      return sum + m.tasks.filter((t) => !!p[t.key]).length;
    }, 0);
  }, [level, progress]);

  const percent = Math.round((doneTasks / allTasks) * 100);

  const currentModule = useMemo(() => {
    const idx = PATHS[level].modules.findIndex(
      (m, i) => !getModuleDone(m) && unlocked(i),
    );
    if (idx === -1) return "Hoàn thành toàn bộ";
    return PATHS[level].modules[idx].title;
  }, [level, progress]);

  const autoSelectFromAssessment = () => {
    const raw = localStorage.getItem(EVALUATE_KEY);
    if (!raw) {
      message.info("Chưa có dữ liệu đánh giá Trader");
      return;
    }
    try {
      const ans = JSON.parse(raw) as Record<string, Record<string, boolean>>;
      const keys = ["knowledge", "system", "risk", "psychology", "execution"];
      const score = keys.reduce(
        (sum, k) =>
          sum + Object.values(ans[k] || {}).filter(Boolean).length * 4,
        0,
      );
      if (score <= 35) setLevel("BEGINNER");
      else if (score <= 65) setLevel("GROWING");
      else setLevel("STABLE");
      message.success("Đã tự động chọn lộ trình phù hợp");
    } catch {
      message.error("Không thể đọc dữ liệu đánh giá");
    }
  };

  return (
    <div className="learning-path">
      <div className="lp-header">
        <Title level={2}>Lộ Trình Học Trading</Title>
        <Paragraph className="lp-subtitle">
          Hoàn thành bài trước để mở bài sau. Tiến bộ theo quy trình.
        </Paragraph>
        <Space>
          <Button onClick={autoSelectFromAssessment}>
            Tự động chọn từ Đánh giá Trader
          </Button>
        </Space>
      </div>

      <Card className="lp-progress">
        <Row gutter={24} align="middle">
          <Col xs={24} md={8}>
            <Progress type="circle" percent={percent} width={140} />
          </Col>
          <Col xs={24} md={16}>
            <div className="lp-progress-info">
              <Title level={4}>{PATHS[level].title}</Title>
              <Paragraph>Mục tiêu: {PATHS[level].goal}</Paragraph>
              <Paragraph>Module đang học: {currentModule}</Paragraph>
              <Space>
                <Tag color="blue">
                  Đã hoàn thành: {doneTasks}/{allTasks} nhiệm vụ
                </Tag>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <Tabs
        activeKey={level}
        onChange={(k) => setLevel(k as Level)}
        items={[
          { key: "BEGINNER", label: "Trader Mới" },
          { key: "GROWING", label: "Trader Đang Phát Triển" },
          { key: "STABLE", label: "Trader Ổn Định" },
        ]}
      />

      <Row gutter={[24, 24]}>
        {PATHS[level].modules.map((m, idx) => {
          const lock = !unlocked(idx);
          return (
            <Col xs={24} lg={12} key={m.id}>
              <Card
                className={`lp-module ${lock ? "locked" : ""}`}
                title={m.title}
                extra={
                  lock ? (
                    <Tag color="red">Khóa</Tag>
                  ) : getModuleDone(m) ? (
                    <Tag color="green">Hoàn thành</Tag>
                  ) : (
                    <Tag color="orange">Đang học</Tag>
                  )
                }
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {m.tasks.map((t) => {
                    const checked = !!progress[level][m.id]?.[t.key];
                    return (
                      <Checkbox
                        key={t.key}
                        checked={checked}
                        disabled={lock}
                        onChange={(e) => setTask(m.id, t.key, e.target.checked)}
                      >
                        {t.label}
                      </Checkbox>
                    );
                  })}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default LearningPatComponent;
