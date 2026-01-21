import "./style.scss";
import { useMemo, useState, useEffect } from "react";
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
  message,
  Empty,
} from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getActiveBotProductsAPI,
  type IBotProduct,
} from "../../../api/bot-product";

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
  isPopular?: boolean;
}

const BotTradeComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<BotItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [market, setMarket] = useState<Market>("crypto");
  const [plan, setPlan] = useState<Plan>("monthly");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<
    "popular" | "rating_desc" | "price_asc" | "price_desc"
  >("popular");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getActiveBotProductsAPI();
        if (res.err === 0) {
          // Map API data to BotItem
          const mappedItems: BotItem[] = res.data.map((item: IBotProduct) => {
            // Determine category from subtitle or highlights
            let cat: Category = "trend";
            const textToCheck = (
              (item.subtitle || "") +
              " " +
              (item.name || "")
            ).toLowerCase();
            if (textToCheck.includes("mean")) cat = "mean";
            else if (textToCheck.includes("breakout")) cat = "breakout";
            else if (textToCheck.includes("swing")) cat = "swing";

            // Parse features/highlights
            let feats: string[] = [];
            if (Array.isArray(item.highlights)) {
              feats = item.highlights;
            } else if (typeof item.highlights === "string") {
              try {
                feats = JSON.parse(item.highlights);
              } catch (e) {
                feats = [item.highlights];
              }
            }

            return {
              id: String(item.id),
              market:
                item.asset_type?.toLowerCase() === "gold" ? "gold" : "crypto",
              category: cat,
              name: item.name,
              subtitle: item.subtitle || "",
              image: item.image || "",
              roi: item.profit_display || "",
              drawdown: item.drawdown_display || "",
              features: feats,
              monthlyPrice: item.monthly_usd,
              yearlyPrice: item.yearly_usd,
              rating: item.rating || 5,
              isPopular: item.is_popular,
            };
          });
          setProducts(mappedItems);
        } else {
          message.error(res.mess);
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi tải danh sách bot");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuyBotClick = (bot: BotItem) => {
    const query = new URLSearchParams({
      product: bot.id,
      plan,
    }).toString();
    navigate(`/buy-bot?${query}`);
  };

  const visibleBots = useMemo(() => {
    let list = products.filter((b) => b.market === market);
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
  }, [market, category, sort, plan, products]);

  const priceOf = (bot: BotItem) =>
    plan === "monthly" ? bot.monthlyPrice : bot.yearlyPrice;

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

      <div className="bot-trade-container bot-trade-list">
        {visibleBots.length === 0 ? (
          <div
            style={{ padding: 40, display: "flex", justifyContent: "center" }}
          >
            <Empty
              description={
                category !== "all"
                  ? `Hiện tại chưa có sản phẩm bot ${category}`
                  : "Hiện tại chưa có sản phẩm bot"
              }
            />
          </div>
        ) : (
          <Row gutter={[20, 20]} className="bot-card-list" style={{ margin: "0 auto" }}>
            {visibleBots.map((bot) => (
              <Col key={bot.id} xs={24} sm={12} lg={8} xl={8}>
                <Card
                  hoverable
                  className="bot-card"
                  loading={loading}
                  cover={
                    !loading && (
                      <div
                        className="bot-card-cover-bg"
                        style={{ backgroundImage: `url(${bot.image})` }}
                      />
                    )
                  }
                >
                  {bot.isPopular && <div className="bot-badge">Popular</div>}
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
                    {bot.features.map((f, idx) => (
                      <Tag key={idx}>{f}</Tag>
                    ))}
                  </div>
                  <div className="bot-card-price">
                    <div className="price-left">
                      <span className="price-value">${priceOf(bot)}</span>
                      <span className="price-unit">
                        {plan === "monthly" ? "/tháng" : "/năm"}
                      </span>
                    </div>
                    <Space wrap>
                      <Button
                        type="default"
                        icon={<ThunderboltOutlined />}
                        onClick={() =>
                          navigate(
                            `/study?sectionId=${
                              bot.market === "crypto" ? 1 : 8
                            }`
                          )
                        }
                      >
                        Thử với bài tập
                      </Button>
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleBuyBotClick(bot)}
                      >
                        Mua ngay
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
export default BotTradeComponent;
