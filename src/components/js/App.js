import React, { useLayoutEffect, useState } from 'react';
import '../css/App.css';
import SideBox from './sideBox';
import ChatBox from './chatBox';
import LogIn from './logIn';
import AppHeader from './AppHeader';
import { useStateValue } from './stateProvider';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [{ user }] = useStateValue();

  function useWindowWidth() {
    const [width, setWidth] = useState(window.screen.width);
    useLayoutEffect(() => {
      function updateWidth() {
        setWidth(window.screen.width);
      }
      window.addEventListener('resize', updateWidth);
      updateWidth();
      return () => window.removeEventListener('resize', updateWidth);
    }, []);
    return width;
  };
  const width = useWindowWidth();

  return (
    <div className="app">
      <Router>
        {user ? (
          <>
            <AppHeader />
            <div className="app_body">
              <Switch>
                <Route path="/rooms/:roomId">
                  {width > 600 && <SideBox />}
                  <ChatBox />
                </Route>
                <Route path="/">
                  <SideBox />
                  {width > 600 && <ChatBox />}
                </Route>
              </Switch>
            </div>
          </>
        ) : (
          <LogIn />
        )}
      </Router>
    </div >
  );
}

export default App;