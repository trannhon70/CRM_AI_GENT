import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutComponentAdmin from './components/layout/layoutAdmin';
import LayoutComponenPage from './components/layout/layoutPage';
import LoadingLayout from './components/loadingLayout';
import Error from './pages/error';
import Login from './pages/login';
import ProtectedRoute from './routes/ProtectedRoute';
import { CheckRole } from './utils';
import Friend from './pages/friends';


const CreateUser = React.lazy(() => import('./pages/user/create'));
const ManageUser = React.lazy(() => import('./pages/user/manager'));
const Profile = React.lazy(() => import('./pages/profile'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));



function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* 👤 USER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.OWNER.toString(), CheckRole.ADMIN_MANAGE.toString()]} />}>
        <Route path="/" element={<LayoutComponenPage />}>
          <Route path="account" element={<Suspense fallback={<LoadingLayout />}><Profile /></Suspense>} />

          <Route path="/" element={<Suspense fallback={<LoadingLayout />}><Dashboard /></Suspense>} />
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
