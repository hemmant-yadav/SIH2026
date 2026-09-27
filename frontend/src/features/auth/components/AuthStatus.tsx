import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthStatus: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return (
      <button
        onClick={() => login('kitchen_manager')}
        className="text-xs font-dmsans font-semibold text-lime hover:underline px-2 py-1"
      >
        Sign In (Cognito)
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs font-dmsans">
      <span className="text-on-surface-variant">
        <strong className="text-forest font-semibold">{user.name}</strong> ({user.role.replace('_', ' ')})
      </span>
      <button
        onClick={logout}
        className="text-outline hover:text-forest underline transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};
