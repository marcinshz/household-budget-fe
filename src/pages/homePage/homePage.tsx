import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.css'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import Overview from "./components/overview/overview";
import Navbar from "./components/navbar/navbar";

function HomePage() {
  const user = useSelector((state: RootState) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.id) {
      const username = localStorage.getItem("username");
      const id = localStorage.getItem("id");
      const password = localStorage.getItem("password");
      const access_token = localStorage.getItem("access_token");

      if (username && id && password && access_token) dispatch(setUser({ username, id, password, access_token }))
      else navigate('/login');
    }
  }, [])


  return (
    <div className="home-page">
      <Navbar user={user}/>
      <Overview userId={user.id} />
    </div>
  )
}

export default HomePage
