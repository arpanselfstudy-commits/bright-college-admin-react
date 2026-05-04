import { useState } from 'react';
import { FaShopify } from 'react-icons/fa';
import { MdWork, MdOutlineContentPaste, MdDashboard } from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../../store/auth.store';
import ConfirmModal from '../Common/ConfirmModal/ConfirmModal';
import AuthApi from '../../service/apis/Auth.api';

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutConfirm = async () => {
    try {
      await AuthApi.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Something went wrong.');
    }
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1200) toggleSidebar();
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header flex justify-between items-center mb-6 lg:mb-0">
          <button className="sidebar-close" onClick={toggleSidebar}>✕</button>
        </div>
        <div className="sidebarmenu">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                end
                onClick={handleNavClick}
                className={({ isActive }) => `rounded-[10px] flex ${isActive ? 'active' : ''}`}
              >
                <span><MdDashboard size={24} /></span>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/shop-management"
                end
                onClick={handleNavClick}
                className={({ isActive }) => `rounded-[10px] flex ${isActive ? 'active' : ''}`}
              >
                <span><FaShopify size={24} /></span>
                Shop Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/job-management"
                end
                onClick={handleNavClick}
                className={({ isActive }) => `rounded-[10px] flex ${isActive ? 'active' : ''}`}
              >
                <span><MdWork size={24} /></span>
                Job Management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cms"
                end
                onClick={handleNavClick}
                className={({ isActive }) => `rounded-[10px] flex ${isActive ? 'active' : ''}`}
              >
                <span><MdOutlineContentPaste size={24} /></span>
                CMS
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                style={{ padding: '18px 20px', transition: 'var(--common-transition)', color: 'var(--white-color)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                className="rounded-[10px] flex items-center hover:bg-white hover:text-[var(--primary-color)] hover:font-semibold group"
              >
                <span className="mr-[10px] group-hover:[filter:none]" style={{ filter: 'brightness(0) invert(1)' }}>
                  <IoMdLogOut size={24} />
                </span>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <ConfirmModal
        open={showLogoutModal}
        title="Log out?"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        cancelLabel="Cancel"
        icon={<IoMdLogOut />}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;
