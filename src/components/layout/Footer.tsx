import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="container-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* College Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">كلية الدراسات العليا للبحوث الإحصائية</h3>
            <address className="not-italic">
              <p>جامعة القاهرة - الجيزة - مصر</p>
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط مهمة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-gray-300 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/tracks" className="hover:text-primary transition-colors">
                  البرامج الدراسية
                </Link>
              </li>
              <li>
                <Link to="/registration" className="hover:text-gray-300 transition-colors">
                  التسجيل
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <div className="space-y-2">
              <p>هاتف: 023456789</p>
              <p>البريد الإلكتروني: info@cu-stat.edu.eg</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} كلية الدراسات العليا للبحوث الإحصائية - جامعة القاهرة. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
