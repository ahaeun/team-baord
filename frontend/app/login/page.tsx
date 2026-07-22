'use client';

import { naverLoginUrl, slackLoginUrl } from '@/lib/api/auth';
import './login.css';
import '../shared.css';

export default function LoginPage() {
  return (
    <main>
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form action="#">
            <div className='half left'>

            </div>
            <div className='half'>
              <h2>LOGIN</h2>
              <span>Please proceed with login using Naver or Slack.</span>

              <div className="social-container">
                <button
                  type="button"
                  className="cir-search__kbd login-btn"
                  onClick={() => (window.location.href = naverLoginUrl())}
                >
                  NAVER
                </button>
                <button
                  type="button"
                  className="cir-search__kbd login-btn"
                  onClick={() => (window.location.href = slackLoginUrl())}
                >
                  SLACK
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
