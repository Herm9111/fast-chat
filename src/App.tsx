import './App.css';
import Landing from './pages/landing';
import FastChat from './pages/fast-chat';
import { createContext, useEffect, useMemo, useState } from 'react';
import UserContextClient from './clients/user-context-client';
import { IUser } from '../api/common/interfaces/user-interface';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const emptyUserObject: IUser = {
  claims: [],
  identityProvider: '',
  userDetails: '',
  userId: '',
  userRoles: []
}

export const UserContext = createContext<IUser>(emptyUserObject);

function App() {
  const userContextClient = useMemo(() => new UserContextClient(), []);
  const [userData, setUserData] = useState<IUser>(emptyUserObject);

  useEffect(() => {
    userContextClient.getUserInfo()
      .then(setUserData)
  }, [userContextClient]);

  return (
    <UserContext.Provider value={userData}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:roomId" element={
            <UserContext.Consumer>
              {(userData) => <FastChat userData={userData}/>}
            </UserContext.Consumer>
          }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

