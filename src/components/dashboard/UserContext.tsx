import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface UserContextProps {
  copyUserTag: (tag: string) => void;
}

const UserContext = createContext<UserContextProps>({
  copyUserTag: () => {}
});

interface UserProviderProps {
  children: ReactNode;
  value: UserContextProps;
}

// Export a provider component as default for better Fast Refresh support
export default function UserProvider({ children, value }: UserProviderProps) {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Export the hook separately
export const useUserContext = () => useContext(UserContext);
