import React, { useState, useRef, useEffect } from 'react';
import './BlogSection2.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const blogSlides = [
  {
    background: 'https://picsum.photos/seed/bac1/800/400',
    text: 'Hầu đồng là một nghi thức trong tín ngưỡng dân gian và tôn giáo thờ Mẫu, đặc trưng của nhiều dân tộc Việt Nam.',
    textFull: `Hầu đồng, còn được gọi là hầu bóng hay đồng bóng, là một nghi thức trong tín ngưỡng dân gian và tôn giáo thờ Mẫu – một dòng Shaman giáo đặc trưng của nhiều dân tộc, bao gồm cả người Việt Nam.
Thực chất, hầu đồng là một nghi thức giao tiếp với các vị thần linh thông qua trung gian là các đồng nam, đồng nữ. Khi thần linh nhập vào người hầu đồng, họ sẽ thực hiện các nghi thức như múa hát, chầu văn và truyền đạt thông điệp từ thần linh.
Hiện tại, không có một định nghĩa cụ thể nào cho hầu đồng, mà đây chỉ là khái niệm để miêu tả trạng thái tâm linh khi các vị thần linh “nhập” vào cơ thể của ông/bà đồng, và qua đó thể hiện lời nói, hành động, cũng như ý muốn của thần linh thông qua người hầu đồng.
Ngày nay, hầu đồng đã trở thành một phần không thể thiếu trong đời sống tín ngưỡng của nhân dân, nhờ sự gắn bó sâu sắc với đời sống tâm linh của người dân và tính độc đáo của các nghi thức trong hầu đồng, vào ngày 1/12/2016, UNESCO đã chính thức công nhận “Những thực hành liên quan đến tín ngưỡng thờ Mẫu Tam phủ của người Việt” là Di sản văn hóa phi vật thể đại diện của nhân loại tại Ethiopia.
` },
  {
    background: 'https://picsum.photos/seed/bac2/800/400',
    text: 'Tranh Đông Hồ là dòng tranh dân gian nổi tiếng xuất xứ từ làng Đông Hồ, Bắc Ninh.',
    textFull:
 `Là một trong ba dòng tranh dân gian của Việt Nam xuất xứ từ làng Đông Hồ (Thuận Thành, Bắc Ninh) có lịch sử trên 400 năm. Làng Đông Hồ nằm sát ngay bờ sông Đuống, xưa còn gọi là làng Mái, các cụ vẫn truyền lại câu thơ rằng:
“Hỡi cô thắt lưng bao xanh
Có về làng Mái với anh thì về
Làng Mái có lịch có lề
Có sông tắm mát có nghề làm tranh”
Tranh Đông Hồ thuộc dòng tranh in từ ván khắc gỗ, do người dân làng Đông Hồ sáng tạo, sản xuất và phát triển thành làng nghề. Đây là dòng tranh gắn bó và thể hiện sinh động xã hội nông nghiệp Việt cổ truyền, cuộc sống lao động của người nông dân bình dị, chất phác, phong tục, tập quán, sinh hoạt của người dân Việt. Để thể hiện một bức tranh, ngoài bản nét đen chủ đạo, tranh mẫu có bao nhiêu màu thì cần bấy nhiêu bản gỗ khắc in màu tương ứng. Đặc biệt, giấy in là loại giấy dó truyền thống, có quét điệp và màu sử dụng in tranh được chế từ nguồn gốc tự nhiên, như màu vàng của hoa hòe, màu đỏ của hoa hiên, màu trắng từ bột vỏ sò, điệp và màu đen của than lá tre..., tạo ra mỹ cảm dung dị, độc đáo.
Về thể loại, dựa vào nội dung chủ đề, có thể chia tranh Đông Hồ thành 7 loại chính, gồm tranh thờ, tranh chúc tụng, tranh lịch sử, tranh truyện, tranh phương ngôn, tranh cảnh vật và tranh phản ánh sinh hoạt.
`  },
  {
    background: 'https://picsum.photos/seed/bac3/800/400',
    text: 'Làng Đúc Đồng Ngũ Xã là một trong bốn nghề tinh hoa bậc nhất của Kinh thành Thăng Long.',
    textFull:
      `Được hình thành từ thế kỷ XVII, Làng nghề Đúc đồng truyền thống Ngũ Xã được coi là một trong bốn nghề tinh hoa bậc nhất của Kinh thành Thăng Long - Hà Nội.
Trong suốt chiều dài 400 năm lịch sử tồn tại và phát triển cùng đất nước, làng nghề đúc đồng truyền thống ngũ xã đã đóng góp được một số công trình thủ công mỹ nghệ, góp phần tôn vinh văn hóa truyền thống dân tộc Việt Nam. Trong đó, có thể kể đến các tác phẩm tiêu biểu
Pho tượng Đức Phật A Di Đà nặng 14 tấn tại Chùa Ngũ Xã, được nhà nước công nhận là Tác phẩm Văn hóa Nghệ thuật Việt Nam
Tượng Đức Liên Hoa Sinh cao 1M8 được đặt tại đỉnh Tháp Mandala Tây Thiên.
Tượng Đức Huyền Thiên Trấn Vũ được đặt tại Đền Quán Thánh – một trong Tứ Trấn Thăng Long.
Tượng Thiền Sư Minh Không – Ông tổ Nghề Đúc đồng Việt Nam
Tượng chân dung Hồ Chủ Tịch được đặt tại Văn phòng Quốc hội Chủ tịch nước.`
  },
  {
    background: 'https://picsum.photos/seed/bac4/800/400',
    text: 'Lễ hội chùa Hương là một trong những lễ hội lớn nhất miền Bắc dịp Tết.',
    textFull:
      `Lễ hội chùa Hương, một trong những lễ hội miền Bắc dịp Tết mang đậm bản sắc văn hóa Việt, được tổ chức tại xã Hương Sơn, huyện Mỹ Đức, cách trung tâm Hà Nội khoảng 70 km về phía Nam. Địa điểm này nằm giữa một quần thể danh thắng với phong cảnh sơn thủy hữu tình, bao quanh bởi dãy núi đá vôi và dòng sông Đáy trong xanh.
Thời gian diễn ra lễ hội chùa Hương thường bắt đầu từ ngày mùng 6 tháng Giêng âm lịch và kéo dài đến hết tháng 3, với đỉnh điểm là những ngày cuối tuần. Đây là khoảng thời gian lý tưởng để du khách trải nghiệm du lịch miền Bắc dịp Tết, khám phá không gian tâm linh thiêng liêng và thiên nhiên kỳ vĩ của ngôi chùa nổi tiếng
Các nghi thức và hoạt động trong lễ hội chùa Hương: 
 Nghi thức khai sơn - lễ mở cửa rừng
Nghi thức khai sơn là một trong những phần quan trọng nhất của lễ hội chùa Hương. Vào sáng sớm, các vị sư trong chùa sẽ tiến hành lễ khai mở, báo hiệu sự bắt đầu của mùa lễ hội. Nghi thức diễn ra trang trọng, với sự tham dự của các nhà sư, ban tổ chức và đông đảo Phật tử.
Nghi thức dâng hương
Nghi thức dâng hương là hoạt động mang tính tâm linh sâu sắc trong lễ hội. Mỗi du khách khi đến chùa Hương đều mong muốn thực hiện nghi thức này để bày tỏ lòng thành kính với Phật và các vị thần linh.. Từng chùm khói bay lên, như một cầu nối giữa con người và thiêng liêng, mang theo những ước mơ, nguyện vọng cho một năm mới tốt lành. 
Phần hội của lễ hội chùa Hương
Bên cạnh các nghi thức tâm linh, phần hội của lễ hội chùa Hương luôn diễn ra sôi nổi và đầy màu sắc. Các hoạt động văn hóa dân gian như múa rối nước, hát chèo, diễn xướng dân gian được trình diễn sinh động, mang đậm bản sắc văn hóa miền Bắc.`
  },
  {
    background: 'https://picsum.photos/seed/trung1/800/400',
    text: 'Lễ hội Cầu ngư là lễ trọng lớn nhất trong năm của cộng đồng cư dân biển miền Trung.',
    textFull: `Đối với đời sống cộng đồng cư dân biển, Lễ hội Cầu ngư là lễ trọng lớn nhất trong năm, vì đây là lễ hội cầu mùa-cầu ngư hay lễ tế ngư thần và cầu xin thần ban cho một năm “trời yên biển lặng, tôm cá đầy khoang”.
Lễ hội Cầu ngư không chỉ thể hiện bản sắc văn hóa dân gian đặc sắc, mang tính vùng miền của ngư dân mỗi địa phương có di sản mà còn là môi trường bảo tồn, làm giàu và phát huy sự đa dạng của bản sắc văn hóa dân tộc, là cơ hội phát huy giá trị văn hóa biển Việt Nam. Bên cạnh đó, Lễ hội Cầu ngư chính là nguồn sử liệu, là những bằng chứng xác thực về chủ quyền biển đảo và kinh nghiệm ứng xử với biển đảo của các thế hệ người Việt Nam trong quá khứ, hiện tại và tương lai…
Lễ hội Cầu ngư nhằm cầu quốc thái, dân an, trời yên biển lặng, cầu cho ngư dân đi biển được mùa bội thu. Đây còn là một nét đẹp văn hóa địa phương, thể hiện đạo lý uống nước nhớ nguồn, tri ân các thế hệ tiền nhân đã góp phần xây dựng nghề biển. 
Đồng thời, lễ hội còn là nơi lưu giữa các loại hình nghệ thuật dân gian truyền thống và là một lễ hội quan trọng cần được duy trì bảo tồn và phát huy.`
  },
  {
    background: 'https://picsum.photos/seed/trung2/800/400',
    text: 'Nhã nhạc cung đình Huế là di sản văn hóa phi vật thể và truyền khẩu nhân loại.',
    textFull: `Nhã nhạc cung đình là thể loại nhạc có từ thời phong kiến được biểu diễn phục vụ trong cung đình vào những dịp lễ như: Đại triều, Thường triều, Tế giao, Tế miếu… Nhạc có lời hát tao nhã cùng điệu thức cao sang, quý phái góp phần tạo sự trang trọng cho các buổi lễ. Đây còn là biểu tượng của vương quyền và sự trường tồn, hưng thịnh của triều đại. Chính vì thế Nhã nhạc cung đình Huế rất được các triều đại phong kiến Việt Nam coi trọng. 
Nhã nhạc cung đình Huế được UNESCO công nhận là di sản văn hóa phi vật thể và truyền khẩu nhân loại vào 7/11/2003 và lễ đón bằng công nhận được tổ chức tại thủ đô Paris nước Pháp vào ngày 31/1/2004.
Đây là vinh dự và niềm tự hào to lớn cho Huế cũng như dân tộc Việt Nam. Ngày nay, Nhã nhạc cung đình Huế với các hình thức như dàn nhạc, ca chương, bài bản, vũ khúc được diễn xướng trong nhiều dịp như: Festival Huế, lễ hội Phật giáo, lễ hội dân gian, âm nhạc thính phòng…
Nhã nhạc còn được trình diễn trong các nghi thức ngoại giao, biểu diễn phục vụ khách du lịch và dân địa phương trong các dịp đại lễ và tết cổ truyền…`
  },
  {
    background: 'https://picsum.photos/seed/nam1/800/400',
    text: 'Đờn ca tài tử là loại hình nghệ thuật dân gian đặc trưng của vùng Nam Bộ.',
    textFull: `Đờn ca tài tử là một loại hình nghệ thuật dân gian đặc trưng của vùng đất Nam Bộ, đã được Tổ chức Giáo dục, Khoa học và văn hóa của Liên hợp quốc (UNESCO) công nhận là Di sản văn hóa phi vật thể đại diện của nhân loại.
Đờn ca tài tử hình thành và phát triển từ cuối thế kỷ 19, bắt nguồn từ nhạc lễ, Nhã nhạc cung đình Huế và văn học dân gian. Đờn ca tài tử là loại hình nghệ thuật dân gian đặc trưng của vùng Nam Bộ. Đây là loại hình nghệ thuật của đàn và ca, do những người bình dân, thanh niên nam nữ nông thôn Nam Bộ hát ca sau những giờ lao động.
Đờn ca tài tử xuất hiện hơn 100 năm trước, là loại hình diễn tấu có ban nhạc gồm bốn loại là đàn kìm, đàn cò, đàn tranh và đàn bầu (gọi là tứ tuyệt), sau này, có cách tân bằng cách thay thế độc huyền cầm bằng cây guitar phím lõm. Đờn ca tài tử Nam Bộ bao gồm Đờn và ca: Đờn theo dòng nhạc tài tử Nam Bộ: Nhạc tài tử Nam Bộ gồm có 05 nốt nhạc chính: Hò, xự xang, xê cóng. Nốt nhạc phụ: Phạn, tồn, là, oan.`
  },
];

export default function BlogSlider() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const timer = useRef(null);

  const nextSlide = () => {
    setExpanded(false);
    setIndex((prev) => (prev + 1) % blogSlides.length);
  };

  const prevSlide = () => {
    setExpanded(false);
    setIndex((prev) => (prev - 1 + blogSlides.length) % blogSlides.length);
  };

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      nextSlide();
    }, 7000);
    return () => clearTimeout(timer.current);
  }, [index]);

  const current = blogSlides[index];

  return (
    <div className="relative w-full h-[500px] overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${current.background})` }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full flex items-center justify-center px-1 sm:px-2 md:px-6">
        <div className={`w-full max-w-2xl bg-white/10 backdrop-blur-md p-2 sm:p-3 md:p-6 rounded-lg md:rounded-xl shadow-lg overflow-hidden flex flex-col justify-center transition-all duration-500 ${expanded ? 'min-h-[400px] max-h-[400px]' : 'min-h-[120px] max-h-[75vh]'}`}> 
          <div className={`flex-1 overflow-y-auto transition-all duration-500 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]`}> 
            <p className={`text-base sm:text-xl md:text-2xl font-semibold leading-relaxed transition-all duration-500 ${expanded ? 'slide-up' : ''}`}> 
              {current.text}
            </p>
            {expanded && (
              <p className="mt-4 text-sm sm:text-lg md:text-xl font-normal leading-relaxed whitespace-pre-line slide-down-fadein">
                {current.textFull}
              </p>
            )}
          </div>
          {!expanded && (
            <button
              className="mt-4 text-honvietRed font-semibold hover:underline text-base sm:text-lg"
              onClick={() => setExpanded(true)}
            >
              Xem thêm
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {blogSlides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === index ? 'bg-honvietRed scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/70 hover:bg-white rounded-full shadow"
      >
        <ChevronLeft className="text-honvietRed w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/70 hover:bg-white rounded-full shadow"
      >
        <ChevronRight className="text-honvietRed w-6 h-6" />
      </button>
    </div>
  );
}
