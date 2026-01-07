import "./style.scss";
import { useMemo, useState } from "react";
import {
  Card,
  Button,
  Tag,
  Row,
  Col,
  Segmented,
  Radio,
  Space,
  Rate,
  Select,
} from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Market = "crypto" | "gold";
type Plan = "monthly" | "yearly";
type Category = "trend" | "mean" | "breakout" | "swing";

interface BotItem {
  id: string;
  market: Market;
  category: Category;
  name: string;
  subtitle: string;
  image: string;
  roi: string;
  drawdown: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  rating: number;
}

const BOT_ITEMS: BotItem[] = [
  {
    id: "bot-crypto-alpha",
    market: "crypto",
    category: "trend",
    name: "Crypto Alpha",
    subtitle: "Trend Following · Multi-timeframe",
    image:
      "https://assets.bitstamp.net/msc/_ipx/w_2160&f_/bitstampImageUrl/What_are_crypto_trading_bots_svg_c1d90fda1e_da43668085.svg",
    roi: "+32% 6 tháng",
    drawdown: "DD tối đa 8%",
    features: ["Theo xu hướng", "Quản trị rủi ro động", "Tối ưu phí giao dịch"],
    monthlyPrice: 59,
    yearlyPrice: 599,
    rating: 4.6,
  },
  {
    id: "bot-crypto-quant",
    market: "crypto",
    category: "mean",
    name: "Crypto Quant",
    subtitle: "Mean Reversion · Volatility Filter",
    image:
      "https://www.solulab.com/wp-content/uploads/2024/10/How-to-Create-Crypto-Trading-Bot.jpg",
    roi: "+18% 6 tháng",
    drawdown: "DD tối đa 6%",
    features: ["Mean reversion", "Lọc biến động", "Tự động scale-out"],
    monthlyPrice: 49,
    yearlyPrice: 499,
    rating: 4.4,
  },

  {
    id: "bot-gold-shield",
    market: "gold",
    category: "swing",
    name: "Gold Shield",
    subtitle: "Swing · Risk Budgeting",
    image:
      "https://gldt.mql5.vn/2025/10/64d368e1c3af7f00018f04c9_-------Martingale-Trading-Bot-Twitter1600-x-900.jpg",
    roi: "+15% 6 tháng",
    drawdown: "DD tối đa 5%",
    features: ["Giữ lệnh swing", "Ngân sách rủi ro", "Trailing stop mượt"],
    monthlyPrice: 55,
    yearlyPrice: 549,
    rating: 4.3,
  },
  {
    id: "bot-crypto-breakout",
    market: "crypto",
    category: "breakout",
    name: "Crypto Breakout",
    subtitle: "Breakout · Liquidity Maps",
    image:
      "https://www.ccn.com/wp-content/uploads/2023/07/Best-10-Crypto-Trading-Bots-For-2023.webp",
    roi: "+22% 6 tháng",
    drawdown: "DD tối đa 7%",
    features: ["Đánh breakout", "Bản đồ thanh khoản", "Retest xác nhận"],
    monthlyPrice: 65,
    yearlyPrice: 649,
    rating: 4.5,
  },
  {
    id: "bot-crypto-swing",
    market: "crypto",
    category: "swing",
    name: "Crypto Swing",
    subtitle: "Swing · Position Sizing",
    image:
      "https://lh7-rt.googleusercontent.com/docsz/AD_4nXfoSAZGgYaxr_J_XxhhftkmIyaJCLY67iKV5Yk2pCTlD-eU1TBpMcDPgJXpILrkSW5STtZgs6fljrGc8qz3NhquxYkhKHo9Aka6TwZf52XAbLb2rok9KEZawi9ZUS56GR4GSAEo?key=_7PXnWmaMjXtTPMUE0bT3JfD",
    roi: "+17% 6 tháng",
    drawdown: "DD tối đa 6%",
    features: ["Giữ lệnh dài", "Quy mô vị thế", "TP theo HTF"],
    monthlyPrice: 52,
    yearlyPrice: 529,
    rating: 4.2,
  },
  {
    id: "bot-gold-mean",
    market: "gold",
    category: "mean",
    name: "Gold Mean",
    subtitle: "Mean Reversion · Range Bound",
    image: "https://rockwellsoftech.com/wp-content/uploads/2025/01/ai-bot.jpeg",
    roi: "+14% 6 tháng",
    drawdown: "DD tối đa 5%",
    features: ["Mean reversion", "Phạm vi phiên", "Stop hợp lý"],
    monthlyPrice: 49,
    yearlyPrice: 489,
    rating: 4.1,
  },
  {
    id: "bot-gold-trend",
    market: "gold",
    category: "trend",
    name: "Gold Trend",
    subtitle: "Trend Following · Regime Detect",
    image:
      "https://ai-signals.com/wp-content/uploads/2025/05/AI-Day-Trading-Bots.webp",
    roi: "+20% 6 tháng",
    drawdown: "DD tối đa 7%",
    features: ["Theo xu hướng", "Nhận diện regime", "Trailing theo swing"],
    monthlyPrice: 62,
    yearlyPrice: 619,
    rating: 4.5,
  },
  {
    id: "bot-gold-pro",
    market: "gold",
    category: "breakout",
    name: "Gold Pro",
    subtitle: "Breakout · Session Aware",
    image:
      "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,fl_progressive,q_auto,w_1024/68678875ebf07a001d42841d.jpg",
    roi: "+24% 6 tháng",
    drawdown: "DD tối đa 7%",
    features: ["Breakout phiên Mỹ", "Stop động theo ATR", "Kiểm soát rủi ro"],
    monthlyPrice: 69,
    yearlyPrice: 699,
    rating: 4.7,
  },
];

const BotTradeComponent = () => {
  const navigate = useNavigate();
  const [market, setMarket] = useState<Market>("crypto");
  const [plan, setPlan] = useState<Plan>("monthly");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<
    "popular" | "rating_desc" | "price_asc" | "price_desc"
  >("popular");

  const visibleBots = useMemo(() => {
    let list = BOT_ITEMS.filter((b) => b.market === market);
    if (category !== "all") list = list.filter((b) => b.category === category);
    list = [...list].sort((a, b) => {
      if (sort === "popular") return b.rating - a.rating;
      if (sort === "rating_desc") return b.rating - a.rating;
      if (sort === "price_asc")
        return (
          (plan === "monthly" ? a.monthlyPrice : a.yearlyPrice) -
          (plan === "monthly" ? b.monthlyPrice : b.yearlyPrice)
        );
      if (sort === "price_desc")
        return (
          (plan === "monthly" ? b.monthlyPrice : b.yearlyPrice) -
          (plan === "monthly" ? a.monthlyPrice : a.yearlyPrice)
        );
      return 0;
    });
    return list;
  }, [market, category, sort, plan]);

  const priceOf = (bot: BotItem) =>
    plan === "monthly" ? bot.monthlyPrice : bot.yearlyPrice;

  const handleBuy = (bot: BotItem) => {
    const query = new URLSearchParams({
      product: bot.id,
      plan,
    }).toString();
    navigate(`/payment?${query}`);
  };

  return (
    <div className="bot-trade-wrapper">
      <div className="bot-trade-container">
        <div className="bot-trade-header">
          <div className="bt-header-left">
            <div className="bt-title">Bot Trade Marketplace</div>
            <div className="bt-subtitle">
              Bán bot giao dịch cho thị trường Crypto và Vàng
            </div>
          </div>
          <Space size="large" wrap>
            <Segmented
              options={[
                { label: "Crypto", value: "crypto" },
                { label: "Gold", value: "gold" },
              ]}
              value={market}
              onChange={(v) => setMarket(v as Market)}
            />
            <Segmented
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Trend", value: "trend" },
                { label: "Mean", value: "mean" },
                { label: "Breakout", value: "breakout" },
                { label: "Swing", value: "swing" },
              ]}
              value={category}
              onChange={(v) => setCategory(v as any)}
            />
            <Radio.Group value={plan} onChange={(e) => setPlan(e.target.value)}>
              <Radio.Button value="monthly">Theo tháng</Radio.Button>
              <Radio.Button value="yearly">Theo năm</Radio.Button>
            </Radio.Group>
            <Select
              value={sort}
              style={{ width: 180 }}
              onChange={(v) => setSort(v)}
              options={[
                { label: "Phổ biến", value: "popular" },
                { label: "Đánh giá cao", value: "rating_desc" },
                { label: "Giá thấp → cao", value: "price_asc" },
                { label: "Giá cao → thấp", value: "price_desc" },
              ]}
            />
          </Space>
        </div>
      </div>

      <Row
        gutter={[20, 20]}
        className="bot-card-list"
        style={{ padding: "0px 160px", marginLeft: "0px", marginRight: "0px" }}
      >
        {visibleBots.map((bot) => (
          <Col key={bot.id} xs={24} sm={12} lg={8} xl={8}>
            <Card
              hoverable
              className="bot-card"
              cover={
                <div
                  className="bot-card-cover-bg"
                  style={{ backgroundImage: `url(${bot.image})` }}
                />
              }
            >
              {bot.rating >= 4.5 && <div className="bot-badge">Popular</div>}
              <div className="bot-card-header">
                <div className="bot-card-title">{bot.name}</div>
                <Rate disabled allowHalf value={bot.rating} />
              </div>
              <div className="bot-card-subtitle">{bot.subtitle}</div>
              <Space size="small" className="bot-card-tags">
                <Tag color="green">{bot.roi}</Tag>
                <Tag color="orange">{bot.drawdown}</Tag>
                <Tag color={bot.market === "crypto" ? "blue" : "gold"}>
                  {bot.market === "crypto" ? "Crypto" : "Gold"}
                </Tag>
              </Space>
              <div className="bot-card-features">
                {bot.features.map((f) => (
                  <Tag key={f}>{f}</Tag>
                ))}
              </div>
              <div className="bot-card-price">
                <div className="price-left">
                  <span className="price-value">${priceOf(bot)}</span>
                  <span className="price-unit">
                    {plan === "monthly" ? "/tháng" : "/năm"}
                  </span>
                </div>
                <Space>
                  <Button
                    type="default"
                    icon={<ThunderboltOutlined />}
                    onClick={() =>
                      navigate(
                        `/study?sectionId=${bot.market === "crypto" ? 1 : 8}`
                      )
                    }
                  >
                    Thử với bài tập
                  </Button>
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleBuy(bot)}
                  >
                    Mua ngay
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default BotTradeComponent;
