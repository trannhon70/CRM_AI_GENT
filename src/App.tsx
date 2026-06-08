import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LayoutComponentAdmin from './components/layout/layoutAdmin';
import LayoutComponentUser from './components/layout/layoutUser';
import LoadingLayout from './components/loadingLayout';
import Error from './pages/error';
import Login from './pages/login';
import ProtectedRoute from './routes/ProtectedRoute';
import { CheckRole } from './utils';
import Friend from './pages/friends';


const CreateUser = React.lazy(() => import('./pages/user/create'));
const ManageUser = React.lazy(() => import('./pages/user/manager'));
const Messages = React.lazy(() => import('./pages/messages/index'));
const History = React.lazy(() => import('./pages/history/index'));
const Profile = React.lazy(() => import('./pages/profile'));



function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* 👤 USER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.ADMIN.toString(), CheckRole.QUANLY.toString(), CheckRole.TUVAN.toString(), CheckRole.GOOGLE.toString()]} />}>
        <Route path="/" element={<LayoutComponentUser />}>
          <Route index element={<Suspense fallback={<LoadingLayout />}> <Messages /></Suspense>} />
          <Route path="history" element={<Suspense fallback={<LoadingLayout />}><History /></Suspense>} />
          <Route path="ho-so-ca-nhan" element={<Suspense fallback={<LoadingLayout />}><Profile /></Suspense>} />
          <Route path="add-friend" element={<Suspense fallback={<LoadingLayout />}><Friend /></Suspense>} />
        </Route>
      </Route>

      {/* 🛠️ ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={[CheckRole.ADMIN.toString()]} />}>
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
