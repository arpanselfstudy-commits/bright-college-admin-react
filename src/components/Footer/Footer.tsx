import Link from '@mui/material/Link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <div className="footer-wrapper pt-[40px] mt-[auto]">
      <footer className="flex justify-end items-center py-[13px] px-[50px] footer-dash gap-6">
        <span className="footer-built-by">Built by Arpan Ghosh</span>
        <ul className="flex items-center gap-4">
          <li>
            <Link
              href="https://www.linkedin.com/in/arpan-ghosh-998554270/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              underline="none"
            >
              <FaLinkedin style={{ fontSize: 15, marginRight: 5, verticalAlign: 'middle' }} />
              LinkedIn
            </Link>
          </li>
          <li className="footer-dot" />
          <li>
            <Link
              href="https://github.com/arpanselfstudy-commits/bright-college-admin-react"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              underline="none"
            >
              <FaGithub style={{ fontSize: 15, marginRight: 5, verticalAlign: 'middle' }} />
              Admin Panel Repo
            </Link>
          </li>
          <li className="footer-dot" />
          <li>
            <Link
              href="https://github.com/arpanselfstudy-commits/bright-college-hub-next"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              underline="none"
            >
              <FaGithub style={{ fontSize: 15, marginRight: 5, verticalAlign: 'middle' }} />
              User App Repo
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
