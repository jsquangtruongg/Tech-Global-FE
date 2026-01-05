import "./style.scss";
import { useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  DotChartOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

interface Question {
  id: number;
  type: "multiple-choice" | "essay";
  question: string;
  options?: string[];
  correctOption?: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Price Action là phương pháp giao dịch dựa trên yếu tố nào?",
    options: [
      "Chỉ báo kỹ thuật (Indicators)",
      "Hành động giá và cấu trúc thị trường",
      "Tin tức kinh tế vĩ mô",
      "Khối lượng giao dịch đơn thuần",
    ],
    correctOption: 1,
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "Mô hình nến Pinbar báo hiệu điều gì?",
    options: [
      "Sự tiếp diễn xu hướng mạnh mẽ",
      "Sự do dự của thị trường",
      "Sự từ chối giá (Rejection) và khả năng đảo chiều",
      "Không có ý nghĩa gì đặc biệt",
    ],
    correctOption: 2,
  },
  {
    id: 3,
    type: "essay",
    question:
      "Hãy phân tích tâm lý đám đông đằng sau mô hình Vai - Đầu - Vai (Head and Shoulders).",
  },
  {
    id: 4,
    type: "essay",
    question:
      "Tại sao quản lý rủi ro (Risk Management) lại quan trọng hơn điểm vào lệnh (Entry)?",
  },
  {
    id: 5,
    type: "multiple-choice",
    question:
      "Trong xu hướng tăng (Uptrend), cấu trúc thị trường được xác định bởi?",
    options: [
      "Đỉnh sau thấp hơn đỉnh trước, đáy sau thấp hơn đáy trước",
      "Đỉnh sau cao hơn đỉnh trước, đáy sau cao hơn đáy trước",
      "Đỉnh và đáy đi ngang",
      "Giá biến động ngẫu nhiên",
    ],
    correctOption: 1,
  },
];

const StudyComponent = () => {
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

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const totalMCQuestions = useMemo(
    () => mockQuestions.filter((q) => q.type === "multiple-choice").length,
    []
  );

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const handleEssayChange = (text: string) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: text });
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
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

    for (const q of mockQuestions) {
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

  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  return (
    <div className="study-wrapper">
      <div className="header-learn">
        <div className="study-container">
          <div className="study-sidebar">
            <h3 className="sidebar-title">Danh sách câu hỏi</h3>
            <div className="question-list">
              {mockQuestions.map((q, index) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    className={`q-nav-item ${isCurrent ? "active" : ""} ${
                      isAnswered ? "answered" : ""
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <span className="q-num">{index + 1}</span>
                    <span className="q-preview">{q.question}</span>
                    {isAnswered && <CheckCircleOutlined className="check-icon" />}
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
                Câu hỏi {currentQuestionIndex + 1} / {mockQuestions.length}
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
                            {isSelected ? <CheckCircleOutlined /> : <DotChartOutlined />}
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
            </div>

            <div className="action-footer">
              <button
                className="nav-btn prev"
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeftOutlined /> Trước
              </button>

              {currentQuestionIndex === mockQuestions.length - 1 ? (
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
