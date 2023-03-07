import './App.css';
import styled from 'styled-components';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home';
import { RequireAuth } from 'react-auth-kit';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
