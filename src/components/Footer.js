import React from 'react';
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white mt-12 text-sm text-gray-800">
    {/* <footer className="bg-white mt-12 text-sm text-gray-800 relative mx-auto max-w-[1280px] px-0 select-none my-16"> */}


      {/* Hàng 1 - Đăng ký nhận tin */}
      <div className="bg-honvietRed text-white px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="text-center lg:text-left">
          <div className="text-xl font-bold">ĐĂNG KÝ NHẬN TIN TỪ HỒN VIỆT</div>
          <div className="text-sm mt-1">Nhận thông tin sản phẩm mới nhất và các chương trình khuyến mãi.</div>
        </div>
        <div className="w-full max-w-md flex">
          <input
            type="email"
            placeholder="Nhập địa chỉ email"
            className="flex-1 px-4 py-2 rounded-l-full text-gray-800 focus:outline-none"
          />
          <button className="bg-black text-white px-5 py-2 rounded-r-full hover:opacity-90">
            Đăng ký
          </button>
        </div>
      </div>

      {/* Hàng 2 - Grid thông tin */}
      <div className="px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Logo + giới thiệu */}
        <div>
          <div className="w-16 h-16 bg-honvietRed rounded flex items-center justify-center text-white text-2xl font-bold mb-3">
            <img src="https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png" alt="Hồn Việt Logo" className="w-full h-full object-cover" />  
          </div>
          <p className="text-gray-700">
            Hồn Việt – chạm vào bản sắc, giữ lấy tinh hoa
          </p>
          <div className="flex mt-4 gap-3 text-white">
            <a href="#" className="bg-honvietRed w-8 h-8 flex items-center justify-center rounded hover:bg-honvietGold"><FaFacebookF /></a>
            <a href="#" className="bg-honvietRed w-8 h-8 flex items-center justify-center rounded hover:bg-honvietGold"><FaInstagram /></a>
            <a href="#" className="bg-honvietRed w-8 h-8 flex items-center justify-center rounded hover:bg-honvietGold"><FaTiktok /></a>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <div className="font-bold mb-2">THÔNG TIN LIÊN HỆ</div>
          <p>Địa chỉ: 04 Liễu Giai - Cống Vị - Ba Đình - Hà Nội</p>
          <p className="mt-2">Điện thoại: <span className="text-honvietRed font-bold">038 282 9000</span></p>
          <p>Email: <a href="mailto:Honviet36@gmail.com" className="text-honvietRed font-bold">Honviet36@gmail.com</a></p>
        </div>

        {/* Chính sách */}
        <div>
          <div className="font-bold mb-2">CHÍNH SÁCH</div>
          <ul className="space-y-1">
            <li>• Chính sách bảo mật</li>
            <li>• Chính sách vận chuyển</li>
            <li>• Chính sách đổi trả</li>
            <li>• Quy định sử dụng</li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <div className="font-bold mb-2">HỖ TRỢ</div>
          <ul className="space-y-1">
            <li>• Hướng dẫn mua hàng</li>
            <li>• Hướng dẫn thanh toán</li>
            <li>• Hướng dẫn giao nhận</li>
            <li>• Điều khoản dịch vụ</li>
          </ul>
        </div>
      </div>

      {/* Hàng 3 - thông tin cuối */}
      <div className="text-center text-xs text-gray-600 px-4 pb-6">
        <p className="mb-1">
          CÔNG TY TNHH EVERJOY PUBLISHING Trụ sở tại: đại học FPT, Khu Công Nghệ Cao Hòa Lạc, km 29, Đại lộ, Thăng Long, Hà Nộii
        </p>
        <p>
          Giấy chứng nhận đăng ký kinh doanh số 0107001119 Do Sở Kế hoạch và đầu tư TP Hà Nội cấp ngày 21/09/2015, sửa đổi lần thứ 7 ngày 16/02/2023
        </p>
      </div>
    </footer>
  );
}
