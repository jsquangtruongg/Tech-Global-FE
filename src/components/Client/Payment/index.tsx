import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../../api/config";

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<null | "success" | "cancel">(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<
    null | "PENDING" | "PAID" | "CANCELED"
  >(null);
  const [polling, setPolling] = useState(false);
  useEffect(() => {
    if (location.pathname.includes("/payment/success")) {
      setResult("success");
    } else if (location.pathname.includes("/payment/cancel")) {
      setResult("cancel");
    } else {
      setResult(null);
    }
    const params = new URLSearchParams(location.search);
    const code = params.get("orderCode");
    setOrderCode(code);
  }, [location]);

  useEffect(() => {
    let timer: any;
    const poll = async () => {
      if (!orderCode || result !== "success") return;
      try {
        setPolling(true);
        const res = await API.get(`/payment/status/${orderCode}`);
        const payload = res.data;
        if (payload?.err === 0 && payload?.data) {
          const status = payload.data.status as "PENDING" | "PAID" | "CANCELED";
          setOrderStatus(status);
          if (status === "PAID") {
            setPolling(false);
            message.success("Đơn hàng đã được xác nhận thanh toán");
            return;
          }
        }
      } catch {}
      timer = setTimeout(poll, 5000);
    };
    poll();
    return () => {
      setPolling(false);
      if (timer) clearTimeout(timer);
    };
  }, [orderCode, result]);
  const course = useMemo(
    () => ({
      title: "Master Price Action từ A-Z",
      level: "Pro",
      lessons: 42,
      duration: "8h 30m",
      rating: 4.8,
      price: 999000,
    }),
    [],
  );
  type PaymentKey = "bank" | "qr" | "card" | "cash";
  const [payment, setPayment] = useState<PaymentKey>("qr");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const banks = useMemo(
    () => [
      "Vietcombank",
      "BIDV",
      "Agribank",
      "VietinBank",
      "Techcombank",
      "VPBank",
      "Sacombank",
      "TPBank",
      "MB",
      "VIB",
      "Eximbank",
      "SHB",
      "MSB",
      "HDBank",
      "SeaBank",
      "ABBANK",
      "BAC A BANK",
      "NAM A BANK",
      "NCB",
      "PVcomBank",
      "SCB",
      "BVBank",
      "VIET A BANK",
      "ACB",
      "Shinhan Bank",
      "OCB",
      "LPBank",
      "KienlongBank",
      "PGBank",
      "Woori Bank",
      "Saigonbank",
      "BAOVIET Bank",
      "IVB",
      "UOB",
      "VRB",
      "GPBank",
      "Public Bank",
      "VietBank",
      "VietCredit",
    ],
    [],
  );
  const [bankQuery, setBankQuery] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const filteredBanks = useMemo(() => {
    const q = bankQuery.toLowerCase().trim();
    return q ? banks.filter((b) => b.toLowerCase().includes(q)) : banks;
  }, [bankQuery, banks]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  const canPay =
    !!selectedBank && !!cardNumber && !!cardExpiry && !!cardName && agreePolicy;

  const handleBack = () => {
    navigate("/register-study");
  };
  const handleConfirm = () => {
    setError(null);
    if (payment === "card") {
      if (!selectedBank || !cardNumber || !cardExpiry || !cardName) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
      }
      if (!agreePolicy) {
        setError("Vui lòng đồng ý với chính sách bảo vệ dữ liệu.");
        return;
      }
    }
    setIsConfirmed(true);
  };

  if (result) {
    return (
      <div className="payment">
        <div className="pay-header">
          <h1 className="pay-title">
            {result === "success"
              ? "Thanh toán thành công"
              : "Thanh toán đã hủy"}
          </h1>
          {orderCode && <p className="pay-desc">Mã đơn hàng: {orderCode}</p>}
        </div>
        <div className="pay-body">
          <div className="pay-right" style={{ width: "100%" }}>
            <div className="bill-card" style={{ textAlign: "center" }}>
              <CheckCircleOutlineIcon className="bill-icon" />
              <div style={{ marginTop: 16 }}>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/course")}
                >
                  Về trang khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="payment">
      <div className="pay-header">
        <button className="btn-outline back-btn" onClick={handleBack}>
          <ArrowBackIcon className="btn-icon" /> Trở lại đăng ký
        </button>
        <h1 className="pay-title">Thanh toán</h1>
        <p className="pay-desc">
          Chọn phương thức và xác nhận thanh toán cho khóa học.
        </p>
      </div>
      <div className="pay-body">
        <div className="pay-left">
          <div className="order-summary">
            <h3 className="summary-title">{course.title}</h3>
            <div className="summary-stats">
              <div className="stat">
                <PlayCircleOutlineIcon className="stat-icon" />
                <span>{course.lessons} bài giảng</span>
              </div>
              <div className="stat">
                <ScheduleIcon className="stat-icon" />
                <span>{course.duration}</span>
              </div>
              <div className="stat">
                <StarIcon className="stat-icon" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div className="badge-level">{course.level}</div>
            </div>
          </div>

          <div className="method-card">
            <h3 className="section-title">Phương thức thanh toán</h3>
            <div className="method-grid">
              <button
                className={`pm ${payment === "bank" ? "active" : ""}`}
                onClick={() => setPayment("bank")}
              >
                <AccountBalanceIcon className="pm-icon" />
                Chuyển khoản
              </button>
              <button
                className={`pm ${payment === "qr" ? "active" : ""}`}
                onClick={() => setPayment("qr")}
              >
                <QrCode2Icon className="pm-icon" />
                QR Code
              </button>
              <button
                className={`pm ${payment === "card" ? "active" : ""}`}
                onClick={() => setPayment("card")}
              >
                <CreditCardIcon className="pm-icon" />
                Thẻ
              </button>
              <button
                className={`pm ${payment === "cash" ? "active" : ""}`}
                onClick={() => setPayment("cash")}
              >
                <LocalAtmIcon className="pm-icon" />
                Tiền mặt
              </button>
            </div>

            {payment === "qr" && (
              <div className="qr-box">
                <div className="qr-thumb">
                  <QrCode2Icon className="qr-icon" />
                </div>
                <div className="qr-desc">
                  Quét mã QR bằng ứng dụng ngân hàng để thanh toán.
                </div>
              </div>
            )}

            {payment === "bank" && (
              <div className="bank-box">
                <div className="bank-row">
                  <span className="bank-label">Ngân hàng</span>
                  <span className="bank-value">TechBank</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Tên tài khoản</span>
                  <span className="bank-value">TECH GLOBAL CO., LTD</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Số tài khoản</span>
                  <span className="bank-value">1234 5678 9012</span>
                </div>
                <div className="bank-row">
                  <span className="bank-label">Nội dung</span>
                  <span className="bank-value">TT {course.title}</span>
                </div>
              </div>
            )}

            {payment === "card" && (
              <div className="atm-select">
                <div className="atm-head">
                  <div className="atm-radio">
                    <input type="radio" checked readOnly />
                    <span>Thẻ ATM / Tài khoản ngân hàng</span>
                  </div>
                  <span className="pill">ATM</span>
                </div>
                {!selectedBank ? (
                  <>
                    <div className="atm-search">
                      <input
                        value={bankQuery}
                        onChange={(e) => setBankQuery(e.target.value)}
                        placeholder="Tìm kiếm ngân hàng"
                      />
                    </div>
                    <div className="bank-grid">
                      {filteredBanks.map((b) => (
                        <button
                          key={b}
                          className={`bank-item ${
                            selectedBank === b ? "active" : ""
                          }`}
                          onClick={() => setSelectedBank(b)}
                        >
                          <span className="bank-name">{b}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="atm-detail">
                    <div className="atm-detail-head">
                      <div className="atm-title">
                        Thanh toán qua {selectedBank}
                      </div>
                      <div className="atm-actions">
                        <button
                          className="btn-outline small"
                          onClick={() => setSelectedBank(null)}
                        >
                          Thay đổi ngân hàng
                        </button>
                      </div>
                    </div>
                    <div className="atm-fields">
                      <div className="form-field full">
                        <label>Số thẻ</label>
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="9704 1234 5678 9123 012"
                        />
                      </div>
                      <div className="form-field">
                        <label>Tháng/Năm phát hành</label>
                        <input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/18"
                        />
                      </div>
                      <div className="form-field">
                        <label>Tên chủ thẻ (không dấu)</label>
                        <input
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                    <div className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={agreePolicy}
                        onChange={(e) => setAgreePolicy(e.target.checked)}
                      />
                      <span>
                        Tôi đã đọc, hiểu rõ và đồng ý với{" "}
                        <a href="#">
                          Chính sách bảo vệ và xử lý dữ liệu cá nhân
                        </a>
                      </span>
                    </div>
                    <div className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                      />
                      <span>Lưu thông tin cho lần thanh toán sau</span>
                    </div>
                    <div className="atm-note">
                      Điều kiện thanh toán: Đăng ký dịch vụ ngân hàng số và số
                      điện thoại nhận OTP cho thẻ ghi nợ nội địa {selectedBank}.
                    </div>
                    <div className="atm-footer">
                      <a className="atm-guide" href="#">
                        Hướng dẫn
                      </a>
                      <button
                        className="btn-primary"
                        disabled={!canPay}
                        onClick={handleConfirm}
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="pay-right">
          <div className="bill-card">
            <div className="bill-row">
              <span className="bill-label">Khóa học</span>
              <span className="bill-value">{course.title}</span>
            </div>
            <div className="bill-row">
              <span className="bill-label">Gói</span>
              <span className="bill-value">{course.level}</span>
            </div>
            <div className="bill-total">
              <span className="bill-label">Tổng thanh toán</span>
              <span className="bill-value highlight">
                {course.price.toLocaleString("vi-VN")}đ
              </span>
            </div>
            {error && <div className="bill-error">{error}</div>}
            {isConfirmed ? (
              <div className="success-box">
                <CheckCircleOutlineIcon className="success-icon" />
                <div className="success-text">
                  Thanh toán đã xác nhận. Chúc bạn học tốt!
                </div>
                <button
                  className="btn-outline full"
                  onClick={() => navigate("/course")}
                >
                  Về trang khóa học
                </button>
              </div>
            ) : (
              <button className="btn-primary buy" onClick={handleConfirm}>
                Xác nhận thanh toán
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentComponent;
