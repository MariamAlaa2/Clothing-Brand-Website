import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/home';
import Navbar from './components/nav';
import Shop from './components/shop';
import ItemDetails from './components/itemDetails';
import ViewCart from './components/viewCart';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Navbar/>

       <div className="pages">
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/brand/shop/:category" element={<Shop/>}/>
        <Route path="/itemDetails/:itemId" element={<ItemDetails/>}/>
        <Route path="/viewcart" element={<ViewCart/>}/>
       </Routes>
       </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
