import { useContext } from 'react';
import { UserContext } from './userContextValue';

export const useUserTag = () => useContext(UserContext);
