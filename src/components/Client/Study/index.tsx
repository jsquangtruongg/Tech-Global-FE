import "./style.scss";
import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircleOutlined,
  DotChartOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getAllStudiesAPI } from "../../../api/study";
import { message, Spin, Empty, Tag } from "antd";

interface Question {
  id: number;
  type: "multiple-choice" | "essay" | "case-study";
  question: string;
  options?: string[];
  correctOption?: number;
  media?: {
    type: "image" | "video";
    url: string;
  };
  explanation?: string;
  correctAnswerText?: string;
}

const StudyComponent = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [summary, setSummary] = useState<{
    total: number;
    answered: number;
    unanswered: number;
    correct: number;
    wrong: number;
    totalMC: number;
    scorePercent: number;
  } | null>(null);

  const location = useLocation();
  const sectionIdParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("sectionId");
    return v ? Number(v) : undefined;
  }, [location.search]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await getAllStudiesAPI(sectionIdParam);
        if (res?.data && Array.isArray(res.data)) {
          const formattedQuestions: Question[] = res.data.map((item: any) => {
            let options: string[] = [];
            let correctOption = -1;

            if (item.type === "multiple-choice" && item.options) {
              try {
                const opts =
                  typeof item.options === "string"
                    ? JSON.parse(item.options)
                    : item.options;
                if (Array.isArray(opts)) {
                  options = opts.map((o: any) => o.text);
                  correctOption = opts.findIndex((o: any) => o.isCorrect);
                }
              } catch (e) {
                console.error("Error parsing options", e);
              }
            }

            let media = undefined;
            if (item.media) {
              try {
                media =
                  typeof item.media === "string"
                    ? JSON.parse(item.media)
                    : item.media;
              } catch (e) {
                console.error("Error parsing media", e);
              }
            }

            return {
              id: item.id,
              type: item.type,
              question: item.content,
              options: options.length > 0 ? options : undefined,
              correctOption: correctOption !== -1 ? correctOption : undefined,
              media,
              explanation: item.explanation,
              correctAnswerText: item.correct_answer,
            };
          });
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Failed to fetch questions", error);
        message.error("Không thể tải danh sách câu hỏi.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [sectionIdParam]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const totalMCQuestions = useMemo(
    () => questions.filter((q) => q.type === "multiple-choice").length,
    [questions]
  );

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted || !currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleEssayChange = (text: string) => {
    if (isSubmitted || !currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: text });
  };

  const handleCaseStudyChange = (
    field: "answer" | "explanation",
    text: string
  ) => {
    if (isSubmitted || !currentQuestion) return;
    const currentAns = answers[currentQuestion.id] || {
      answer: "",
      explanation: "",
    };
    setAnswers({
      ...answers,
      [currentQuestion.id]: { ...currentAns, [field]: text },
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;

    for (const q of questions) {
      const userAns = answers[q.id];
      const isAnswered = userAns !== undefined && userAns !== "";
      if (isAnswered) answered++;
      if (q.type === "multiple-choice") {
        if (isAnswered && q.correctOption !== undefined) {
          if (userAns === q.correctOption) correct++;
          else wrong++;
        }
      }
    }

    const unanswered = totalQuestions - answered;
    const scorePercent =
      totalMCQuestions > 0 ? Math.round((correct / totalMCQuestions) * 100) : 0;

    setSummary({
      total: totalQuestions,
      answered,
      unanswered,
      correct,
      wrong,
      totalMC: totalMCQuestions,
      scorePercent,
    });
    setIsSubmitted(true);
  };

  if (loading) {
    return (
      <div
        className="study-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải câu hỏi..." />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        className="study-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Empty description="Hiện chưa có câu hỏi nào" />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="study-wrapper">
      <div className="header-learn">
        <div className="study-container">
          <div className="study-sidebar">
            <h3 className="sidebar-title">Danh sách câu hỏi</h3>
            <div className="question-list">
              {questions.map((q, index) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                let statusClass = "";
                let Icon = null;

                if (isSubmitted) {
                  if (q.type === "multiple-choice") {
                    if (isAnswered && answers[q.id] === q.correctOption) {
                      statusClass = "correct";
                      Icon = (
                        <CheckCircleOutlined className="check-icon success" />
                      );
                    } else {
                      statusClass = "wrong";
                      Icon = (
                        <CloseCircleOutlined className="check-icon danger" />
                      );
                    }
                  } else {
                    // Essay/Case-study: Assume 'info' or 'answered' state
                    statusClass = isAnswered ? "answered" : "";
                    Icon = isAnswered ? (
                      <CheckCircleOutlined className="check-icon" />
                    ) : null;
                  }
                } else {
                  if (isAnswered) {
                    statusClass = "answered";
                    Icon = <CheckCircleOutlined className="check-icon" />;
                  }
                }

                return (
                  <button
                    key={q.id}
                    className={`q-nav-item ${
                      isCurrent ? "active" : ""
                    } ${statusClass}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <span className="q-num">{index + 1}</span>
                    <span className="q-preview">{q.question}</span>
                    {Icon}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="study-content">
            <div className="content-header">
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                Câu hỏi {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="question-display">
              <h2 className="question-text">
                <span className="q-index">Câu {currentQuestionIndex + 1}:</span>
                {currentQuestion.question}
              </h2>

              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options && (
                  <div className="options-list">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentQuestion.id] === idx;
                      let optionClass = "option-item";
                      if (isSelected) optionClass += " selected";

                      // Show result if submitted
                      if (isSubmitted) {
                        if (idx === currentQuestion.correctOption)
                          optionClass += " correct";
                        else if (
                          isSelected &&
                          idx !== currentQuestion.correctOption
                        )
                          optionClass += " wrong";
                      }

                      return (
                        <div
                          key={idx}
                          className={optionClass}
                          onClick={() => handleOptionSelect(idx)}
                        >
                          <div className="radio-icon">
                            {isSelected ? (
                              <CheckCircleOutlined />
                            ) : (
                              <DotChartOutlined />
                            )}
                          </div>
                          <span className="option-text">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

              {currentQuestion.type === "essay" && (
                <div className="essay-area">
                  <textarea
                    placeholder="Nhập câu trả lời của bạn tại đây..."
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleEssayChange(e.target.value)}
                    disabled={isSubmitted}
                    rows={8}
                  />
                </div>
              )}

              {currentQuestion.type === "case-study" && (
                <div className="case-study-area">
                  {currentQuestion.media && (
                    <div className="media-container">
                      {currentQuestion.media.type === "image" ? (
                        <>
                         
                          <img
                            src={currentQuestion.media.url}
                            alt="Case Study"
                            className="media-item"
                          />
                        </>
                      ) : (
                        <>
                          <Tag color="purple">Video</Tag>
                          <video
                            src={currentQuestion.media.url}
                            controls
                            className="media-item"
                            onError={(e) => {
                              message.warning("Không thể tải video");
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}

                  <div className="input-group">
                    <label className="input-label">Câu trả lời của bạn:</label>
                    <textarea
                      placeholder="Nhập câu trả lời (Ví dụ: Vùng thanh khoản nằm ở mức giá 1920...)"
                      value={answers[currentQuestion.id]?.answer || ""}
                      onChange={(e) =>
                        handleCaseStudyChange("answer", e.target.value)
                      }
                      disabled={isSubmitted}
                      rows={4}
                      className="study-textarea"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Giải thích lý do:</label>
                    <textarea
                      placeholder="Tại sao bạn lại chọn vùng đó? (Ví dụ: Vì có nhiều râu nến quét qua...)"
                      value={answers[currentQuestion.id]?.explanation || ""}
                      onChange={(e) =>
                        handleCaseStudyChange("explanation", e.target.value)
                      }
                      disabled={isSubmitted}
                      rows={4}
                      className="study-textarea"
                    />
                  </div>
                </div>
              )}

              {isSubmitted && (
                <div
                  className="explanation-box"
                  style={{
                    marginTop: 20,
                    padding: 15,
                    background: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    borderRadius: 8,
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: "#389e0d" }}>
                    Lời giải chi tiết:
                  </h4>

                  {currentQuestion.type === "multiple-choice" &&
                    currentQuestion.options &&
                    currentQuestion.correctOption !== undefined && (
                      <div
                        className="correct-answer-text"
                        style={{ marginBottom: 10 }}
                      >
                        <strong style={{ color: "#389e0d" }}>
                          Đáp án đúng:{" "}
                        </strong>
                        <span>
                          {
                            currentQuestion.options[
                              currentQuestion.correctOption
                            ]
                          }
                        </span>
                      </div>
                    )}

                  {currentQuestion.explanation ? (
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {currentQuestion.explanation}
                    </p>
                  ) : (
                    <p style={{ color: "#8c8c8c", fontStyle: "italic" }}>
                      Chưa có lời giải chi tiết cho câu hỏi này.
                    </p>
                  )}

                  {(currentQuestion.type === "essay" ||
                    currentQuestion.type === "case-study") &&
                    currentQuestion.correctAnswerText && (
                      <div
                        className="suggested-answer"
                        style={{
                          marginTop: 15,
                          borderTop: "1px dashed #b7eb8f",
                          paddingTop: 10,
                        }}
                      >
                        <strong style={{ color: "#096dd9" }}>
                          Gợi ý trả lời / Đáp án tham khảo:
                        </strong>
                        <p style={{ whiteSpace: "pre-wrap", marginTop: 5 }}>
                          {currentQuestion.correctAnswerText}
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="action-footer">
              <button
                className="nav-btn prev"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeftOutlined /> Trước
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                !isSubmitted ? (
                  <button className="submit-btn" onClick={handleSubmit}>
                    Nộp bài
                  </button>
                ) : (
                  <button className="submit-btn disabled" disabled>
                    Đã nộp bài
                  </button>
                )
              ) : (
                <button className="nav-btn next" onClick={handleNext}>
                  Tiếp theo <ArrowRightOutlined />
                </button>
              )}
            </div>
          </div>
        </div>

        {isSubmitted && summary && (
          <div className="result-summary">
            <div className="result-item">
              <span className="result-label">Tổng câu</span>
              <span className="result-value">{summary.total}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Đã làm</span>
              <span className="result-value">{summary.answered}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Chưa làm</span>
              <span className="result-value">{summary.unanswered}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Đúng</span>
              <span className="result-value success">{summary.correct}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Sai</span>
              <span className="result-value danger">{summary.wrong}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Điểm (trắc nghiệm)</span>
              <span className="result-value highlight">
                {summary.scorePercent}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyComponent;
