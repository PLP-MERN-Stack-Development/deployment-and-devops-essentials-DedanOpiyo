// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Blog
import EditPost from "./pages/EditPost";
import CreatePost from "./pages/CreatePost";
import PostList from "./pages/PostList";
import SinglePost from "./pages/SinglePost";
import CategoryManager from "./pages/CategoryManager";

// Clinic / Doctor Pages

// Doctor Public
import DoctorDirectory from "./pages/DoctorDirectory";
import DoctorPublicProfile from "./pages/DoctorPublicProfile";

// Doctor Dashboard
import DoctorDashboard from "./pages/doctor/DoctorDashboard";   // NEW
import DoctorProfileEditor from "./pages/doctor/DoctorProfileEditor"; // NEW
import DoctorAvailability from "./pages/doctor/DoctorAvailability";   // moved
import DoctorAppointments from "./pages/doctor/DoctorAppointments";   // moved
import DoctorExperienceEditor from "./pages/doctor/DoctorExperienceEditor"; // NEW
import DoctorFeeEditor from "./pages/doctor/DoctorFeeEditor"; // NEW

// Patient
import MyAppointments from "./pages/MyAppointments";
import BookAppointment from "./pages/BookAppointment";

// Help Pages
import HelpHome from "./pages/help/HelpHome";
import ReportIssue from "./pages/help/ReportIssue";
import HelpPartPage from "./pages/help/HelpPartPage";

// Admin Help
import AdminHelpParts from "./components/admin/AdminHelpParts";
import AdminHelpIssues from "./components/admin/AdminHelpIssues";

// Admin
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminBlogs from "./components/admin/AdminBlogs";
import AdminDoctors from "./components/admin/AdminDoctors";
import AdminDoctorEditor from "./components/admin/AdminDoctorEditor";
import PromoteToDoctor from "./components/admin/PromoteToDoctor";
import AdminSpecialties from "./components/admin/AdminSpecialties";
import AdminHospitals from "./components/admin/AdminHospitals";
import AdminLocations from "./components/admin/AdminLocations";

import AdminFeePolicies from "./pages/admin/AdminFeePolicies";

// Payment
import PaymentHistory from "./pages/payment/PaymentHistory";
import PaymentReceipt from "./pages/payment/PaymentReceipt";

// Notification
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />

          {/* BLOG */}
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<SinglePost />} />
          <Route path="/posts/create" element={
            <ProtectedRoute allowedRoles={["admin","doctor"]}>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute allowedRoles={["admin","doctor"]}>
              <EditPost />
            </ProtectedRoute>
          } />

          {/* CATEGORY */}
          <Route path="/categories" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CategoryManager />
            </ProtectedRoute>
          } />

          {/* DOCTOR PUBLIC */}
          <Route path="/doctor/directory" element={<DoctorDirectory />} />
          <Route path="/doctor/:id" element={<DoctorPublicProfile />} />   {/* PUBLIC */}

          {/* DOCTOR DASHBOARD ROUTES */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard/profile" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorProfileEditor />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard/availability" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAvailability />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard/appointments" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          } />

          <Route path="/doctor/dashboard/experience" element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorExperienceEditor />
            </ProtectedRoute>
          } />

          <Route
            path="/doctor/dashboard/fees"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorFeeEditor />
              </ProtectedRoute>
            }
          />

          {/* PATIENT */}
          <Route path="/me/appointments" element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </ProtectedRoute>
          } />

          <Route
            path="/book-appointment/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          {/* HELP PAGES */}
          <Route path="/help" element={<HelpHome />} />
          <Route path="/help/report" element={<ReportIssue />} />
          <Route path="/help/part/:slug" element={<HelpPartPage />} />

          {/* ADMIN HELP */}
          <Route path="/admin/help/parts" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHelpParts />
            </ProtectedRoute>
          } />

          <Route path="/admin/help/issues" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHelpIssues />
            </ProtectedRoute>
          } />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBlogs /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/doctors/:id/edit" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDoctorEditor /></ProtectedRoute>} />
          <Route path="/admin/users/:id/promote" element={<ProtectedRoute allowedRoles={["admin"]}><PromoteToDoctor /></ProtectedRoute>} />
          <Route path="/admin/specialties" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSpecialties /></ProtectedRoute>} />
          <Route path="/admin/hospitals" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHospitals /></ProtectedRoute>} />
          <Route path="/admin/locations" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLocations /></ProtectedRoute>} />
          <Route path="/admin/fee-policies" element={<ProtectedRoute allowedRoles={["admin"]}><AdminFeePolicies /></ProtectedRoute>} />

          {/* NOTIFICATION */}
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* PAYMENT */}
          <Route
            path="/me/payments"
            element={
              <ProtectedRoute allowedRoles={["admin","patient"]}>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/payments/:id"
            element={
              <ProtectedRoute allowedRoles={["admin","patient"]}>
                <PaymentReceipt />
              </ProtectedRoute>
            }
          />

        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
