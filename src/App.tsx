import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import BasicTables from "./pages/Tables/BasicTables";
import Followers from "./pages/Users/Followers";
import Following from "./pages/Users/Following";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { useTheme } from "./context/ThemeContext";
import UserProfile from "./pages/Users/UserProfile";
import UsersList from "./pages/Users/UsersList";
import PostsList from "./pages/Posts/PostsList";

export default function App() {
  const { theme } = useTheme();

  return (
    <>
      <Router>
        <ScrollToTop />
        <ToastContainer
          position="bottom-center"
          autoClose={4000}
          closeOnClick={true}
          pauseOnHover={true}
          theme={theme}
        />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

            {/* Others Page */}
            <Route path="/" element={<PostsList />} />

            <Route path="users">
              <Route path="" element={<UsersList />} />
              <Route path="followers" element={<Followers />} />
              <Route path="following" element={<Following />} />
              <Route path=":id/profile" element={<UserProfile />} />
            </Route>
            <Route path="/posts" element={<PostsList />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
