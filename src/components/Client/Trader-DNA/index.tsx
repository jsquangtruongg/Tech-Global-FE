import React, { useState } from "react";
import {
  Button,
  Card,
  Progress,
  Typography,
  Row,
  Col,
  Statistic,
  Steps,
  Tag,
} from "antd";
import {
  RocketOutlined,
  FieldTimeOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Title, Text, Paragraph } = Typography;

// --- Data & Types ---

type TraderType = "SCALPER" | "DAY_TRADER" | "SWING_TRADER" | "POSITION_TRADER";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    points: Record<TraderType, number>;
  }[];
}

interface ResultProfile {
  type: TraderType;
  title: string;
  description: string;
  psychology: string;
  strategy: string;
  timeframe: string;
  risk: string;
  color: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Bạn có bao nhiêu thời gian dành cho việc theo dõi biểu đồ mỗi ngày?",
    options: [
      {
        text: "Tôi có thể ngồi trước màn hình cả ngày (6-8 tiếng+).",
        points: {
          SCALPER: 3,
          DAY_TRADER: 2,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Khoảng 2-4 tiếng, chủ yếu vào các phiên giao dịch chính.",
        points: {
          SCALPER: 1,
          DAY_TRADER: 3,
          SWING_TRADER: 1,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Chỉ khoảng 30 phút - 1 tiếng để check thị trường.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 1,
          SWING_TRADER: 3,
          POSITION_TRADER: 1,
        },
      },
      {
        text: "Tôi rất bận, chỉ xem được vào cuối tuần hoặc vài lần một tuần.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 0,
          SWING_TRADER: 1,
          POSITION_TRADER: 3,
        },
      },
    ],
  },
  {
    id: 2,
    question:
      "Phản ứng của bạn khi lệnh vừa vào bị âm trạng thái (lỗ tạm thời) là gì?",
    options: [
      {
        text: "Cắt lỗ ngay lập tức nếu sai xu hướng ngắn hạn.",
        points: {
          SCALPER: 3,
          DAY_TRADER: 2,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Lo lắng, nhưng chờ xem giá có hồi lại trong phiên không.",
        points: {
          SCALPER: 1,
          DAY_TRADER: 3,
          SWING_TRADER: 1,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Bình tĩnh, vì tôi đã tính toán biên độ dao động cho vài ngày tới.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 1,
          SWING_TRADER: 3,
          POSITION_TRADER: 1,
        },
      },
      {
        text: "Không quan tâm lắm, tôi nhìn vào giá trị dài hạn.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 0,
          SWING_TRADER: 1,
          POSITION_TRADER: 3,
        },
      },
    ],
  },
  {
    id: 3,
    question: "Mục tiêu lợi nhuận của bạn như thế nào?",
    options: [
      {
        text: "Kiếm tiền nhanh, nhiều lệnh nhỏ cộng lại thành lớn.",
        points: {
          SCALPER: 3,
          DAY_TRADER: 1,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Kết thúc ngày giao dịch với lợi nhuận, không giữ lệnh qua đêm.",
        points: {
          SCALPER: 1,
          DAY_TRADER: 3,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Bắt được một con sóng lớn kéo dài vài ngày đến vài tuần.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 1,
          SWING_TRADER: 3,
          POSITION_TRADER: 1,
        },
      },
      {
        text: "Đầu tư giá trị, chờ đợi tài sản tăng trưởng theo năm.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 0,
          SWING_TRADER: 1,
          POSITION_TRADER: 3,
        },
      },
    ],
  },
  {
    id: 4,
    question: "Bạn thích phân tích thị trường theo cách nào?",
    options: [
      {
        text: "Nhìn hành động giá (Price Action) và nến ở khung M1, M5.",
        points: {
          SCALPER: 3,
          DAY_TRADER: 2,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Kết hợp chỉ báo kỹ thuật và tin tức trong ngày.",
        points: {
          SCALPER: 1,
          DAY_TRADER: 3,
          SWING_TRADER: 1,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Phân tích xu hướng lớn (Trendline, Chart Pattern) trên H4, D1.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 1,
          SWING_TRADER: 3,
          POSITION_TRADER: 1,
        },
      },
      {
        text: "Phân tích cơ bản (Vĩ mô, Doanh nghiệp, Chu kỳ kinh tế).",
        points: {
          SCALPER: 0,
          DAY_TRADER: 0,
          SWING_TRADER: 1,
          POSITION_TRADER: 3,
        },
      },
    ],
  },
  {
    id: 5,
    question: "Mức độ kiên nhẫn của bạn ra sao?",
    options: [
      {
        text: "Rất thấp, tôi muốn thấy kết quả ngay lập tức.",
        points: {
          SCALPER: 3,
          DAY_TRADER: 1,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Trung bình, tôi có thể chờ vài giờ nhưng không muốn chờ qua ngày.",
        points: {
          SCALPER: 1,
          DAY_TRADER: 3,
          SWING_TRADER: 0,
          POSITION_TRADER: 0,
        },
      },
      {
        text: "Khá cao, tôi sẵn sàng chờ setup đẹp nhất dù mất vài ngày.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 1,
          SWING_TRADER: 3,
          POSITION_TRADER: 1,
        },
      },
      {
        text: "Vô cực, tôi có thể chờ đợi cơ hội cả tháng hoặc cả quý.",
        points: {
          SCALPER: 0,
          DAY_TRADER: 0,
          SWING_TRADER: 1,
          POSITION_TRADER: 3,
        },
      },
    ],
  },
];

const PROFILES: Record<TraderType, ResultProfile> = {
  SCALPER: {
    type: "SCALPER",
    title: "The Scalper (Du kích thị trường)",
    description:
      "Bạn là mẫu người phản xạ nhanh, thích sự sôi động và muốn thấy kết quả tức thì. Bạn không thích rủi ro khi giữ lệnh qua đêm và tin rằng 'năng nhặt chặt bị'.",
    psychology:
      "Tập trung cao độ, kỷ luật thép, không để cảm xúc chi phối trong tích tắc. Dễ bị căng thẳng (stress) cao.",
    strategy:
      "Giao dịch khung thời gian nhỏ (M1, M5). Sử dụng Order Flow, Level 2, hoặc các chỉ báo nhanh (RSI, Stochastic). Đánh nhanh rút gọn.",
    timeframe: "M1 - M15",
    risk: "Cao (Do tần suất giao dịch lớn)",
    color: "#f5222d", // Red
  },
  DAY_TRADER: {
    type: "DAY_TRADER",
    title: "Day Trader (Nhà giao dịch trong ngày)",
    description:
      "Bạn coi trading là một công việc nghiêm túc hàng ngày. Bạn thích chốt lời/lỗ trong ngày để ngủ ngon, không lo lắng về gap giá sáng hôm sau.",
    psychology:
      "Kiên nhẫn chờ setup trong phiên, kỷ luật quản lý vốn. Cần sự ổn định tâm lý trong suốt phiên giao dịch.",
    strategy:
      "Breakout, Reversal trong phiên. Kết hợp Phân tích kỹ thuật và tin tức. Thường trade phiên Âu hoặc Mỹ.",
    timeframe: "M15 - H1",
    risk: "Trung bình",
    color: "#fa8c16", // Orange
  },
  SWING_TRADER: {
    type: "SWING_TRADER",
    title: "Swing Trader (Nhà giao dịch theo sóng)",
    description:
      "Bạn là người điềm tĩnh, thích nhìn bức tranh lớn hơn. Bạn không có thời gian ngồi canh bảng điện cả ngày nhưng vẫn muốn kiếm lợi nhuận từ các biến động giá lớn.",
    psychology:
      "Kiên nhẫn cao, chịu được rung lắc của thị trường (pullback). Không bị ảnh hưởng bởi nhiễu động ngắn hạn.",
    strategy:
      "Trend Following, Mô hình giá (Vai đầu vai, 2 đỉnh/đáy) trên khung lớn. Giữ lệnh vài ngày đến vài tuần.",
    timeframe: "H4 - D1 - W1",
    risk: "Trung bình - Thấp",
    color: "#1890ff", // Blue
  },
  POSITION_TRADER: {
    type: "POSITION_TRADER",
    title: "Position Trader (Nhà đầu tư dài hạn)",
    description:
      "Bạn có tầm nhìn xa trông rộng (Visionary). Bạn quan tâm đến giá trị cốt lõi và xu hướng vĩ mô hơn là biến động giá hàng ngày.",
    psychology:
      "Tâm lý vững vàng như bàn thạch. Bỏ qua mọi biến động ngắn hạn. Tin tưởng tuyệt đối vào nhận định vĩ mô.",
    strategy:
      "Phân tích cơ bản (Fundamental Analysis), Chu kỳ thị trường. Mua và nắm giữ (Buy & Hold).",
    timeframe: "D1 - W1 - MN",
    risk: "Thấp (trong dài hạn)",
    color: "#52c41a", // Green
  },
};

const TraderDNAComponent = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<TraderType, number>>({
    SCALPER: 0,
    DAY_TRADER: 0,
    SWING_TRADER: 0,
    POSITION_TRADER: 0,
  });
  const [finished, setFinished] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (points: Record<TraderType, number>) => {
    const newScores = { ...scores };
    (Object.keys(points) as TraderType[]).forEach((key) => {
      newScores[key] += points[key];
    });
    setScores(newScores);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoadingResult(true);
      setTimeout(() => {
        setLoadingResult(false);
        setFinished(true);
      }, 1500); // Fake analyzing delay
    }
  };

  const getResult = (): ResultProfile => {
    let maxScore = -1;
    let resultType: TraderType = "SWING_TRADER"; // Default

    (Object.keys(scores) as TraderType[]).forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        resultType = key;
      }
    });

    return PROFILES[resultType];
  };

  const handleRetake = () => {
    setScores({
      SCALPER: 0,
      DAY_TRADER: 0,
      SWING_TRADER: 0,
      POSITION_TRADER: 0,
    });
    setCurrentQuestionIndex(0);
    setFinished(false);
    setStarted(false);
  };

  const renderIntro = () => (
    <div className="dna-intro">
      <div className="intro-content">
        <RocketOutlined className="intro-icon" />
        <Title level={2}>Khám Phá Trader DNA Của Bạn</Title>
        <Paragraph className="intro-desc">
          Mỗi trader đều có một "mã gen" giao dịch riêng biệt. Việc cố gắng giao
          dịch sai với tính cách của mình là nguyên nhân hàng đầu dẫn đến thua
          lỗ.
          <br />
          <br />
          Hãy dành 2 phút để trả lời các câu hỏi trắc nghiệm tâm lý này. Chúng
          tôi sẽ phân tích và cho bạn biết bạn thuộc kiểu trader nào và chiến
          lược nào phù hợp nhất với bạn.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={handleStart}
          className="btn-start"
        >
          Bắt đầu kiểm tra ngay <ArrowRightOutlined />
        </Button>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = QUESTIONS[currentQuestionIndex];
    const percent = (currentQuestionIndex / QUESTIONS.length) * 100;

    return (
      <div className="dna-quiz">
        <div className="quiz-progress">
          <Text strong>
            Câu hỏi {currentQuestionIndex + 1}/{QUESTIONS.length}
          </Text>
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
          />
        </div>

        <Card className="question-card" bordered={false}>
          <Title level={3} className="question-text">
            {question.question}
          </Title>
          <div className="options-grid">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="option-item"
                onClick={() => handleAnswer(option.points)}
              >
                <div className="option-circle">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">{option.text}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="dna-loading">
      <div className="loader-content">
        <div className="dna-spinner"></div>
        <Title level={3}>Đang phân tích hành vi...</Title>
        <Text>Hệ thống đang tổng hợp câu trả lời của bạn</Text>
      </div>
    </div>
  );

  const renderResult = () => {
    const result = getResult();

    return (
      <div className="dna-result">
        <div
          className="result-header"
          style={{
            background: `linear-gradient(135deg, ${result.color}22 0%, #ffffff 100%)`,
          }}
        >
          <Tag color={result.color} className="result-tag">
            KẾT QUẢ PHÂN TÍCH
          </Tag>
          <Title
            level={1}
            style={{ color: result.color, marginTop: 10, marginBottom: 5 }}
          >
            {result.title}
          </Title>
          <Text type="secondary" className="result-subtitle">
            Phong cách giao dịch phù hợp nhất với bạn
          </Text>
        </div>

        <div className="result-body">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={14}>
              <Card
                title={
                  <>
                    <UserOutlinedIcon /> Hồ sơ tâm lý
                  </>
                }
                className="info-card"
              >
                <Paragraph className="result-desc">
                  {result.description}
                </Paragraph>
                <div className="psychology-box">
                  <Text strong>🧠 Đặc điểm tâm lý:</Text>
                  <p>{result.psychology}</p>
                </div>
              </Card>

              <Card
                title={
                  <>
                    <BulbOutlinedIcon /> Lời khuyên chiến lược
                  </>
                }
                className="info-card mt-4"
              >
                <Paragraph>{result.strategy}</Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={10}>
              <Card className="stats-card">
                <Statistic
                  title="Khung thời gian tối ưu"
                  value={result.timeframe}
                  prefix={<FieldTimeOutlined />}
                />
                <div className="divider"></div>
                <Statistic
                  title="Mức độ rủi ro"
                  value={result.risk}
                  prefix={<SafetyCertificateOutlined />}
                  valueStyle={{ fontSize: 18 }}
                />

                <div className="recommendation-box" style={{ marginTop: 20 }}>
                  <Text strong>Các cặp tiền/Sản phẩm gợi ý:</Text>
                  <div className="tags-list">
                    {result.type === "SCALPER" && (
                      <>
                        <Tag>Vàng (XAUUSD)</Tag>
                        <Tag>EURUSD</Tag>
                        <Tag>Indices (US30)</Tag>
                      </>
                    )}
                    {result.type === "DAY_TRADER" && (
                      <>
                        <Tag>GBPUSD</Tag>
                        <Tag>USDJPY</Tag>
                        <Tag>Crude Oil</Tag>
                      </>
                    )}
                    {result.type === "SWING_TRADER" && (
                      <>
                        <Tag>AUDUSD</Tag>
                        <Tag>Forex Crosses</Tag>
                        <Tag>Stocks</Tag>
                      </>
                    )}
                    {result.type === "POSITION_TRADER" && (
                      <>
                        <Tag>ETF</Tag>
                        <Tag>Blue Chip Stocks</Tag>
                        <Tag>Physical Gold</Tag>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              <Button
                type="primary"
                size="large"
                block
                icon={<ReloadOutlined />}
                onClick={handleRetake}
                className="btn-retake"
              >
                Làm lại bài test
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  return (
    <div className="trader-dna-container">
      {!started && !finished && renderIntro()}
      {started && !finished && !loadingResult && renderQuiz()}
      {loadingResult && renderLoading()}
      {finished && renderResult()}
    </div>
  );
};

// Helper Icons
const UserOutlinedIcon = () => (
  <span role="img" aria-label="user" className="anticon anticon-user">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="user"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
    </svg>
  </span>
);
const BulbOutlinedIcon = () => (
  <span role="img" aria-label="bulb" className="anticon anticon-bulb">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="bulb"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M632 888H392c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h240c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm0 594h-85.5c-4.2 0-7.6-3.4-7.6-7.6V602c0-4.2 3.4-7.6 7.6-7.6h171c4.2 0 7.6 3.4 7.6 7.6v48.4c0 4.2-3.4 7.6-7.6 7.6H512z"></path>
    </svg>
  </span>
);

export default TraderDNAComponent;
