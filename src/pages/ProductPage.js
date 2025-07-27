import React, { useState } from 'react';
import CartFab, { cartFabDomId } from '../components/CartFab';
import { useParams } from 'react-router-dom';
import { products } from './../components/ProductCarousel'; // Giả sử products export từ ProductCarousel.js
import { localAccessories } from './../components/AccessoriesSection';
import {
  getCart,
  updateCartItemQuantity,
} from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
const productDescriptions = {
  1: {
    name: 'Combo 3 bộ board games',
    description: `Combo gồm 3 bộ board game: Miền Bắc, Miền Trung, Miền Nam.\n\nMiền Bắc: Huyền Tích Làng Xưa\nLật mở từng lá bài, bạn sẽ được dẫn lối về miền Bắc cổ kính – nơi hội tụ những văn hóa đặc sắc với con người, lễ hội, tiếng trống đình, và những làng nghề truyền thống lưu dấu thời gian.\nVới công nghệ AR tích hợp, Huyền Tích Làng Xưa không chỉ là trò chơi – mà là cánh cửa đưa bạn đắm chìm vào không gian văn hóa Bắc Bộ, nơi từng tập tục, lễ hội và tiếng hát dân gian sống dậy theo cách sinh động và đầy cảm xúc.\n\nMiền Trung: Cốt Linh Trầm Phong\nGiữa miền đất nắng gió và chất giọng da diết, Cốt Linh Trầm Phong mang đến cảm nhận sâu sắc về văn hóa miền Trung qua những biểu tượng thâm trầm mà thiêng liêng.\nTrầm mặc nhưng không tĩnh lặng – nơi phong tục thờ cúng, tín ngưỡng dân gian, kiến trúc cổ và nghệ thuật lễ nghi được thể hiện đầy tính biểu tượng.\nMỗi thẻ bài như một “mảnh linh hồn” của vùng đất – mang năng lượng trầm lắng, gợi nhớ về cốt cách thanh cao và sự gắn bó với thiên nhiên, tổ tiên.\n\nMiền Nam: Sông Nước Chợ Quê\nMiền Nam – nơi của những dòng sông hiền hòa, tiếng rao ngọt ngào, và cuộc sống đậm chất tình quê. Công nghệ AR trên thẻ bài giúp người chơi đắm chìm vào khung cảnh ấy – bạn không chỉ nhìn mà như được sống trong nhịp sống miền quê đầy gần gũi. Sông Nước Chợ Quê là sự hoà quyện giữa cảm xúc và hình ảnh, gợi nhắc người chơi về tinh thần cởi mở, chan hòa và bản sắc phương Nam chân tình, phóng khoáng.`,
    info: {
      'Thông tin sản phẩm': 'Combo gồm 3 bộ, mỗi bộ 36 thẻ, đặc trưng văn hóa các miền Bắc, Trung, Nam. Tích hợp công nghệ AR. Đặc trưng: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội.',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường.',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },
  2: {
    name: 'Combo 2 bộ miền Bắc-Trung',
    description: `Combo gồm 2 bộ board game: Miền Bắc và Miền Trung.\n\nMiền Bắc: Huyền Tích Làng Xưa\nLật mở từng lá bài, bạn sẽ được dẫn lối về miền Bắc cổ kính – nơi hội tụ những văn hóa đặc sắc với con người, lễ hội, tiếng trống đình, và những làng nghề truyền thống lưu dấu thời gian.\nVới công nghệ AR tích hợp, Huyền Tích Làng Xưa không chỉ là trò chơi – mà là cánh cửa đưa bạn đắm chìm vào không gian văn hóa Bắc Bộ, nơi từng tập tục, lễ hội và tiếng hát dân gian sống dậy theo cách sinh động và đầy cảm xúc.\n\nMiền Trung: Cốt Linh Trầm Phong\nGiữa miền đất nắng gió và chất giọng da diết, Cốt Linh Trầm Phong mang đến cảm nhận sâu sắc về văn hóa miền Trung qua những biểu tượng thâm trầm mà thiêng liêng.\nTrầm mặc nhưng không tĩnh lặng – nơi phong tục thờ cúng, tín ngưỡng dân gian, kiến trúc cổ và nghệ thuật lễ nghi được thể hiện đầy tính biểu tượng.\nMỗi thẻ bài như một “mảnh linh hồn” của vùng đất – mang năng lượng trầm lắng, gợi nhớ về cốt cách thanh cao và sự gắn bó với thiên nhiên, tổ tiên.`,
    info: {
      'Thông tin sản phẩm': 'Combo gồm 2 bộ, mỗi bộ 36 thẻ, đặc trưng văn hóa miền Bắc và miền Trung. Tích hợp công nghệ AR. Đặc trưng: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội.',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường.',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },
  3: {
    name: 'Combo 2 bộ miền Bắc-Nam',
    description: `Combo gồm 2 bộ board game: Miền Bắc và Miền Nam.\n\nMiền Bắc: Huyền Tích Làng Xưa\nLật mở từng lá bài, bạn sẽ được dẫn lối về miền Bắc cổ kính – nơi hội tụ những văn hóa đặc sắc với con người, lễ hội, tiếng trống đình, và những làng nghề truyền thống lưu dấu thời gian.\nVới công nghệ AR tích hợp, Huyền Tích Làng Xưa không chỉ là trò chơi – mà là cánh cửa đưa bạn đắm chìm vào không gian văn hóa Bắc Bộ, nơi từng tập tục, lễ hội và tiếng hát dân gian sống dậy theo cách sinh động và đầy cảm xúc.\n\nMiền Nam: Sông Nước Chợ Quê\nMiền Nam – nơi của những dòng sông hiền hòa, tiếng rao ngọt ngào, và cuộc sống đậm chất tình quê. Công nghệ AR trên thẻ bài giúp người chơi đắm chìm vào khung cảnh ấy – bạn không chỉ nhìn mà như được sống trong nhịp sống miền quê đầy gần gũi. Sông Nước Chợ Quê là sự hoà quyện giữa cảm xúc và hình ảnh, gợi nhắc người chơi về tinh thần cởi mở, chan hòa và bản sắc phương Nam chân tình, phóng khoáng.`,
    info: {
      'Thông tin sản phẩm': 'Combo gồm 2 bộ, mỗi bộ 36 thẻ, đặc trưng văn hóa miền Bắc và miền Nam. Tích hợp công nghệ AR. Đặc trưng: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội.',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường.',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },
  4: {
    name: 'Combo 2 bộ miền Trung-Nam',
    description: `Combo gồm 2 bộ board game: Miền Trung và Miền Nam.\n\nMiền Trung: Cốt Linh Trầm Phong\nGiữa miền đất nắng gió và chất giọng da diết, Cốt Linh Trầm Phong mang đến cảm nhận sâu sắc về văn hóa miền Trung qua những biểu tượng thâm trầm mà thiêng liêng.\nTrầm mặc nhưng không tĩnh lặng – nơi phong tục thờ cúng, tín ngưỡng dân gian, kiến trúc cổ và nghệ thuật lễ nghi được thể hiện đầy tính biểu tượng.\nMỗi thẻ bài như một “mảnh linh hồn” của vùng đất – mang năng lượng trầm lắng, gợi nhớ về cốt cách thanh cao và sự gắn bó với thiên nhiên, tổ tiên.\n\nMiền Nam: Sông Nước Chợ Quê\nMiền Nam – nơi của những dòng sông hiền hòa, tiếng rao ngọt ngào, và cuộc sống đậm chất tình quê. Công nghệ AR trên thẻ bài giúp người chơi đắm chìm vào khung cảnh ấy – bạn không chỉ nhìn mà như được sống trong nhịp sống miền quê đầy gần gũi. Sông Nước Chợ Quê là sự hoà quyện giữa cảm xúc và hình ảnh, gợi nhắc người chơi về tinh thần cởi mở, chan hòa và bản sắc phương Nam chân tình, phóng khoáng.`,
    info: {
      'Thông tin sản phẩm': 'Combo gồm 2 bộ, mỗi bộ 36 thẻ, đặc trưng văn hóa miền Trung và miền Nam. Tích hợp công nghệ AR. Đặc trưng: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội.',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường.',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },

  5: {
    name: 'BG MIỀN BẮC',
    description: `Huyền Tích Làng Xưa
Lật mở từng lá bài, bạn sẽ được dẫn lối về miền Bắc cổ kính – nơi hội tụ những văn hóa đặc sắc với con người, lễ hội, tiếng trống đình, và những làng nghề truyền thống lưu dấu thời gian.
Với công nghệ AR tích hợp, Huyền Tích Làng Xưa không chỉ là trò chơi – mà là cánh cửa đưa bạn đắm chìm vào không gian văn hóa Bắc Bộ, nơi từng tập tục, lễ hội và tiếng hát dân gian sống dậy theo cách sinh động và đầy cảm xúc.
`,
    info: {
      'Thông tin sản phẩm': 'Số thẻ: 36 thẻ/ bộ, Đặc trưng văn hóa: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội, Công nghệ tích hợp: AR',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },
  6: {
    name: 'BG MIỀN TRUNG',
    description: `Cốt Linh Trầm Phong
Giữa miền đất nắng gió và chất giọng da diết, Cốt Linh Trầm Phong mang đến cảm nhận sâu sắc về văn hóa miền Trung qua những biểu tượng thâm trầm mà thiêng liêng.
Trầm mặc nhưng không tĩnh lặng – nơi phong tục thờ cúng, tín ngưỡng dân gian, kiến trúc cổ và nghệ thuật lễ nghi được thể hiện đầy tính biểu tượng.
Mỗi thẻ bài như một “mảnh linh hồn” của vùng đất – mang năng lượng trầm lắng, gợi nhớ về cốt cách thanh cao và sự gắn bó với thiên nhiên, tổ tiên.
`,
    info: {
      'Thông tin sản phẩm': 'Số thẻ: 36 thẻ/ bộ, Đặc trưng văn hóa: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội, Công nghệ tích hợp: AR',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  },
  7: {
    name: 'BG MIỀN NAM',
    description: `Sông Nước Chợ Quê
Miền Nam – nơi của những dòng sông hiền hòa, tiếng rao ngọt ngào, và cuộc sống đậm chất tình quê. Công nghệ AR trên thẻ bài giúp người chơi đắm chìm vào khung cảnh ấy – bạn không chỉ nhìn mà như được sống trong nhịp sống miền quê đầy gần gũi. Sông Nước Chợ Quê là sự hoà quyện giữa cảm xúc và hình ảnh, gợi nhắc người chơi về tinh thần cởi mở, chan hòa và bản sắc phương Nam chân tình, phóng khoáng.
`,
    info: {
      'Thông tin sản phẩm': 'Số thẻ: 36 thẻ/ bộ, Đặc trưng văn hóa: con người, trang phục, dụng cụ, âm nhạc dân gian, làng nghề truyền thống, tín ngưỡng, lễ hội, Công nghệ tích hợp: AR',
      'Đối tượng sử dụng': 'Phù hợp với học sinh, sinh viên, người yêu văn hóa, nhà giáo dục, các gia đình và nhóm bạn. Dễ sử dụng trong hoạt động ngoại khóa, sinh hoạt văn hóa, giáo dục trải nghiệm hoặc giải trí học đường',
      'Hình thức & chất liệu': 'Thẻ bài in màu chất lượng cao, thiết kế trực quan sinh động. Hộp đựng bảo vệ sang trọng, bền đẹp. Có hướng dẫn sử dụng chi tiết đi kèm.'
    }
  }
};

export default function ProductPage() {
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  });
  const { id } = useParams();
  const productId = Number(id);
  let product = products.find((p) => p.id === productId);
  if (!product) {
    product = localAccessories.find((a) => a.id === productId);
  }
  const images = Array.isArray(product?.image) ? product.image : [product?.image];
  const [selectedImg, setSelectedImg] = useState(images[0]);
  const desc = productDescriptions[productId];
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [flyImage, setFlyImage] = useState(null);
  const [animating, setAnimating] = useState(false);
  const imgRef = React.useRef(null);
  const flyRef = React.useRef(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!product) return <div className="text-center py-12 text-lg">Không tìm thấy sản phẩm.</div>;

  // Thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    // Animation logic
    let cart = getCart();
    const existingIdx = cart.findIndex(item => item.id === product.id);
    if (existingIdx !== -1) {
      cart[existingIdx].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    // Sử dụng saveCart để lưu đúng key cho user
    if (typeof window.saveCart === 'function') {
      window.saveCart(cart);
    } else {
      // fallback nếu saveCart chưa được attach lên window
      try {
        const { saveCart } = require('../utils/cartUtils');
        saveCart(cart);
      } catch {
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
    window.dispatchEvent(new Event('cart-updated'));
    // Animation
    const imgRect = imgRef.current?.getBoundingClientRect();
    const cartFab = document.getElementById(cartFabDomId);
    if (imgRect && cartFab) {
      const cartRect = cartFab.getBoundingClientRect();
      const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
      const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
      setFlyImage({
        src: selectedImg,
        top: imgRect.top,
        left: imgRect.left,
        width: imgRect.width,
        height: imgRect.height,
        deltaX,
        deltaY,
      });
      setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setAnimating(false);
          setFlyImage(null);
        }, 1000);
      }, 10);
    } else {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  // Mua ngay: thêm vào giỏ và chuyển sang trang giỏ hàng
  const handleBuyNow = (e) => {
    handleAddToCart(e);
    setTimeout(() => navigate('/cart'), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Hàng 1 – Dòng đỏ */}
      <div className={`bg-honvietRed text-white text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center h-8 opacity-100`}>
        Giao hàng miễn phí cho thành viên của Hồn Việt
      </div>
      {/* Hàng 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-black/30 backdrop-blur-md shadow-md ">
        <div className="flex flex-row justify-between items-center gap-3 max-w-6xl mx-auto w-full">
          <div className="w-16 h-16 bg-gray-300 rounded-md">
            <img src="https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png" alt="Hồn Việt Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex gap-3 items-center">
            {user ? (
              <span className="text-gray-800 font-semibold">Xin chào {user.name} 👋</span>
            ) : (
              <span className="text-gray-800 font-semibold"></span>
            )}
            <button className="px-4 py-2 bg-honvietRed text-white rounded hover:opacity-90" onClick={() => navigate('/cart')}>
              Theo dõi đơn hàng
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center mt-2 sm:mt-0">
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-honvietGold text-white rounded hover:opacity-90 w-full sm:w-auto"
            >
              Đăng Nhập
            </button>
          )}
        </div>
      </div>
      {/* Quay lại trang chủ ở phía trái trên */}
      <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-200">
        <div className="flex mb-4 gap-2">
          <button
            className="px-4 py-2 bg-honvietGold text-black rounded font-semibold shadow hover:bg-honvietGold/80 transition"
            onClick={() => navigate("/")}
          >
            ← Quay lại trang chủ
          </button>
          <h2 className="text-2xl font-bold text-honvietRed"> - {product.name}</h2>

        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 py-8 md:py-12 px-2 md:px-4 ">
        {/* Left: Image list & main image */}
        <div className="flex flex-col gap-4 md:w-1/2">
          <div className="border-2 border-honvietGold rounded-2xl bg-white p-2 md:p-4 flex justify-center items-center shadow-xl w-full">
            <img ref={imgRef} src={selectedImg} alt={product.name} className="max-h-[260px] md:max-h-[480px] w-full md:w-auto object-contain rounded-2xl" />
          </div>
          <div className="flex gap-2 md:gap-3 justify-center mt-2 flex-wrap">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={`w-16 h-16 object-cover rounded-lg border cursor-pointer ${selectedImg === img ? 'border-honvietRed' : 'border-gray-300'}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
        </div>
        {/* Right: Info & actions */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <h2 className="text-2xl font-bold  mb-2">{product.name}</h2>
            <div className="text-xl font-bold text-honvietGold mb-2">{product.price.toLocaleString()}₫</div>
            <div className="text-gray-700 mb-4 whitespace-pre-line text-sm">{desc?.description || 'Mô tả sản phẩm đang cập nhật.'}</div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold">Số lượng:</span>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="w-16 border rounded p-1 text-center" />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-honvietRed text-white rounded font-semibold shadow hover:bg-honvietRed/80" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
              <button className="px-4 py-2 bg-honvietGold text-black rounded font-semibold shadow hover:bg-honvietGold/80" onClick={handleBuyNow}>Mua ngay</button>
              {flyImage && (
                <img
                  ref={flyRef}
                  src={flyImage.src}
                  className="fixed rounded-xl object-cover z-50 pointer-events-none"
                  style={{
                    top: flyImage.top,
                    left: flyImage.left,
                    width: flyImage.width / 2,
                    height: flyImage.height / 2,
                    transition: 'transform 1s ease-in, opacity 1s ease-in',
                    transform: animating
                      ? `translate(${flyImage.deltaX}px, ${flyImage.deltaY}px) scale(0.4)`
                      : 'none',
                    opacity: animating ? 0 : 1,
                  }}
                />
              )}
              <CartFab />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
            <h3 className="text-lg font-bold text-honvietRed mb-2">Thông tin sản phẩm</h3>
            <ul className="text-gray-700 text-sm list-disc pl-5">
              {desc?.info && Object.entries(desc.info).map(([title, value]) => (
                <li key={title}><strong>{title}:</strong> {value}</li>
              ))}
              {!desc?.info && <p>Thông tin sản phẩm đang cập nhật.</p>}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
