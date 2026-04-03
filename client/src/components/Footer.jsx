import { MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f5] pt-16 pb-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Collections */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gray-800 mb-6 uppercase">Collections</h3>
          <ul className="space-y-3 text-[11px] font-medium text-gray-500 tracking-wide">
            {['Black teas', 'Green teas', 'White teas', 'Herbal teas', 'Matcha', 'Chai', 'Oolong', 'Rooibos', 'Teaware'].map((item) => (
              <li key={item} className="hover:text-black transition-colors cursor-pointer">
                <Link to={`/collections/${item.toLowerCase().replace(' ', '-')}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gray-800 mb-6 uppercase">Learn</h3>
          <ul className="space-y-3 text-[11px] font-medium text-gray-500 tracking-wide">
            {['About us', 'About our teas', 'Tea academy'].map((item) => (
              <li key={item} className="hover:text-black transition-colors cursor-pointer">{item}</li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gray-800 mb-6 uppercase">Customer Service</h3>
          <ul className="space-y-3 text-[11px] font-medium text-gray-500 tracking-wide">
            {['Ordering and payment', 'Delivery', 'Privacy and policy', 'Terms & Conditions'].map((item) => (
              <li key={item} className="hover:text-black transition-colors cursor-pointer">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-gray-800 mb-6 uppercase">Contact Us</h3>
          <ul className="space-y-5 text-[11px] font-medium text-gray-500 tracking-wide">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span>3 Falahi, Falahi St, Pasdaran Ave,<br />Shiraz, Fars Province,<br />Iran</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Email: amoopur@gmail.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Tel: +98 9173038406</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
