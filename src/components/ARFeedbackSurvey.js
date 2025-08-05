import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function ARFeedbackSurvey() {
    const [showPopup, setShowPopup] = useState(false);
    const [scores, setScores] = useState({
        interest: null,
        purchase: null,
        recommend: null
    });
    const [submitted, setSubmitted] = useState(false);

    const handleScoreSelect = (question, score) => {
        setScores(prev => ({
            ...prev,
            [question]: score
        }));
    };

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleSend = () => {
        console.log('AR Feedback scores:', scores);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setShowPopup(false);
            setScores({
                interest: null,
                purchase: null,
                recommend: null
            });
        }, 2000);
    };

    const allQuestionsAnswered = scores.interest !== null && scores.purchase !== null && scores.recommend !== null;

    const questions = [
        { key: 'interest', text: 'Bạn có thấy hứng thú với trải nghiệm trên không ?' },
        { key: 'purchase', text: 'Bạn có sẵn sàng mua BG được tích hợp công nghệ thực tế tăng cường không ?' },
        { key: 'recommend', text: 'Bạn có sẵn sàng giới thiệu cho mọi người về bộ BG tích hợp công nghệ AR này không ?' }
    ];

    return (
        <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {/* AR Introduction - Always visible */}
                <div className="space-y-4 md:space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-honvietRed">TRẢI NGHIỆM AR</h2>
                    <p className="text-base md:text-lg text-gray-700 text-center max-w-3xl mx-auto">
                        Hãy trải nghiệm công nghệ thực tế tăng cường trên Board Game của <b>Hồn Việt</b>!
                    </p>
                    {/* Container cho 2 ảnh - responsive */}
                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 lg:max-w-4xl lg:mx-auto">
                        {/* Hàng 1, Cột 1: Ghi chú bước 1 */}
                        <div className="lg:order-1 flex items-center justify-center">
                            <div className="bg-gradient-to-r from-honvietRed to-red-600 text-white p-2 md:p-3 lg:p-4 rounded-lg shadow-lg w-full max-w-xs">
                                <h4 className="font-bold text-sm md:text-base mb-1 text-honvietGold">Bước 1:</h4>
                                <p className="text-xs md:text-sm leading-relaxed">
                                    Quét mã QR để tải ứng dụng AR và bắt đầu trải nghiệm công nghệ thực tế tăng cường
                                </p>
                            </div>
                        </div>

                        {/* Hàng 1, Cột 2: Ảnh QR */}
                        <div className="lg:order-2 flex flex-col items-center justify-center space-y-2">
                            <div className="border-2 border-honvietRed rounded-lg shadow-xl overflow-hidden bg-white p-1">
                                <img
                                    src="https://res.cloudinary.com/dhhljyybq/image/upload/v1754328289/Ngh%E1%BB%87_Nh%C3%A2n_H%C3%A1t_B%E1%BB%99i_QrCode_sz1cus.png"
                                    alt="QR Code"
                                    className="w-40 md:w-40 lg:w-48 h-auto object-cover rounded"
                                />
                            </div>
                            <p className="text-xs md:text-sm text-honvietRed font-bold">Mã QR</p>
                        </div>

                        {/* Hàng 2, Cột 1: Ảnh thẻ bài */}
                        <div className="lg:order-3 order-4 flex flex-col items-center justify-center space-y-2">
                            <div className="border-2  rounded-lg shadow-xl overflow-hidden bg-white p-1">
                                <img
                                    src="https://res.cloudinary.com/dhhljyybq/image/upload/v1754328291/AR_Ngh%E1%BB%87_Nh%C3%A2n_H%C3%A1t_B%E1%BB%99i_kwgt4x.jpg"
                                    alt="AR Experience"
                                    className="w-72 md:w-80 lg:w-96 h-auto object-cover rounded"
                                />
                            </div>
                            <p className="text-xs md:text-sm text-honvietRed font-bold">Thẻ bài AR</p>
                        </div>

                        {/* Hàng 2, Cột 2: Ghi chú bước 2 */}
                        <div className="lg:order-4 order-3 flex items-center justify-center">
                            <div className="bg-gradient-to-l from-honvietGold to-yellow-500 text-white p-2 md:p-3 lg:p-4 rounded-lg shadow-lg w-full max-w-xs">
                                <h4 className="font-bold text-sm md:text-base mb-1 text-honvietRed">Bước 2:</h4>
                                <p className="text-xs md:text-sm leading-relaxed">
                                    Quét thẻ bài bằng ứng dụng AR để trải nghiệm công nghệ thực tế tăng cường tương tác với board game
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Text hướng dẫn */}
                    <div className="bg-red-50 rounded-lg p-3 md:p-4 border border-honvietRed/20">
                        <h3 className="text-base md:text-lg font-semibold text-honvietRed mb-2">Hướng dẫn sử dụng:</h3>
                        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                            Quét mã QR bằng ứng dụng AR để trải nghiệm công nghệ thực tế tăng cường tương tác với board game. 
                            Bạn sẽ được trải nghiệm những hiệu ứng thú vị và tương tác độc đáo với các thẻ bài trong game.
                        </p>
                    </div>

                    {/* Nút mở popup đánh giá */}
                    <div className="flex justify-center md:justify-end pt-2">
                        <button
                            onClick={handleOpenPopup}
                            className="bg-honvietRed text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm md:text-base font-semibold shadow-lg"
                        >
                            <span>Đánh giá trải nghiệm AR</span>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Popup đánh giá - slide từ bên phải */}
            <div className={`fixed inset-0 z-50 ${showPopup ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`absolute inset-0 bg-black transition-opacity duration-300 ${showPopup ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setShowPopup(false)}
                />
                
                {/* Popup container */}
                <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${showPopup ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="h-full overflow-y-auto p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-honvietRed">ĐÁNH GIÁ TRẢI NGHIỆM AR</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm md:text-base text-gray-700 text-center mb-6">
                            Vui lòng đánh giá mức độ hài lòng của bạn về trải nghiệm công nghệ thực tế tăng cường
                        </p>

                        <div className="text-center mb-6">
                            <span className="text-base md:text-lg font-semibold text-honvietGold">Điểm đánh giá (1-5)</span>
                        </div>

                        <div className="space-y-6">
                            {questions.map((question, index) => (
                                <div key={question.key} className="bg-red-50 rounded-lg p-4 border border-honvietRed/20">
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-honvietRed font-bold text-base">{index + 1}.</span>
                                            <span className="text-sm text-gray-700 font-medium leading-relaxed">{question.text}</span>
                                        </div>
                                        
                                        <div className="flex justify-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((score) => (
                                                <button
                                                    key={score}
                                                    onClick={() => handleScoreSelect(question.key, score)}
                                                    className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                                                        scores[question.key] === score
                                                            ? 'bg-honvietRed text-white shadow-lg transform scale-110'
                                                            : 'bg-white border-2 border-honvietGold text-honvietRed hover:border-honvietRed hover:shadow-md'
                                                    }`}
                                                >
                                                    {score}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-6">
                            {!submitted ? (
                                <button
                                    disabled={!allQuestionsAnswered}
                                    onClick={handleSend}
                                    className={`px-6 py-3 rounded-lg text-white font-bold text-base transition-all duration-200 shadow-lg ${
                                        !allQuestionsAnswered 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-honvietRed hover:bg-red-700 hover:shadow-xl transform hover:scale-105'
                                    }`}
                                >
                                    Gửi đánh giá
                                </button>
                            ) : (
                                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg font-bold text-base text-center border border-green-200">
                                    ✅ Cảm ơn bạn đã đánh giá! 🎉
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
