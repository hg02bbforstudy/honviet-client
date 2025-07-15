import React, { useState } from 'react';

export default function FeedbackSurvey() {
    const [visible, setVisible] = useState(false);
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSend = () => {
        console.log('Điểm feedback:', score);
        setSubmitted(true);
        setTimeout(() => {
            setVisible(false);
            setSubmitted(false);
            setScore(null);
        }, 1500); // Tự ẩn bảng sau khi gửi
    };

    return (
        <div className="fixed right-0 bottom-20 z-50">
            {/* Nút FEEDBACK */}
            {!visible && (
                <button
                    onClick={() => setVisible(true)}
                    className="bg-honvietGold text-black font-semibold px-6 py-4 text-lg rounded-l shadow-lg hover:bg-honvietGold/80 transition-all origin-right -rotate-90 fixed right-4 top-1/2 -translate-y-1/2 z-50"
                >
                    Feedback
                </button>
            )}

            {/* Bảng khảo sát */}
            <div
                className={`bg-white shadow-lg rounded-l-xl p-4 w-[300px] transition-all duration-500 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
                    }`}
            >
                <h3 className="font-bold text-lg mb-2 text-center">TRẢI NGHIỆM CỦA BẠN</h3>
                <p className="text-sm text-gray-700 text-center mb-3">
                    Khả năng bạn sẽ giới thiệu trang <span className="font-semibold">honviet.onrender.com</span> cho bạn bè ở mức độ nào?
                </p>

                {/* Chọn điểm */}
                <div className="flex justify-between items-center text-xs mb-1">
                    <span>Rất khó xảy ra</span>
                    <span>Rất có thể</span>
                </div>
                <div className="flex justify-between mb-3">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setScore(i)}
                            className={`w-6 h-6 rounded-full text-sm font-semibold flex items-center justify-center ${score === i
                                    ? 'bg-honvietRed text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            {i}
                        </button>
                    ))}
                </div>

                {/* Nút gửi */}
                <div className="text-center">
                    {!submitted ? (
                        <button
                            disabled={score === null}
                            onClick={handleSend}
                            className={`px-6 py-2 rounded text-white font-semibold ${score === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-honvietRed hover:opacity-90'
                                }`}
                        >
                            Gửi
                        </button>
                    ) : (
                        <div className="text-green-600 font-semibold">Đã gửi 🎉</div>
                    )}
                </div>
            </div>
        </div>
    );
}
