import "./style.scss";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Space,
  Button,
  Empty,
  Image,
} from "antd";
import ImgExampleTrue from "../../../assets/images/F4ln8b8T_mid.png";
import ImgExampleFalse from "../../../assets/images/s3Bp9oE0-637511160372186596.png";

const { Title, Paragraph, Text } = Typography;

type Level = "BASIC" | "ADVANCED";

type Detail = {
  id: string;
  title: string;
  summary: string;
  level: Level;
  tags: string[];
  purpose: string;
  quick: string[];
  shouldDo: string[];
  shouldNotDo: string[];
  trueExamples: { title: string; desc: string }[];
  falseExamples: { title: string; desc: string }[];
  related?: string[];
};

const DETAILS: Detail[] = [
  {
    id: "price-action",
    title: "Price Action",
    summary:
      "Đọc hành động giá để xác định xu hướng, vùng phản ứng và xác suất vào lệnh.",
    level: "BASIC",
    tags: ["Quan trọng", "Bắt buộc phải biết"],
    purpose:
      "Giúp trader hiểu bản chất di chuyển của giá, không phụ thuộc vào chỉ báo đơn lẻ.",
    quick: [
      "Xác định xu hướng chính và vùng S/R",
      "Tìm tín hiệu nến tại vị trí hợp lệ",
      "Kết hợp RR và quản lý vốn",
    ],
    shouldDo: ["Đợi tín hiệu đủ điều kiện", "Xác nhận vị trí S/R", "Theo plan"],
    shouldNotDo: ["Bắt đỉnh/đáy", "Trade giữa vùng không rõ ràng", "All-in"],
    trueExamples: [
      {
        title: "Pin Bar tại vùng kháng cự mạnh",
        desc: "Xuất hiện sau nhịp tăng, bóng dài từ chối giá ở vùng kháng cự, vào lệnh theo hướng giảm với SL phía trên đỉnh nến.",
      },
      {
        title: "Inside Bar theo xu hướng",
        desc: "Trong xu hướng tăng rõ ràng, inside bar tích lũy gần hỗ trợ động, phá vỡ lên cùng hướng xu hướng.",
      },
    ],
    falseExamples: [
      {
        title: "Tín hiệu nến giữa vùng",
        desc: "Xuất hiện ở vùng giá không có ý nghĩa, không có S/R, xác suất thấp.",
      },
      {
        title: "Trade ngược xu hướng mạnh",
        desc: "Vào lệnh ngược lại khi chưa có tín hiệu đảo chiều đủ mạnh và vị trí hợp lệ.",
      },
    ],
    related: ["Pin Bar", "Inside Bar", "Supply/Demand"],
  },
  {
    id: "trend-following",
    title: "Trend Following",
    summary:
      "Đi theo xu hướng chính, bỏ qua nhiễu nhỏ để tối ưu tỷ lệ rủi ro/lợi nhuận.",
    level: "BASIC",
    tags: ["Quan trọng"],
    purpose:
      "Khai thác xác suất cao khi thị trường có xu hướng rõ ràng, giảm quyết định cảm tính.",
    quick: [
      "Nhận diện Higher High/Higher Low hoặc Lower High/Lower Low",
      "Dùng hỗ trợ/kháng cự động như EMA",
      "Không bắt đỉnh/đáy",
    ],
    shouldDo: ["Đi theo hướng trend", "Vào ở nhịp hồi", "Giữ kỷ luật RR"],
    shouldNotDo: [
      "Chống lại trend",
      "Vào lệnh liên tục không có setup",
      "Dời SL cảm tính",
    ],
    trueExamples: [
      {
        title: "Mua ở nhịp hồi về EMA20 trong xu hướng tăng",
        desc: "Giá hồi quy về vùng hỗ trợ động, xuất hiện nến xác nhận tăng, vào lệnh theo xu hướng.",
      },
      {
        title: "Bán khi phá vỡ hỗ trợ trong xu hướng giảm",
        desc: "Giá tạo Lower High liên tục, phá vỡ hỗ trợ quan trọng, vào lệnh theo hướng giảm.",
      },
    ],
    falseExamples: [
      {
        title: "Bắt đỉnh trong xu hướng tăng mạnh",
        desc: "Vào lệnh ngược xu hướng khi chưa có cấu trúc đảo chiều hợp lệ.",
      },
      {
        title: "Mua giữa sideway rộng",
        desc: "Không có xu hướng rõ ràng, setup thiếu lợi thế.",
      },
    ],
    related: ["EMA", "MACD", "Market Structure"],
  },
  {
    id: "fomo",
    title: "FOMO",
    summary: "Nỗi sợ bỏ lỡ khiến vào lệnh không theo kế hoạch.",
    level: "BASIC",
    tags: ["Dễ sai"],
    purpose: "Nhận diện và kiểm soát cảm xúc để giữ kỷ luật giao dịch.",
    quick: [
      "Xác định dấu hiệu FOMO cá nhân",
      "Tuân thủ checklist vào lệnh",
      "Giới hạn số lệnh/ngày",
    ],
    shouldDo: ["Chờ setup đủ điều kiện", "Theo checklist", "Ghi chép cảm xúc"],
    shouldNotDo: [
      "Nhảy vào vì sợ lỡ",
      "Tăng khối lượng vô lý",
      "Phá plan sau chuỗi thua",
    ],
    trueExamples: [
      {
        title: "Bỏ qua tín hiệu yếu sau biến động mạnh",
        desc: "Giữ kỷ luật chờ setup rõ ràng thay vì vào lệnh vì sợ giá chạy tiếp.",
      },
      {
        title: "Dừng giao dịch sau 3 lệnh thua",
        desc: "Giới hạn số lệnh/ngày để tránh revenge trade.",
      },
    ],
    falseExamples: [
      {
        title: "Mua khi giá đang tăng dựng đứng",
        desc: "Vào lệnh do cảm xúc sợ lỡ sóng mà không có điểm vào hợp lệ.",
      },
      {
        title: "Tăng khối lượng để gỡ lỗ",
        desc: "Hành vi phá kỷ luật làm gia tăng rủi ro tài khoản.",
      },
    ],
    related: ["Checklist vào lệnh", "Nhật ký cảm xúc"],
  },
  {
    id: "risk-per-trade",
    title: "Risk % mỗi lệnh",
    summary: "Xác định tỷ lệ rủi ro cố định cho mỗi giao dịch.",
    level: "BASIC",
    tags: ["Quan trọng"],
    purpose: "Bảo vệ tài khoản và duy trì khả năng tồn tại dài hạn.",
    quick: ["Giới hạn 0.5–2%/lệnh", "Luôn đặt SL", "Tính RR trước khi vào"],
    shouldDo: ["Tính khối lượng theo SL", "Giữ RR tối thiểu", "Nhật ký rủi ro"],
    shouldNotDo: ["All-in", "Không đặt SL", "Dời SL vô lý"],
    trueExamples: [
      {
        title: "Rủi ro cố định 1%/lệnh",
        desc: "Tính khối lượng dựa trên khoảng cách SL để rủi ro bằng 1% tài khoản.",
      },
      {
        title: "Chỉ vào lệnh RR ≥ 1:2",
        desc: "Giữ tiêu chuẩn tối thiểu để tối ưu kỳ vọng.",
      },
    ],
    falseExamples: [
      {
        title: "Vào lệnh không SL",
        desc: "Không quản trị rủi ro, có thể gây mất kiểm soát tài khoản.",
      },
      {
        title: "Tăng khối lượng khi thua",
        desc: "Phá kỷ luật làm drawdown trầm trọng hơn.",
      },
    ],
    related: ["RR", "Drawdown", "Position sizing"],
  },
  {
    id: "pin-bar",
    title: "Pin Bar",
    summary: "Nến bóng dài cho thấy sự từ chối giá mạnh ở vùng S/R.",
    level: "BASIC",
    tags: ["Quan trọng"],
    purpose: "Nhận diện tín hiệu từ chối giá tại vùng ý nghĩa.",
    quick: ["Vị trí S/R rõ ràng", "Bóng dài nổi bật", "Xác nhận thêm"],
    shouldDo: [
      "Chờ tại vùng S/R",
      "Đặt SL sau đỉnh/đáy nến",
      "Xác nhận bằng cấu trúc",
    ],
    shouldNotDo: [
      "Dùng giữa vùng",
      "Bỏ qua vị trí",
      "Vào lệnh khi thiếu xác nhận",
    ],
    trueExamples: [
      {
        title: "Pin Bar giảm tại kháng cự",
        desc: "Xuất hiện sau nhịp hồi về kháng cự, bóng trên dài, vào lệnh theo hướng giảm.",
      },
      {
        title: "Pin Bar tăng tại hỗ trợ",
        desc: "Xuất hiện tại hỗ trợ mạnh, bóng dưới dài, xác nhận bằng cấu trúc tăng.",
      },
    ],
    falseExamples: [
      {
        title: "Pin Bar giữa vùng không ý nghĩa",
        desc: "Không có S/R, tín hiệu thiếu giá trị thống kê.",
      },
      {
        title: "Pin Bar nhỏ trong sideway nhiễu",
        desc: "Kích thước nhỏ, vị trí xấu, không đáng tin cậy.",
      },
    ],
    related: ["Supply/Demand", "Price Action"],
  },
  {
    id: "ema",
    title: "EMA",
    summary:
      "Đường trung bình động nhấn mạnh giá gần đây, hỗ trợ xác định xu hướng.",
    level: "BASIC",
    tags: ["Quan trọng"],
    purpose: "Làm hỗ trợ/kháng cự động để bám xu hướng.",
    quick: ["Kết hợp Price Action", "Không dùng độc lập", "20/50/200 phổ biến"],
    shouldDo: [
      "Dùng EMA bám trend",
      "Kết hợp cấu trúc giá",
      "Kiểm tra đa khung",
    ],
    shouldNotDo: ["Dùng một mình", "Vào lệnh khi nhiễu", "Bỏ qua vị trí"],
    trueExamples: [
      {
        title: "Nhịp hồi về EMA20 trong xu hướng tăng",
        desc: "Giá bám EMA, hồi quy chạm đường, có tín hiệu xác nhận tăng.",
      },
      {
        title: "Giao dịch theo EMA200 khung lớn",
        desc: "Dùng EMA200 làm xu hướng dài hạn, kết hợp tín hiệu khung nhỏ.",
      },
    ],
    falseExamples: [
      {
        title: "Cắt EMA liên tục trong sideway",
        desc: "Nhiễu làm tín hiệu kém chất lượng, không lợi thế.",
      },
      {
        title: "Dùng EMA để quyết định mọi thứ",
        desc: "Thiếu bối cảnh cấu trúc và vị trí thị trường.",
      },
    ],
    related: ["Trend Following", "MACD"],
  },
];

const KnowledgeDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const detail = useMemo(() => {
    if (!id) return null;
    return DETAILS.find((d) => d.id === id) || null;
  }, [id]);

  if (!detail) {
    return (
      <div className="knowledge-detail">
        <Card className="kd-card empty">
          <Empty description="Chưa cập nhật" />
          <Button type="primary" onClick={() => navigate("/library/knowledge")}>
            Quay lại Thư viện
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="knowledge-detail">
      <Card className="kd-card">
        <div className="kd-header">
          <Title level={2}>{detail.title}</Title>
          <Space>
            <Tag color={detail.level === "BASIC" ? "green" : "gold"}>
              {detail.level === "BASIC" ? "Cơ bản" : "Nâng cao"}
            </Tag>
            {detail.tags.map((t) => (
              <Tag
                key={t}
                color={
                  t === "Quan trọng"
                    ? "blue"
                    : t === "Bắt buộc phải biết"
                      ? "red"
                      : "orange"
                }
              >
                {t}
              </Tag>
            ))}
          </Space>
        </div>
        <Paragraph className="kd-summary">{detail.summary}</Paragraph>

        <div className="kd-section">
          <Title level={4}>Mục đích</Title>
          <Paragraph>{detail.purpose}</Paragraph>
        </div>

        <div className="kd-section">
          <Title level={4}>Tóm tắt nhanh</Title>
          <ul className="kd-list">
            {detail.quick.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="kd-section">
              <Title level={4}>Nên làm</Title>
              <ul className="kd-list">
                {detail.shouldDo.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="kd-section">
              <Title level={4}>Không nên làm</Title>
              <ul className="kd-list">
                {detail.shouldNotDo.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>

        <div className="kd-section">
          <Title level={4}>Ví dụ thực tế</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card size="small" title="Ví dụ đúng">
                <Image
                  src={ImgExampleTrue}
                  alt="Ví dụ đúng"
                  preview={false}
                  className="kd-example-image"
                />
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  {detail.trueExamples.map((ex, i) => (
                    <div key={i} className="kd-example">
                      <Text strong>{ex.title}</Text>
                      <Paragraph>{ex.desc}</Paragraph>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Ví dụ sai">
                <Image
                  src={ImgExampleFalse}
                  alt="Ví dụ sai"
                  preview={false}
                  className="kd-example-image"
                />
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  {detail.falseExamples.map((ex, i) => (
                    <div key={i} className="kd-example">
                      <Text strong>{ex.title}</Text>
                      <Paragraph>{ex.desc}</Paragraph>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {detail.related && (
          <div className="kd-section">
            <Title level={4}>Liên kết</Title>
            <Paragraph>{detail.related.join(" • ")}</Paragraph>
          </div>
        )}

        <div className="kd-actions">
          <Space>
            <Button onClick={() => navigate("/study")}>
              Backtest / Thực hành
            </Button>
            <Button disabled>Thêm vào Checklist (Chưa cập nhật)</Button>
            <Button
              type="primary"
              onClick={() => navigate("/library/knowledge")}
            >
              Quay lại Thư viện
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetailComponent;
