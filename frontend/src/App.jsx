import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Auth/Login'
import PageNotFound from './Auth/PageNotFound'
import Dashboard from './Dashboard/Dashboard'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='*' element={<PageNotFound/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
