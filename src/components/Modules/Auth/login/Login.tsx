import React from 'react';
import './auth.css';

import useLogin from './useLogin';
import FormField from '../../../Common/form/FormField';
import CustomButton from '../../../Common/custombutton/CustomButton';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Login: React.FC = () => {
  const { formMethods, loading, onSubmit } = useLogin();
  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <section className="log-Reg-Wrap">
      <div className="grid grid-cols-2 h-full login-grid">
        {/* Left Side Logo and Info */}
        <div className="logoReg-Bg">
          <div className="log-reg-lt">
            <div className="log-reg-info-lt">
              <h3>Welcome to</h3>
              <h2 className="text-white text-4xl font-bold mb-4">Bright College Hub</h2>
              <p>
                Empowering your academic journey with a modern campus experience.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side Login Form */}
        <div className="logright-content">
          <div className="log-Reg-Right w-full">
            <div className="logo-log-Reg">
              <p className="text-accent-blue font-semibold">The heartbeat of your Academic Atelier</p>
            </div>
            <div className="heading-block">
              <h1>Login</h1>
              <p>
                Connect with your campus, manage tasks, and stay updated effortlessly.
              </p>
            </div>
            {/* Credentials box — after heading/subtext, before inputs */}
            <div className="demo-credentials">
              <p className="demo-credentials-title">Credentials</p>
              <div className="demo-credentials-row">
                <span className="demo-credentials-label">Email</span>
                <span className="demo-credentials-value">collage-admin@yopmail.com</span>
              </div>
              <div className="demo-credentials-row">
                <span className="demo-credentials-label">Password</span>
                <span className="demo-credentials-value">12345678</span>
              </div>
            </div>
            <div className="form-main">
              <form onSubmit={onSubmit}>
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  register={register('email')}
                  error={errors.email?.message}
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  register={register('password')}
                  error={errors.password?.message}
                />
                <div className="full-width">
                  <CustomButton
                    label={loading ? 'Logging in...' : 'Login'}
                    variant="contained"
                    className="btn full-btn"
                    type="submit"
                    disabled={loading}
                  />
                </div>
              </form>
              {/* Author links — immediately below the login button */}
              <div className="log-copyrht log-copyrht-inline">
                <p className="log-copyrht-name">Arpan Ghosh</p>
                <div className="log-copyrht-links">
                  <a
                    href="https://www.linkedin.com/in/arpan-ghosh-998554270/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="log-copyrht-link"
                  >
                    <FaLinkedin className="log-copyrht-icon" />
                    LinkedIn
                  </a>
                  <span className="log-copyrht-divider" />
                  <a
                    href="https://github.com/arpanselfstudy-commits/bright-college-admin-react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="log-copyrht-link"
                  >
                    <FaGithub className="log-copyrht-icon" />
                    Admin Panel Repo
                  </a>
                  <span className="log-copyrht-divider" />
                  <a
                    href="https://github.com/arpanselfstudy-commits/bright-college-hub-next"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="log-copyrht-link"
                  >
                    <FaGithub className="log-copyrht-icon" />
                    User App Repo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
