import "./style.scss";
import { useState, useMemo, useEffect } from "react";
import {
  CodeOutlined,
  DownloadOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Segmented, Spin } from "antd";
import Illustration from "../../../assets/images/pana.png";
import TabsComponent from "./Tabs";
import { useNavigate } from "react-router-dom";
import {
  getInterviewTreeAPI,
  type ITopic,
  type IMarket,
} from "../../../api/interview";

const MarginComponent = () => {
  const [market, setMarket] = useState<IMarket>("crypto");
  const [treeData, setTreeData] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(false);

  // State for UI selection
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>(""); // Actually Section Name
  const [levelFilter, setLevelFilter] = useState<
    "All" | "Entry" | "Junior" | "Middle" | "Senior" | "Expert"
  >("All");
  const [openAnswers, setOpenAnswers] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  // Fetch data when market changes
  useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      const res = await getInterviewTreeAPI(market);
      if (res.err === 0 && Array.isArray(res.data)) {
        setTreeData(res.data);
        
        // Initialize selection defaults
        if (res.data.length > 0) {
          const firstTopic = res.data[0];
          setActiveTab(String(firstTopic.id));
          
          if (firstTopic.sections && firstTopic.sections.length > 0) {
            setSelectedTopic(firstTopic.sections[0].name);
          } else {
            setSelectedTopic("");
          }
        } else {
          setActiveTab("");
          setSelectedTopic("");
        }
      }
      setLoading(false);
    };
    fetchTree();
  }, [market]);

  // Derived Data
  const tabs = useMemo(
    () => treeData.map((t) => ({ key: String(t.id), label: t.name })),
    [treeData]
  );

  const activeTopicData = useMemo(
    () => treeData.find((t) => String(t.id) === activeTab),
    [treeData, activeTab]
  );

  const sections = useMemo(
    () => activeTopicData?.sections || [],
    [activeTopicData]
  );

  const activeSectionData = useMemo(
    () => sections.find((s) => s.name === selectedTopic),
    [sections, selectedTopic]
  );

  const questions = useMemo(
    () => activeSectionData?.questions || [],
    [activeSectionData]
  );

  const visibleQuestions = useMemo(() => {
    if (levelFilter === "All") return questions;
    return questions.filter((q) => q.level === levelFilter);
  }, [questions, levelFilter]);

  // Handlers
  const toggleAnswer = (id: number) => {
    setOpenAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStudyClick = () => {
    navigate("/study");
  };

  const levels: (
    | "All"
    | "Entry"
    | "Junior"
    | "Middle"
    | "Senior"
    | "Expert"
  )[] = ["All", "Entry", "Junior", "Middle", "Senior", "Expert"];

  return (
    <div className="margin__wrapper">
      <div className="margin__container">
        <div className="margin__content">
          <div className="margin__text-content">
            <h1 className="margin__title">
              Thách thức mọi câu hỏi phỏng vấn <br />
              <span className="margin__title--highlight">
                dành cho Trader chuyên nghiệp
              </span>
            </h1>
            <div className="margin__stats">
              <span className="stats-badge">7007</span>
              <span className="stats-text">
                câu hỏi trắc nghiệm Technical, Fundamental & Psychology
              </span>
            </div>
            
            {/* Market Selector */}
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Segmented<IMarket>
                options={[
                  { label: "Crypto Market", value: "crypto" },
                  { label: "Vàng Market", value: "gold" },
                ]}
                value={market}
                onChange={setMarket}
                size="large"
                style={{ backgroundColor: "#f0f0f0" }}
              />
            </div>

            <div className="margin__actions">
              <button className="btn-global">
                <CodeOutlined className="btn-icon" />
                Câu hỏi Global
              </button>
              <button className="btn-download">
                <DownloadOutlined className="btn-icon" />
                Tải xuống Ebook cẩm nang Trading
              </button>
            </div>
          </div>
          <div className="margin__image">
            <img src={Illustration} alt="Trading Interview Challenge" />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="trade-lessons">
            {tabs.length > 0 ? (
              <>
                <TabsComponent
                  tabs={tabs}
                  activeKey={activeTab}
                  onChange={(k) => {
                    setActiveTab(k);
                    // When changing tab, select first section of new tab
                    const newTopic = treeData.find(t => String(t.id) === k);
                    if (newTopic?.sections?.length) {
                      setSelectedTopic(newTopic.sections[0].name);
                    } else {
                      setSelectedTopic("");
                    }
                  }}
                />
                <div className="trade-pills">
                  {sections.map((item) => (
                    <button
                      key={item.id}
                      className={`pill ${
                        selectedTopic === item.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedTopic(item.name)}
                    >
                      <span className="pill-name">{item.name}</span>
                      <span className="pill-count">{item.questions?.length || 0}</span>
                    </button>
                  ))}
                </div>
                
                {selectedTopic ? (
                  <div className="questions-section">
                    <div className="questions-header">
                      <h2 className="questions-title">
                        Top {questions.length} câu hỏi{" "}
                        {selectedTopic}
                      </h2>
                      <div className="question-filters">
                        {levels.map((lv) => (
                          <button
                            key={lv}
                            className={`filter ${levelFilter === lv ? "active" : ""}`}
                            onClick={() => setLevelFilter(lv)}
                          >
                            {lv}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="questions-list">
                      {visibleQuestions.length > 0 ? (
                        visibleQuestions.map((q) => (
                          <div key={q.id} className="question-card">
                            <div className="q-badge">{String(q.id).padStart(2, "0")}</div>
                            <div className="q-content">
                              <p className="q-text">{q.question}</p>
                            </div>
                            <div className={`q-level level-${q.level.toLowerCase()}`}>
                              {q.level}
                            </div>

                            <div
                              className={`answer-box ${
                                openAnswers.has(q.id!) ? "open" : ""
                              }`}
                            >
                              <p className="answer-text">{q.answer}</p>
                            </div>
                            <button
                              className={`q-cta ${openAnswers.has(q.id!) ? "open" : ""}`}
                              onClick={() => toggleAnswer(q.id!)}
                            >
                              {openAnswers.has(q.id!)
                                ? "Ẩn câu trả lời"
                                : "Xem câu trả lời"}{" "}
                              <ArrowRightOutlined className="q-cta-icon" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p style={{ padding: 20, textAlign: "center", color: "#888" }}>
                          Chưa có câu hỏi nào cho bộ lọc này.
                        </p>
                      )}
                    </div>
                    <div className="summary-exercise">
                      <h3 className="summary-title">Làm bài tập tổng kết:</h3>
                      <p className="summary-desc">
                        Hãy hoàn thành bài tập tổng kết dưới đây để kiểm tra kiến thức
                        của bạn!
                      </p>
                      <button className="summary-btn" onClick={handleStudyClick}>
                        Làm bài tổng kết
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
                    Chọn một phần để xem câu hỏi.
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "50px", color: "#888" }}>
                Chưa có dữ liệu cho thị trường này.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default MarginComponent;
