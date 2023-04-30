import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Frontside from './Frontside';
import NotFound from './NotFound.js';
import Dashboard from './Dashboard';
import Storage from './Storage';
import Login from './Login';
import Public from './middleware/Public';
import Private from './middleware/Private';
import RoleOne from './middleware/RoleOne';
import RoleTwo from './middleware/RoleTwo';
import RoleThree from './middleware/RoleThree';
import RoleFour from './middleware/RoleFour';
import Backside from './Backside';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Public><Login/></Public>} />
            <Route path="/*" element={<RoleFour> <Frontside/> </RoleFour>}/>
            <Route path="/admin/*" element={<RoleOne> <Dashboard/> </RoleOne>} />
            <Route path='/storage/*' element={<RoleTwo> <Storage/> </RoleTwo>}/>
            <Route path='/chef/*' element={<Backside/>}/>
            <Route path="*" element={<Private> <NotFound/> </Private>}/>
        </Routes>
      </BrowserRouter>

      
    </div>
  );
}

export default App;
