import AutoSlider from '../components/AutoSlider';
import ProductCarousel from '../components/ProductCarousel';
import AccessoriesSection from '../components/AccessoriesSection';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import FeedbackSurvey from '../components/FeedbackSurvey';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <Header />
            {/* Body phía dưới header */}
            <div className="pt-[180px]">
                <AutoSlider />

                {/* 👇 Thêm id để scroll đến */}
                <div id="section-products" className="scroll-mt-[140px]">
                    <ProductCarousel />
                </div>

                <div id="section-accessories" className="scroll-mt-[140px]">
                    <AccessoriesSection />
                </div>

                <div id="section-blog" className="scroll-mt-[140px]">
                    <BlogSection />
                </div>


                <Footer />
                <FeedbackSurvey />
            </div>



        </div>
    );
};

export default Home;
