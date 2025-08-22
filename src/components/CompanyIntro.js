import React, { useEffect, useState, useRef } from 'react';

const introText = `Công ty TNHH Hồn Việt được khởi xướng bởi một nhóm bạn trẻ đầy đam mê với sứ mệnh bảo tồn và phát huy giá trị văn hóa truyền thống của ba miền Bắc – Trung – Nam Việt Nam.\n\nNhư cố Tổng Bí thư Nguyễn Phú Trọng từng khẳng định:\n\n“Văn hóa là hồn cốt của dân tộc, nói lên bản sắc của dân tộc. Văn hóa còn thì dân tộc còn. Do đó, nếu mất văn hóa là mất dân tộc.”\n\nLời nói này chính là kim chỉ nam cho mọi hoạt động của Hồn Việt, giúp chúng tôi kiên định trên con đường giữ gìn và phát huy những giá trị văn hóa truyền thống quý báu của dân tộc Việt.`;

const sections = [
    {
        title: 'Tầm nhìn',
        content:
            'Hồn Việt phấn đấu trở thành thương hiệu hàng đầu trong lĩnh vực sáng tạo văn hóa, gìn giữ và quảng bá truyền thống ba miền Việt Nam vào năm 2028. \n  \n          Chúng tôi hướng tới xây dựng một cộng đồng vững mạnh, nơi mọi người có thể cùng nhau gìn giữ, lan tỏa và tự hào về di sản văn hóa dân tộc.'
    },
    {
        title: 'Sứ mệnh',
        content:
            'Sứ mệnh của Hồn Việt là tạo ra và cung cấp các sản phẩm chất lượng cao, sáng tạo, truyền cảm hứng, giáo dục và nâng cao nhận thức cộng đồng về ý nghĩa của những giá trị và văn hóa truyền thống Việt Nam.\n  \n  Chúng tôi xây dựng những không gian để mỗi cá nhân có thể kết nối, học hỏi, trải nghiệm và trân trọng vẻ đẹp của di sản văn hóa dân tộc trong cuộc sống hàng ngày.'
    },
    {
        title: 'Giá trị cốt lõi',
        content:
            'Toàn vẹn văn hóa: Luôn đặt tính xác thực, tôn trọng bản sắc và chuẩn mực văn hóa lên hàng đầu trong mọi hoạt động.\n\nGắn kết cộng đồng: Xây dựng một cộng đồng đam mê văn hóa, lan tỏa giá trị truyền thống qua các thế hệ.\n\nĐổi mới & sáng tạo: Liên tục đổi mới trong thiết kế sản phẩm, dịch vụ và trải nghiệm để khiến văn hóa truyền thống trở nên gần gũi và hấp dẫn hơn với xã hội hiện đại.\n\nGìn giữ & truyền cảm hứng: Mỗi sản phẩm và dịch vụ đều là phương tiện để gìn giữ, truyền cảm hứng và bảo vệ những giá trị văn hóa dân tộc cho thế hệ tương lai.'
    }
];


export default function CompanyIntro() {
    const [visible, setVisible] = useState([false, false, false]);
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (hasAnimated) return;
        let frame;
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasAnimated(true);
                    let i = 0;
                    const animate = () => {
                        setVisible(v => {
                            const arr = [...v];
                            arr[i] = true;
                            return arr;
                        });
                        i++;
                        if (i < sections.length) {
                            frame = window.requestAnimationFrame(() => {
                                setTimeout(animate, 280); // delay nhỏ hơn, mượt hơn
                            });
                        }
                    };
                    setTimeout(animate, 300);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => {
            observer.disconnect();
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [hasAnimated]);

    return (
        <section ref={sectionRef} className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-2xl md:text-3xl font-bold text-left mb-6 uppercase text-honvietGold">Công ty TNHH Hồn Việt</h2>
            <p className="text-base md:text-lg text-gray-700 whitespace-pre-line text-left mb-10 italic">{introText}</p>
            <div className="flex flex-col md:flex-row gap-6">
                {sections.map((sec, idx) => (
                    <div
                        key={idx}
                        className={
                            `flex-1 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:bg-honvietRed hover:shadow-lg transition-all duration-100 group ` +
                            `transform ${visible[idx] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ` +
                            `transition-all duration-200`
                        }
                        style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-3 text-honvietRed group-hover:text-honvietGold transition-colors duration-100">{sec.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line text-sm md:text-base text-left group-hover:text-white transition-colors duration-100">{sec.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
