import React, { useState } from 'react';
import Login from './Login';
import MapView from './MapView';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? (
        <MapView user={user} onLogout={() => setUser(null)} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </>
  );
}

export default App;
