import { createContext, useContext, useState } from 'react';

interface UserContextType {
  copyUserTag: (tag: string) => void;
  copySuccess: boolean;
}

export const UserContext = createContext<UserContextType>({
  copyUserTag: () => {},
  copySuccess: false
});

export const useUserTag = () => useContext(UserContext);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to copy user tag to clipboard
  const copyUserTag = (tag: string) => {
    navigator.clipboard.writeText(tag)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <UserContext.Provider value={{ copyUserTag, copySuccess }}>
      {children}
      {/* Copy success notification */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-out">
          User tag copied to clipboard!
        </div>
      )}
    </UserContext.Provider>
  );
};
