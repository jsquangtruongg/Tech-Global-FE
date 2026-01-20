import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, Segmented, Select, message } from "antd";
import { InputCommon } from "../../Common/InputCommon";
import { getUserAPI } from "../../../api/user";
import { API } from "../../../api/config";

type Plan = "monthly" | "yearly";

interface BotProduct {
  id: string;
  name: string;
  subtitle: string;
  highlights: string[];
  monthlyPriceUsd: number;
  yearlyPriceUsd: number;
}

const BOT_PRODUCTS: BotProduct[] = [
  {
    id: "bot-gold-pro",
    name: "Gold Pro",
    subtitle: "Breakout · Session Aware",
    highlights: ["Tín hiệu M1–M5", "Không martingale", "Hỗ trợ cài đặt"],
    monthlyPriceUsd: 69,
    yearlyPriceUsd: 699,
  },
  {
    id: "bot-gold-trend",
    name: "Gold Trend",
    subtitle: "Trend Following · Regime Detect",
    highlights: ["Theo xu hướng", "Trailing theo swing", "Bộ lọc nhiễu"],
    monthlyPriceUsd: 62,
    yearlyPriceUsd: 619,
  },
  {
    id: "bot-crypto-alpha",
    name: "Crypto Alpha",
    subtitle: "Trend Following · Multi-timeframe",
    highlights: ["Theo xu hướng", "Quản trị rủi ro", "Tối ưu giao dịch"],
    monthlyPriceUsd: 59,
    yearlyPriceUsd: 599,
  },
];

const COUPONS: Record<string, { percent: number; label: string }> = {
  TECH10: { percent: 10, label: "Giảm 10%" },
};

const isValidGmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) &&
  /@gmail\.com$/i.test(value.trim());

const isValidTradingViewUsername = (value: string) =>
  /^[A-Za-z0-9_]{3,30}$/.test(value.trim());

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const BuyBotComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initial = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const productFromUrl = params.get("product") || "";
    const planFromUrl = params.get("plan") as Plan | null;
    const product =
      BOT_PRODUCTS.find((p) => p.id === productFromUrl)?.id ||
      BOT_PRODUCTS[0]?.id ||
      "";
    const plan: Plan = planFromUrl === "yearly" ? "yearly" : "monthly";
    return { product, plan };
  }, [location.search]);

  const [productId, setProductId] = useState<string>(initial.product);
  const [plan, setPlan] = useState<Plan>(initial.plan);
  const [email, setEmail] = useState("");
  const [tradingViewUsername, setTradingViewUsername] = useState("");
  const [coupon, setCoupon] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [paying, setPaying] = useState(false);

  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [messageErrorEmail, setMessageErrorEmail] = useState("");
  const [isErrorTv, setIsErrorTv] = useState(false);
  const [messageErrorTv, setMessageErrorTv] = useState("");
  const [isErrorCoupon, setIsErrorCoupon] = useState(false);
  const [messageErrorCoupon, setMessageErrorCoupon] = useState("");
  const [isErrorAgreed, setIsErrorAgreed] = useState(false);

  useEffect(() => {
    const fillUser = async () => {
      try {
        const userRes = await getUserAPI();
        if (userRes.err === 0 && userRes.userData) {
          setEmail(userRes.userData.email || "");
        }
      } catch {}
    };
    fillUser();
  }, []);

  useEffect(() => {
    setProductId(initial.product);
    setPlan(initial.plan);
  }, [initial.product, initial.plan]);

  const selectedProduct = useMemo(
    () => BOT_PRODUCTS.find((p) => p.id === productId) || BOT_PRODUCTS[0],
    [productId]
  );

  const couponKey = coupon.trim().toUpperCase();
  const couponMeta = couponKey ? COUPONS[couponKey] : undefined;
  const couponValid = Boolean(couponMeta);

  const basePrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return plan === "monthly"
      ? selectedProduct.monthlyPriceUsd
      : selectedProduct.yearlyPriceUsd;
  }, [plan, selectedProduct]);

  const discountPercent = couponValid ? couponMeta?.percent || 0 : 0;

  const total = useMemo(() => {
    const afterDiscount = basePrice * (1 - discountPercent / 100);
    return Number(afterDiscount.toFixed(2));
  }, [basePrice, discountPercent]);

  const validateEmail = (value: string) => {
    if (value.trim() === "") {
      setIsErrorEmail(true);
      setMessageErrorEmail("Email không được để trống");
      return false;
    }
    if (!isValidGmail(value)) {
      setIsErrorEmail(true);
      setMessageErrorEmail("Email phải là Gmail hợp lệ");
      return false;
    }
    setIsErrorEmail(false);
    setMessageErrorEmail("");
    return true;
  };

  const validateTv = (value: string) => {
    if (value.trim() === "") {
      setIsErrorTv(true);
      setMessageErrorTv("Tên tài khoản TradingView không được để trống");
      return false;
    }
    if (!isValidTradingViewUsername(value)) {
      setIsErrorTv(true);
      setMessageErrorTv("Chỉ gồm chữ/số/_ và dài 3–30 ký tự");
      return false;
    }
    setIsErrorTv(false);
    setMessageErrorTv("");
    return true;
  };

  const validateCoupon = (value: string) => {
    const key = value.trim().toUpperCase();
    if (key === "") {
      setIsErrorCoupon(false);
      setMessageErrorCoupon("");
      return true;
    }
    const ok = Boolean(COUPONS[key]);
    if (!ok) {
      setIsErrorCoupon(true);
      setMessageErrorCoupon("Mã giảm giá không tồn tại");
      return false;
    }
    setIsErrorCoupon(false);
    setMessageErrorCoupon(`Áp dụng ${COUPONS[key].label}`);
    return true;
  };

  const handleCheckPrice = async () => {
    setCheckingPrice(true);
    const okCoupon = validateCoupon(coupon);
    await new Promise((r) => setTimeout(r, 350));
    setCheckingPrice(false);

    if (!okCoupon) {
      message.error("Mã giảm giá không hợp lệ");
      return;
    }

    message.success(
      `Giá hiện tại: ${formatUsd(total)} ${
        plan === "monthly" ? "/tháng" : "/năm"
      }`
    );
  };

  const handleSubmit = async () => {
    const okEmail = validateEmail(email);
    const okTv = validateTv(tradingViewUsername);
    const okCoupon = validateCoupon(coupon);
    const okAgreed = agreed;
    setIsErrorAgreed(!okAgreed);

    if (!okEmail || !okTv || !okCoupon || !okAgreed) {
      message.error("Vui lòng kiểm tra lại thông tin trước khi thanh toán");
      return;
    }

    try {
      setPaying(true);
      const res = await API.post("/payment/create-bot-link", {
        productId: selectedProduct?.id || "",
        plan,
        email: email.trim(),
        tradingViewUsername: tradingViewUsername.trim(),
        couponCode: couponValid ? coupon.trim() : undefined,
      });
      const payload = res.data;
      if (payload?.err === 0) {
        const url = payload?.data?.checkoutUrl;
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          return;
        }
      }
      message.error(payload?.mess || "Không tạo được link thanh toán");
    } catch (e: any) {
      message.error("Không tạo được link thanh toán");
      navigate("/payment");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="buy-bot">
      <div className="bb-header">
        <div className="bb-title">Mua bot</div>
        <div className="bb-subtitle">
          Nhập thông tin để kích hoạt bot cho TradingView của bạn.
        </div>
      </div>

      <div className="bb-body">
        <div className="bb-left">
          <div className="bb-section bb-product">
            <div className="bb-section-title">Chọn gói bot</div>
            <div className="bb-product-row">
              <div className="bb-product-col">
                <div className="bb-label">Sản phẩm</div>
                <Select
                  value={productId}
                  onChange={(v) => setProductId(v)}
                  className="bb-select"
                  options={BOT_PRODUCTS.map((p) => ({
                    label: `${p.name} — ${p.subtitle}`,
                    value: p.id,
                  }))}
                />
              </div>
              <div className="bb-product-col">
                <div className="bb-label">Chu kỳ</div>
                <Segmented
                  value={plan}
                  onChange={(v) => setPlan(v as Plan)}
                  options={[
                    { label: "Theo tháng", value: "monthly" },
                    { label: "Theo năm", value: "yearly" },
                  ]}
                />
              </div>
            </div>

            <div className="bb-highlights">
              {selectedProduct?.highlights?.map((h) => (
                <div key={h} className="bb-highlight">
                  {h}
                </div>
              ))}
            </div>
          </div>

          <div className="bb-section bb-form">
            <div className="bb-section-title">Thông tin kích hoạt</div>
            <div className="bb-form-row">
              <InputCommon
                label="Gmail"
                type="email"
                id="bb-email"
                name="email"
                required
                isError={isErrorEmail}
                messageError={messageErrorEmail}
                onBlur={(e) => validateEmail(e.target.value)}
                style={{ width: "100%" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
              <InputCommon
                label="Tên tài khoản TradingView"
                type="text"
                id="bb-tv"
                name="tradingView"
                required
                isError={isErrorTv}
                messageError={messageErrorTv}
                onBlur={(e) => validateTv(e.target.value)}
                style={{ width: "100%" }}
                value={tradingViewUsername}
                onChange={(e) => setTradingViewUsername(e.target.value)}
                placeholder="vd: tech_global"
              />
            </div>

            <div className="bb-form-row">
              <div className="bb-coupon-col">
                <InputCommon
                  label="Mã giảm giá"
                  type="text"
                  id="bb-coupon"
                  name="coupon"
                  isError={isErrorCoupon}
                  messageError={messageErrorCoupon}
                  onBlur={(e) => validateCoupon(e.target.value)}
                  style={{ width: "100%" }}
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Nhập mã (ví dụ: TECH10)"
                />
                {couponValid && couponKey !== "" && !isErrorCoupon && (
                  <div className="bb-coupon-ok">
                    Đã áp dụng {couponKey} (−{discountPercent}%)
                  </div>
                )}
              </div>
              <div className="bb-check-price">
                <div className="bb-label">Kiểm tra giá</div>
                <Button
                  type="default"
                  onClick={handleCheckPrice}
                  loading={checkingPrice}
                  className="bb-btn-check"
                >
                  Kiểm tra
                </Button>
              </div>
            </div>

            <div className={`bb-agree ${isErrorAgreed ? "error" : ""}`}>
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              >
                Tôi đồng ý với điều khoản dịch vụ và chính sách hỗ trợ.
              </Checkbox>
              {isErrorAgreed && (
                <div className="bb-agree-error">
                  Vui lòng đồng ý điều khoản để tiếp tục.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bb-right">
          <div className="bb-summary">
            <div className="bb-summary-title">Tóm tắt đơn hàng</div>
            <div className="bb-row">
              <span className="bb-row-label">Sản phẩm</span>
              <span className="bb-row-value">
                {selectedProduct?.name || "-"}
              </span>
            </div>
            <div className="bb-row">
              <span className="bb-row-label">Chu kỳ</span>
              <span className="bb-row-value">
                {plan === "monthly" ? "Theo tháng" : "Theo năm"}
              </span>
            </div>
            <div className="bb-row">
              <span className="bb-row-label">Giá</span>
              <span className="bb-row-value">
                {formatUsd(basePrice)}{" "}
                <span className="bb-muted">
                  {plan === "monthly" ? "/tháng" : "/năm"}
                </span>
              </span>
            </div>
            <div className="bb-row">
              <span className="bb-row-label">Giảm giá</span>
              <span className="bb-row-value">
                {couponValid ? `${discountPercent}%` : "0%"}
              </span>
            </div>
            <div className="bb-total">
              <span className="bb-row-label">Tổng thanh toán</span>
              <span className="bb-total-value">{formatUsd(total)}</span>
            </div>

            <div className="bb-note">
              Kích hoạt sẽ được gửi về Gmail và áp dụng cho đúng tên tài khoản
              TradingView.
            </div>

            <Button
              type="primary"
              className="bb-pay"
              onClick={handleSubmit}
              loading={paying}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyBotComponent;
