import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { InputCommon } from "../../Common/InputCommon";
import { getCourseDetailAPI, type ICourse } from "../../../api/course";
import { getUserAPI } from "../../../api/user";
import { API } from "../../../api/config";

const RegisterStudyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");
  const [isErrorName, setIsErrorName] = useState(false);
  const [messageErrorName, setMessageErrorName] = useState("");
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [messageErrorEmail, setMessageErrorEmail] = useState("");
  const [isErrorPhone, setIsErrorPhone] = useState(false);
  const [messageErrorPhone, setMessageErrorPhone] = useState("");
  const [isErrorCoupon, setIsErrorCoupon] = useState(false);
  const [messageErrorCoupon, setMessageErrorCoupon] = useState("");
  const couponValid = useMemo(
    () => coupon.trim().toLowerCase() === "tech10",
    [coupon],
  );
  const total = useMemo(() => {
    const base = course?.price || 0;
    const percent = course?.discount || 0;
    const afterPercent = Math.round(base * (1 - percent / 100));
    const afterCoupon = couponValid
      ? Math.round(afterPercent * 0.9)
      : afterPercent;
    return afterCoupon;
  }, [course, couponValid]);

  const handleClickPayMent = async () => {
    if (!course?.id) return;
    try {
      const res = await API.post("/payment/create-link", {
        courseId: course.id,
        couponCode: couponValid ? coupon.trim() : undefined,
        discountPercent: couponValid ? 10 : undefined,
      });
      const payload = res.data;
      if (payload?.err === 0) {
        const url = payload?.data?.checkoutUrl;
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
          return;
        }
      }
      message.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại sau.");
    } catch (e) {
      message.error(
        "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại sau.",
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const state: any = location.state || {};
      const courseId = state.courseId;
      if (courseId) {
        const res = await getCourseDetailAPI(courseId);
        if (res.err === 0 && res.data) {
          setCourse(res.data);
        }
      }
      try {
        const userRes = await getUserAPI();
        if (userRes.err === 0 && userRes.userData) {
          setName(userRes.userData.name || "");
          setEmail(userRes.userData.email || "");
          setPhone(userRes.userData.phone || "");
        }
      } catch {}
      setLoading(false);
    };
    loadData();
  }, [location]);

  const validateName = (value: string) => {
    if (value.trim() === "") {
      setIsErrorName(true);
      setMessageErrorName("Họ và tên không được để trống");
    } else {
      setIsErrorName(false);
      setMessageErrorName("");
    }
  };
  const validateEmail = (value: string) => {
    if (value.trim() === "") {
      setIsErrorEmail(true);
      setMessageErrorEmail("Email không được để trống");
    } else {
      setIsErrorEmail(false);
      setMessageErrorEmail("");
    }
  };
  const validatePhone = (value: string) => {
    if (value.trim() === "") {
      setIsErrorPhone(true);
      setMessageErrorPhone("Số điện thoại không được để trống");
    } else {
      setIsErrorPhone(false);
      setMessageErrorPhone("");
    }
  };

  const validateCoupon = (value: string) => {
    if (value.trim() === "") {
      setIsErrorCoupon(false);
      setMessageErrorCoupon("");
      return;
    }
    const valid = value.trim().toLowerCase() === "tech10";
    if (!valid) {
      setIsErrorCoupon(true);
      setMessageErrorCoupon("Mã giảm giá không tồn tại");
    } else {
      setIsErrorCoupon(false);
      setMessageErrorCoupon("");
    }
  };

  return (
    <div className="register-study">
      <div className="rs-header">
        <h1 className="rs-title">Đăng ký học</h1>
        <p className="rs-desc">
          Hoàn tất đăng ký và thanh toán để bắt đầu khóa học ngay hôm nay.
        </p>
      </div>
      <div className="rs-body">
        <div className="rs-left">
          <div className="course-summary">
            <h3 className="summary-title">{course?.title || "Khóa học"}</h3>
            <div className="summary-stats">
              <div className="stat">
                <PlayCircleOutlineIcon className="stat-icon" />
                <span>{course?.lessons_count || 0} bài giảng</span>
              </div>
              <div className="stat">
                <ScheduleIcon className="stat-icon" />
                <span>{course?.duration || "0h"}</span>
              </div>
              <div className="stat">
                <StarIcon className="stat-icon" />
                <span>{(course?.rating || 0).toFixed(1)}</span>
              </div>
              <div className="badge-level">{course?.level || "-"}</div>
            </div>
          </div>

          <div className="plans">
            <div className="plan-card active">
              <div className="badge">Gói học</div>
              <div className="plan-name">{course?.title || "Khóa học"}</div>
              <div className="plan-price">
                {Math.round(
                  (course?.price || 0) *
                    (1 - (course?.discount ? course?.discount : 0) / 100),
                ).toLocaleString("vi-VN")}
                đ
              </div>
              <div className="plan-features">
                <div className="pf">
                  <CheckCircleOutlineIcon className="pf-icon" />
                  Giảm giá {course?.discount || 0}%
                </div>
                <div className="pf">
                  <CheckCircleOutlineIcon className="pf-icon" />
                  Truy cập toàn bộ nội dung khóa học
                </div>
              </div>
            </div>
          </div>

          <div className="form">
            <div className="form-row">
              <InputCommon
                label="Họ và tên"
                type="text"
                id="name"
                name="name"
                required
                isError={isErrorName}
                messageError={messageErrorName}
                onBlur={(e) => validateName(e.target.value)}
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
              />
              <InputCommon
                label="Email"
                type="email"
                id="email"
                name="email"
                required
                isError={isErrorEmail}
                messageError={messageErrorEmail}
                onBlur={(e) => validateEmail(e.target.value)}
                style={{ width: "100%" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
            <div className="form-row">
              <InputCommon
                label="Số điện thoại"
                type="tel"
                id="phone"
                name="phone"
                required
                isError={isErrorPhone}
                messageError={messageErrorPhone}
                onBlur={(e) => validatePhone(e.target.value)}
                style={{ width: "100%" }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
              <InputCommon
                label="Mã giảm giá"
                type="text"
                id="coupon"
                name="coupon"
                isError={isErrorCoupon}
                messageError={messageErrorCoupon}
                onBlur={(e) => validateCoupon(e.target.value)}
                style={{ width: "100%" }}
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Nhập mã (ví dụ: TECH10)"
              />
            </div>
          </div>

          {/* <div className="payment">
            <h3 className="section-title">Phương thức thanh toán</h3>
            <div className="payment-methods">
              <button
                className={`pm ${payment === "bank" ? "active" : ""}`}
                onClick={() => setPayment("bank")}
              >
                <AccountBalanceIcon className="pm-icon" />
                Chuyển khoản ngân hàng
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
                Thẻ tín dụng/ghi nợ
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
                  Quét mã QR bằng app ngân hàng để thanh toán.
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
                  <span className="bank-value">DK {course.title}</span>
                </div>
              </div>
            )}

            {payment === "card" && (
              <div className="card-box">
                <div className="form-row">
                  <div className="form-field">
                    <label>Số thẻ</label>
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Tên chủ thẻ</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="NGUYEN VAN A"
                    />
                  </div>
                  <div className="form-field">
                    <label>Hết hạn</label>
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="form-field">
                    <label>CVV</label>
                    <input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}
          </div> */}
        </div>

        <div className="rs-right">
          <div className="order-card">
            <div className="order-row">
              <span className="order-label">Gói học</span>
              <span className="order-value">{course?.title || "Khóa học"}</span>
            </div>
            <div className="order-row">
              <span className="order-label">Giá</span>
              <span className="order-value">
                {Math.round(
                  (course?.price || 0) *
                    (1 - (course?.discount ? course?.discount : 0) / 100),
                ).toLocaleString("vi-VN")}
                đ
              </span>
            </div>
            <div className="order-row">
              <span className="order-label">Giảm giá</span>
              <span className="order-value">
                {`${course?.discount || 0}%`}
                {couponValid ? " + Coupon -10%" : ""}
              </span>
            </div>
            <div className="order-total">
              <span className="order-label">Tổng thanh toán</span>
              <span className="order-value highlight">
                {total.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <button className="btn-primary fulls" onClick={handleClickPayMent}>
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterStudyComponent;
