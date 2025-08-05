
import AutoSlider from '../components/AutoSlider';
import CompanyIntro from '../components/CompanyIntro';
import ProductCarousel from '../components/ProductCarousel';
import AccessoriesSection from '../components/AccessoriesSection';
// import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import BlogSlider from '../components/BlogSection2';
import ARFeedbackSurvey from '../components/ARFeedbackSurvey';

import MessengerFab from '../components/MessengerFab';


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

        {/* AR Feedback Survey Section */}
        <div id="section-ar-feedback" className="scroll-mt-[140px] bg-gray-50">
          <ARFeedbackSurvey />
        </div>

        <Footer />

        <MessengerFab />
      </div>
    </div>
  );
};

export default Home;
