import { createContext } from 'react';

interface UserContextType {
  copyUserTag: (tag: string) => void;
  copySuccess: boolean;
}

// Create a context for user tag copying functionality
export const UserContext = createContext<UserContextType>({
  copyUserTag: () => {},
  copySuccess: false
});
