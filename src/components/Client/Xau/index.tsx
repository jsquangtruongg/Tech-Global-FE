import "./style.scss";
import StarRateIcon from "@mui/icons-material/StarRate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewspaperIcon from "@mui/icons-material/Newspaper";

import ChartLong from "../../../assets/images/F4ln8b8T_mid.png";
import ChartShort from "../../../assets/images/s3Bp9oE0-637511160372186596.png";

const XauComponent = () => {
  return (
    <div className="xau-wrapper">
      <div className="xau-container">
        {/* Header Section */}
        <header className="xau-header">
          <h1 className="xau-title">
            PHÂN TÍCH <span className="highlight-text">GIÁ VÀNG</span> NGÀY HÔM
            NAY
          </h1>
          <div className="xau-prediction-banner">
            <div className="prediction-label">NHẬN ĐỊNH HÔM NAY</div>
            <div className="prediction-content">
              Vàng có xu hướng tăng giá, ưu tiên{" "}
              <span className="buy-signal">BUY</span> khi giá điều chỉnh
            </div>
          </div>
        </header>

        {/* News Section */}
        <section className="xau-section news-section">
          <div className="section-header">
            <NewspaperIcon className="section-icon" />
            <h2 className="section-title">TIN TỨC ẢNH HƯỞNG</h2>
          </div>
          <div className="news-grid">
            {[
              {
                text: "Fed chuẩn bị tăng lãi suất trong cuộc họp tới",
                time: "3 giờ trước",
              },
              {
                text: "Chỉ số CPI tháng 4 cao hơn dự báo, lạm phát gia tăng",
                time: "2 giờ trước",
              },
              {
                text: "USD giảm mạnh sau phát biểu của Chủ tịch Fed",
                time: "1 giờ trước",
              },
              {
                text: "Căng thẳng Nga - Ukraine leo thang",
                time: "30 phút trước",
              },
            ].map((news, index) => (
              <div key={index} className="news-card">
                <div className="news-card-icon">
                  <StarRateIcon />
                </div>
                <div className="news-card-content">
                  <p className="news-text">{news.text}</p>
                  <span className="news-time">{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trend Analysis Section */}
        <section className="xau-section trend-section">
          <div className="section-header">
            <TrendingUpIcon className="section-icon" />
            <h2 className="section-title">PHÂN TÍCH XU HƯỚNG</h2>
          </div>
          <div className="trend-grid">
            <div className="trend-card">
              <div className="card-header">
                <h3>Xu Hướng Dài Hạn (D1)</h3>
                <span className="trend-badge up">Tăng</span>
              </div>
              <div className="chart-container">
                <img src={ChartLong} alt="Xu hướng dài hạn" />
              </div>
            </div>
            <div className="trend-card">
              <div className="card-header">
                <h3>Xu Hướng Ngắn Hạn (M15)</h3>
                <span className="trend-badge neutral">Sideway</span>
              </div>
              <div className="chart-container">
                <img src={ChartShort} alt="Xu hướng ngắn hạn" />
              </div>
            </div>
          </div>
        </section>

        {/* Expert Analysis Section */}
        <section className="xau-section expert-section">
          <div className="section-header">
            <InfoOutlinedIcon className="section-icon" />
            <h2 className="section-title">NHẬN ĐỊNH CHUYÊN GIA</h2>
          </div>
          <div className="expert-grid">
            <div className="scenario-card bullish">
              <div className="scenario-header">
                <TrendingUpIcon /> Kịch Bản Tăng
              </div>
              <ul className="scenario-list">
                <li>
                  Nếu giá vượt kháng cự <strong>2000</strong>
                </li>
                <li>
                  Có thể bật lên hướng <strong>2020 - 2030</strong>
                </li>
              </ul>
            </div>
            <div className="scenario-card bearish">
              <div className="scenario-header">
                <TrendingDownIcon /> Kịch Bản Giảm
              </div>
              <ul className="scenario-list">
                <li>
                  Nếu mất hỗ trợ <strong>1980</strong>
                </li>
                <li>
                  Có thể rơi về vùng <strong>1960 - 1950</strong>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="xau-section calendar-section">
          <div className="section-header">
            <CalendarMonthIcon className="section-icon" />
            <h2 className="section-title">LỊCH KINH TẾ</h2>
          </div>
          <div className="calendar-container">
            <div className="calendar-table-header">
              <div className="col time">Thời Gian</div>
              <div className="col event">Sự Kiện</div>
              <div className="col impact">Tác Động</div>
              <div className="col result">Kết Quả</div>
            </div>
            {[
              {
                time: "19:30",
                flag: "🇺🇸",
                event: "Chỉ số CPI (Mỹ)",
                result: "3.4%",
              },
              {
                time: "21:00",
                flag: "🇺🇸",
                event: "Biên bản cuộc họp FED",
                result: "—",
              },
              {
                time: "19:30",
                flag: "🇺🇸",
                event: "Báo cáo việc làm số NFP",
                result: "—",
              },
            ].map((item, index) => (
              <div key={index} className="calendar-row">
                <div className="col time">{item.time}</div>
                <div className="col event">
                  <span className="flag">{item.flag}</span>
                  <span className="name">{item.event}</span>
                </div>
                <div className="col impact">
                  {[...Array(3)].map((_, i) => (
                    <StarRateIcon key={i} className="star filled" />
                  ))}
                </div>
                <div className="col result">{item.result}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default XauComponent;
