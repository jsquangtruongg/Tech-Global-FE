import { createBrowserRouter } from "react-router-dom";
import HeaderLayout from "../layout/headerLayoutClient";
import HomeComponent from "../components/Client/home";
import XauPage from "../page/Client/Xau";
import MarginPage from "../page/Client/Margin";
import StudyPage from "../page/Client/Study";
import CoursePage from "../page/Client/Coures";
import CourseDetailPage from "../page/Client/Course-Detail";
import RegisterStudyPage from "../page/Client/Register-study";
import PaymentPage from "../page/Client/Payment";
import BlogPage from "../page/Client/Blog";
import RegisterPage from "../page/Auth/Register";
import AuthLayout from "../layout/authLayout";
import LoginPage from "../page/Auth/Login";
import HeaderLayoutAdmin from "../layout/headerLayoutAdmin";
import DashBoardAdminPage from "../page/Admin/DashBoard";
import PostNewAdminPage from "../page/Admin/PostNew";
import CourseAdminPage from "../page/Admin/Course";
import UserListAdminPage from "../page/Admin/User";
import RankUserAdminPage from "../page/Admin/RankUser";
import SettingsAdminPage from "../page/Admin/Settings";
import ProfileAdminPage from "../page/Admin/ProFile";
import AnalyticsAdminPage from "../page/Admin/Analytics";
import AnalyticsCoursePage from "../page/Admin/AnalyticsCourse";
import AnalyticsNewUserPage from "../page/Admin/AnalyticsNewUser";
import BlogDetailPage from "../page/Client/Blog-Detail";
import CourseUserPage from "../page/Client/Course-User";
import InterviewAdminPage from "../page/Admin/Interview";
import CourseStudyPage from "../page/Client/Course-Study";
import StudyAdminPage from "../page/Admin/Study";
import BotTradePage from "../page/Bot-Trade";
import BuyBotPage from "../page/Client/Buy-Bot";
import BotTradeProductAdminPage from "../page/Admin/Bot-Trade-Product";
const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    path: "/",
    children: [
      {
        element: <HomeComponent />,
        path: "/home",
      },
      {
        element: <XauPage />,
        path: "/xau",
      },
      {
        element: <MarginPage />,
        path: "/margin",
      },
      {
        element: <StudyPage />,
        path: "/study",
      },
      {
        element: <CoursePage />,
        path: "/course",
      },
      {
        element: <CourseDetailPage />,
        path: "/course-detail/:id",
      },
      {
        element: <RegisterStudyPage />,
        path: "/register-study",
      },
      {
        element: <PaymentPage />,
        path: "/payment",
      },
      {
        element: <PaymentPage />,
        path: "/payment/success",
      },
      {
        element: <PaymentPage />,
        path: "/payment/cancel",
      },
      {
        element: <BlogPage />,
        path: "/blog",
      },
      {
        element: <BlogDetailPage />,
        path: "/blog-detail/:id",
      },
      {
        element: <CourseUserPage />,
        path: "/course-user",
      },
      {
        element: <BotTradePage />,
        path: "/bot-trade",
      },
      {
        element: <CourseStudyPage />,
        path: "/course-study/:id",
      },
      {
        element: <BuyBotPage />,
        path: "/buy-bot",
      },
    ],
  },

  {
    element: <AuthLayout />,
    path: "/",
    children: [
      {
        element: <RegisterPage />,
        path: "/register",
      },
      {
        element: <LoginPage />,
        path: "/login",
      },
    ],
  },
  {
    element: <HeaderLayoutAdmin />,
    path: "/admin",
    children: [
      {
        element: <DashBoardAdminPage />,
        path: "dashboard",
      },
      {
        element: <PostNewAdminPage />,
        path: "post-new",
      },
      {
        element: <CourseAdminPage />,
        path: "course",
      },
      {
        element: <UserListAdminPage />,
        path: "users/list",
      },
      {
        element: <UserListAdminPage />,
        path: "users/admin",
      },
      {
        element: <UserListAdminPage />,
        path: "users/staff",
      },
      {
        element: <UserListAdminPage />,
        path: "users/customer",
      },
      {
        element: <RankUserAdminPage />,
        path: "users/permission",
      },
      {
        element: <ProfileAdminPage />,
        path: "profile",
      },
      {
        element: <SettingsAdminPage />,
        path: "settings",
      },
      {
        element: <AnalyticsAdminPage />,
        path: "analytics",
      },
      {
        element: <AnalyticsCoursePage />,
        path: "analytics-course",
      },
      {
        element: <AnalyticsNewUserPage />,
        path: "analytics-new-user",
      },
      {
        element: <InterviewAdminPage />,
        path: "interview",
      },
      {
        element: <StudyAdminPage />,
        path: "study",
      },
      {
        element: <BotTradeProductAdminPage />,
        path: "bot-products",
      },
    ],
  },
]);

export default router;
