import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-white py-8 mt-auto">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* College Info */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">كلية الدراسات العليا للبحوث الإحصائية</h3>
            <address className="not-italic text-gray-300 text-[13px]">
              <p>جامعة القاهرة - الجيزة - مصر</p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">روابط مهمة</h3>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-[13px]">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/tracks" className="text-gray-300 hover:text-white transition-colors text-[13px]">
                  البرامج الدراسية
                </Link>
              </li>
              <li>
                <Link to="/registration" className="text-gray-300 hover:text-white transition-colors text-[13px]">
                  التسجيل
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[15px] font-semibold mb-3">تواصل معنا</h3>
            <div className="space-y-1.5 text-gray-300 text-[13px]">
              <p>هاتف: 023456789</p>
              <p>البريد الإلكتروني: info@cu-stat.edu.eg</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-700/50 text-center text-[12px] text-gray-400">
          © {new Date().getFullYear()} كلية الدراسات العليا للبحوث الإحصائية - جامعة القاهرة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
