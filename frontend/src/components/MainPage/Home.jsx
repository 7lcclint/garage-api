import Footer from "./Footer"
import MainPage from "./MainPage"
import Navbar from "./Navbar"
import Work from "./Work"
function Home() {
  return (
    <div className="home-container white-text">
      <Navbar/>
      <MainPage/>
      <Work/>
      <Footer/>
    </div>
  )
}

export default Home
