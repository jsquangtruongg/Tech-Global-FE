import "./style.scss";
import { useEffect, useState } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/vi";
import {
  getGoldNewsAPI,
  type IGoldNewsItem,
  getEconomicCalendarAPI,
  type IEconomicEvent,
} from "../../../api/analytics";
import ChartLong from "../../../assets/images/F4ln8b8T_mid.png";
import ChartShort from "../../../assets/images/s3Bp9oE0-637511160372186596.png";

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.locale("vi");

const XauComponent = () => {
  const [news, setNews] = useState<IGoldNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<IEconomicEvent[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      const res = await getGoldNewsAPI();
      if (res.err === 0 && Array.isArray(res.data)) {
        setNews(res.data.slice(0, 8));
      } else {
        setNews([]);
      }
      setLoadingNews(false);
    };

    const fetchCalendar = async () => {
      setLoadingCalendar(true);
      const res = await getEconomicCalendarAPI();
      if (res.err === 0 && Array.isArray(res.data)) {
        // Backend now filters for USD and High/Medium impact events
        // We just display what we get, which is the relevant list for the week
        setCalendarEvents(res.data);
      } else {
        setCalendarEvents([]);
      }
      setLoadingCalendar(false);
    };

    fetchNews();
    fetchCalendar();
  }, []);

  const renderNewsTime = (iso: string) => {
    if (!iso) return "";
    const d = dayjs(iso);
    if (!d.isValid()) return "";
    return d.fromNow();
  };

  const mapCountryToFlag = (currency: string) => {
    const map: Record<string, string> = {
      USD: "🇺🇸",
      EUR: "🇪🇺",
      GBP: "🇬🇧",
      JPY: "🇯🇵",
      AUD: "🇦🇺",
      CAD: "🇨🇦",
      CHF: "🇨🇭",
      CNY: "🇨🇳",
      NZD: "🇳🇿",
    };
    return map[currency] || "🌍";
  };

  const getImpactStars = (impact: string) => {
    if (!impact) return 1;
    const i = impact.toLowerCase();
    if (i.includes("high")) return 3;
    if (i.includes("medium")) return 2;
    return 1;
  };

  // Format date for display (e.g., "Thứ 2, 07/02")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // dateStr from XML is usually MM-DD-YYYY
    let d = dayjs(dateStr, "MM-DD-YYYY", true);
    if (!d.isValid()) {
      // Fallback to standard parsing if explicit format fails
      d = dayjs(dateStr);
    }
    if (!d.isValid()) return dateStr;
    return d.format("dddd, DD/MM");
  };

  // Group events by date
  const groupedEvents = calendarEvents.reduce(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, IEconomicEvent[]>,
  );

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    // Assuming MM-DD-YYYY format from XML, but let's parse safely
    // Or just use dayjs comparison
    return dayjs(a).valueOf() - dayjs(b).valueOf();
  });

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
            {loadingNews && (
              <div className="news-empty">Đang tải tin tức vàng...</div>
            )}
            {!loadingNews && news.length === 0 && (
              <div className="news-empty">Hiện chưa lấy được tin tức vàng.</div>
            )}
            {!loadingNews &&
              news.map((item) => (
                <a
                  key={item.id}
                  className="news-card"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="news-card-icon">
                    <StarRateIcon />
                  </div>
                  <div className="news-card-content">
                    <p className="news-text">{item.titleVi || item.title}</p>
                    <span className="news-source">
                      {item.source} • {renderNewsTime(item.publishedAt)}
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>
        <section className="xau-section calendar-section">
          <div className="section-header">
            <CalendarMonthIcon className="section-icon" />
            <h2 className="section-title">LỊCH KINH TẾ TUẦN NÀY</h2>
          </div>
          <div className="calendar-container">
            <div className="calendar-table-header">
              <div className="col time">Giờ</div>
              <div className="col event">Sự Kiện</div>
              <div className="col impact">Tác Động</div>
              <div className="col result">Dự Báo</div>
            </div>
            {loadingCalendar && (
              <div style={{ padding: 20, textAlign: "center" }}>
                Đang tải lịch kinh tế...
              </div>
            )}
            {!loadingCalendar && calendarEvents.length === 0 && (
              <div style={{ padding: 20, textAlign: "center" }}>
                Không có sự kiện quan trọng tuần này.
              </div>
            )}
            {!loadingCalendar &&
              sortedDates.map((date) => (
                <div key={date}>
                  <div className="calendar-date-header">{formatDate(date)}</div>
                  {groupedEvents[date].map((item, index) => (
                    <div key={`${date}-${index}`} className="calendar-row">
                      <div className="col time">
                        <div style={{ fontWeight: "bold" }}>{item.time}</div>
                      </div>
                      <div className="col event">
                        <span className="flag">
                          {mapCountryToFlag(item.country)}
                        </span>
                        <span className="name">{item.title}</span>
                      </div>
                      <div className="col impact">
                        {[...Array(getImpactStars(item.impact))].map((_, i) => (
                          <StarRateIcon key={i} className="star filled" />
                        ))}
                      </div>
                      <div className="col result">{item.forecast || "—"}</div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default XauComponent;
