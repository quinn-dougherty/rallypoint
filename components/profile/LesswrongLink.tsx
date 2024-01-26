import React, { useState } from 'react';
import { GetUser } from "@/utils/userData";

const LesswrongLink = () => {
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = await GetUser();
    const userid = user.id;

    try {
      const response = await fetch('/api/lesswrong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, userid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to authenticate');
      }

      const data = await response.json();
      if (data.token && data.userProfile) {
        setIsLinked(true);
        setShowSignInDialog(false);

        if (error) {
          console.error('Profile update failed', error);
          setError('Profile update failed');
        }

      } else {
        setError('Incorrect username or password');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <button
        className={`select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none ${isLinked ? 'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none' : ''}`}
        type="button"
        onClick={() => setShowSignInDialog(true)}
        disabled={isLinked}
      >
        Link Lesswrong Account
      </button>

      {showSignInDialog && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative mx-auto w-full max-w-[24rem] flex flex-col rounded-xl bg-white shadow-md">
            <div className="flex flex-col gap-4 p-6">
              <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900">
                Link Lesswrong Account
              </h4>
              <form onSubmit={handleSignIn}>
                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 text-blue-gray-700 outline-none focus:border-2 focus:border-gray-900"
                    placeholder="Lesswrong Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="relative h-11 w-full min-w-[200px]">
                  <input
                    className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 text-blue-gray-700 outline-none focus:border-2 focus:border-gray-900"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                  className="block w-full select-none rounded-lg bg-gradient-to-tr from-gray-900 to-gray-800 py-3 px-6 text-center font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LesswrongLink;
