import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutComponentAdmin from './components/layout/layoutAdmin';
import LayoutDashboard from './components/layout/layoutDashboard';
import LoadingLayout from './components/loadingLayout';
import Error from './pages/error';
import Login from './pages/login';
import PrivacyPolicy from './pages/privacy_policy';
import ProtectedRoute from './routes/ProtectedRoute';
import { CheckRole } from './utils';
import DataDeletion from './pages/dataDeletion';
import LayoutConversation from './components/layout/layoutConversation';


const CreateUser = React.lazy(() => import('./pages/user/create'));
const ManageUser = React.lazy(() => import('./pages/user/manager'));
const Profile = React.lazy(() => import('./pages/profile'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const Conversation = React.lazy(() => import('./pages/conversation'));



function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="/data-deletion"
        element={<DataDeletion />}
      />

      {/* 👤 layout dashboard */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.OWNER.toString(), CheckRole.ADMIN_MANAGE.toString()]} />}>
        <Route path="/" element={<LayoutDashboard />}>
          <Route path="/account" element={<Suspense fallback={<LoadingLayout />}><Profile /></Suspense>} />
          <Route path="" element={<Suspense fallback={<LoadingLayout />}><Dashboard /></Suspense>} />
        </Route>
      </Route>

      {/* 👤 layout dashboard */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.OWNER.toString(), CheckRole.ADMIN_MANAGE.toString(), CheckRole.CSKH.toString(), CheckRole.SALE.toString()]} />}>
        <Route path="/conversation" element={<LayoutConversation />}>

          <Route path=":id" element={<Suspense fallback={<LoadingLayout />}><Conversation /></Suspense>} />


        </Route>
      </Route>

      {/* 🛠️ ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.OWNER.toString(), CheckRole.ADMIN_MANAGE.toString()]} />}>
        <Route path="/admin" element={<LayoutComponentAdmin />}>
          <Route path="quan-ly-nguoi-dung" element={<Suspense fallback={<LoadingLayout />}><ManageUser /></Suspense>} />
          <Route path="quan-ly-nguoi-dung/them-moi" element={<Suspense fallback={<LoadingLayout />}> <CreateUser /> </Suspense>} />
          <Route path="quan-ly-nguoi-dung/cap-nhat/:id" element={<Suspense fallback={<LoadingLayout />}> <CreateUser /></Suspense>} />


        </Route>
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default App
