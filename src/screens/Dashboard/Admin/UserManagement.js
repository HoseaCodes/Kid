import React from "react";
import UserManagement from "../../../components/Admin/UserManagement";
import useUserData from "../../../hooks/useUserData";
import Layout from "../../../components/Dashboard/Layout";

const AdminUserManagementPage = () => {
  const { user: currentUser, isLoading, error } = useUserData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data.</div>;

  return (
    <Layout>
      <div style={{ padding: 24 }}>
        <h1>Admin User Management</h1>
        <UserManagement currentUser={currentUser} />
      </div>
    </Layout>
  );
};

export default AdminUserManagementPage;
