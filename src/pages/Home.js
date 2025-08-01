
import AutoSlider from '../components/AutoSlider';
import CompanyIntro from '../components/CompanyIntro';
import ProductCarousel from '../components/ProductCarousel';
import AccessoriesSection from '../components/AccessoriesSection';
// import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import FeedbackSurvey from '../components/FeedbackSurvey';
import BlogSlider from '../components/BlogSection2';

import MessengerFab from '../components/MessengerFab';


const PAGE_ID = '100063899073726'; // Thay bằng page id thật của bạn
const FB_MESSENGER_LINK = `https://m.me/${PAGE_ID}`;
const FB_MESSENGER_APP = `fb-messenger://user-thread/${PAGE_ID}`;

function openMessenger() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = FB_MESSENGER_APP;
    setTimeout(() => {
      window.open(FB_MESSENGER_LINK, '_blank');
    }, 800);
  } else {
    window.open(FB_MESSENGER_LINK, '_blank');
  }
}

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <Header />
      {/* Body phía dưới header */}
      <div className="pt-[180px]">

        <AutoSlider />
        <CompanyIntro />

        {/* 👇 Thêm id để scroll đến */}
        <div id="section-products" className="scroll-mt-[140px]">
          <ProductCarousel />
        </div>

        <div id="section-accessories" className="scroll-mt-[140px]">
          <AccessoriesSection />
        </div>

        <div id="section-blog" className="scroll-mt-[140px]">
          <BlogSlider />
        </div>

        <Footer />
        <FeedbackSurvey />

        <MessengerFab />
      </div>
    </div>
  );
};

export default Home;
