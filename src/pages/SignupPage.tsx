import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const hasSequential = (str: string) => {
    if (str.length < 3) return false;
    for (let i = 0; i <= str.length - 3; i++) {
      const char1 = str.charCodeAt(i);
      const char2 = str.charCodeAt(i + 1);
      const char3 = str.charCodeAt(i + 2);
      if (char1 + 1 === char2 && char2 + 1 === char3) {
        return true;
      }
      if (char1 - 1 === char2 && char2 - 1 === char3) {
        return true;
      }
    }
    return false;
  };

  const passwordConditions = {
    length: password.length >= 8,
    number: /[0-9]/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    noSequential:
      password.length > 0 &&
      !hasSequential(password) &&
      !/(.)\1{2,}/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }
    try {
      await signUp({ name, email: `${email}@snu.ac.kr`, password });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="password-container">
          <label>비밀번호</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-button"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 0-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {passwordFocused && (
          <div>
            <p>
              {passwordConditions.length ? '✓' : '✗'} 비밀번호 8자리 이상(필수)
            </p>
            <p>{passwordConditions.number ? '✓' : '✗'} 숫자 포함</p>
            <p>
              {passwordConditions.upper && passwordConditions.lower ? '✓' : '✗'}{' '}
              영문 대소문자 포함
            </p>
            <p>{passwordConditions.special ? '✓' : '✗'} 특수문자 포함</p>
            <p>
              {passwordConditions.noSequential ? '✓' : '✗'} 연속된 문자열이나
              숫자가 없어야 함
            </p>
          </div>
        )}
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <div className="email-container">
          <label>이메일</label>
          <div className="email-input-wrapper">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="email-domain">@snu.ac.kr</span>
          </div>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignupPage;
