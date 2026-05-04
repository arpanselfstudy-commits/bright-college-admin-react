import React from 'react';
import './auth.css';

import useLogin from './useLogin';
import FormField from '../../../Common/form/FormField';
import CustomButton from '../../../Common/custombutton/CustomButton';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { formMethods, loading, onSubmit } = useLogin();
  const {
    register,
    formState: { errors },
  } = formMethods;

  return (
    <section className="log-Reg-Wrap">
      <div className="grid grid-cols-2 gap-4">
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
                Connect with your campus, manage tasks, and <br />
                stay updated effortlessly.
              </p>
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
            </div>
          </div>
          <div className="log-copyrht">
            <p>
              ©2026 <Link to={''}>Bright College Hub</Link>, All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
