import { Link } from 'react-router-dom';
import { Gift, Truck, Tag } from 'lucide-react';
import heroImg from '../assets/Landing Main Image.png';

const CupIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
    <line x1="2" x2="22" y1="21" y2="21"></line>
  </svg>
);

// Import collection images
import img0 from '../assets/Image Holder.png';
import img1 from '../assets/Image Holder (1).png';
import img2 from '../assets/Image Holder (2).png';
import img3 from '../assets/Image Holder (3).png';
import img4 from '../assets/Image Holder (4).png';
import img5 from '../assets/Image Holder (5).png';
import img6 from '../assets/Image Holder (6).png';
import img7 from '../assets/Image Holder (7).png';
import img8 from '../assets/Image Holder (8).png';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-[85vh] bg-white">
        {/* Left side: Image layout */}
        <div className="md:w-1/2 relative bg-gray-100 h-full">
          {/* Hero image representation matching Figma */}
          <div className="absolute inset-0 bg-contain bg-center" style={{backgroundImage: `url('${heroImg}')` }}>
          </div>
        </div>
        
        {/* Right side: Text content */}
        <div className="md:w-1/2 flex items-center justify-center p-12 md:p-24">
          <div className="max-w-md space-y-8">
            <h1 className="text-4xl md:text-5xl text-gray-900 leading-tight font-prosto">
              Every day is unique,<br/>just like our tea
            </h1>
            <div className="space-y-4 text-gray-500 font-medium leading-relaxed text-sm">
              <p>
                Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
              </p>
            </div>
            <Link to="/collections">
              <button className="bg-[#282828] text-white px-8 py-3 text-xs font-semibold tracking-widest transition-colors uppercase mt-4">
                BROWSE TEAS
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#f5f5f5] py-16 flex flex-col mt-20 items-center">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 lg:gap-24 mb-10 px-6 max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 text-gray-700">
            <CupIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold tracking-wider">450+ KIND OF LOOSEF TEA</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Gift className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold tracking-wider">CERTIFICATED ORGANIC TEAS</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Truck className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold tracking-wider">FREE DELIVERY</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <Tag className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold tracking-wider">SAMPLE FOR ALL TEAS</span>
          </div>
        </div>
        
        <button className="border border-gray-400 text-gray-700 hover:bg-gray-200 px-8 py-3 text-xs font-semibold tracking-widest transition-colors uppercase">
          LEARN MORE
        </button>
      </div>

      {/* Our Collections Section */}
      <div className="py-20 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 text-gray-800 tracking-wide font-prosto">Our Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[
            { name: "BLACK TEA", img: img0, code: "BLACK TEA" },
            { name: "GREEN TEA", img: img1, code: "GREEN TEA" },
            { name: "WHITE TEA", img: img2, code: "WHITE TEA" },
            { name: "MATCHA", img: img3, code: "MATCHA" },
            { name: "HERBAL TEA", img: img4, code: "HERBAL TEA" },
            { name: "CHAI", img: img5, code: "CHAI" },
            { name: "OOLONG", img: img6, code: "OOLONG" },
            { name: "ROOIBOS", img: img7, code: "ROOIBOS" },
            { name: "TEAWARE", img: img8, code: "TEAWARE" },
          ].map((item, idx) => (
            <Link
              to={`/collections?category=${item.code}`}
              key={idx}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-full aspect-square mb-5 overflow-hidden shadow-sm">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                />
              </div>
              <span className="text-[11px] md:text-xs font-bold tracking-widest text-gray-700 uppercase">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
