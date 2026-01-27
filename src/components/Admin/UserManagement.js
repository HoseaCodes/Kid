import React, { useState } from "react";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import useUserManagement from "../../hooks/useUserManagement";

const UserManagement = ({ currentUser }) => {
  const { users, isLoading, error } = useGetAllUsers();
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "student" });
  
  console.log('UserManagement debug:', { currentUser, users, isLoading, error });


  const { addUser, deleteUser, updateUser } = useUserManagement();

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ email: "", name: "", role: "student" });
    } catch (err) {
      alert("Failed to add user: " + err.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (err) {
        alert("Failed to delete user: " + err.message);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.userId, editingUser);
      setEditingUser(null);
    } catch (err) {
      alert("Failed to update user: " + err.message);
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#2d3748',
          margin: '0 0 8px 0'
        }}>
          User Management
        </h1>
        <p style={{
          color: '#718096',
          fontSize: '14px',
          margin: 0
        }}>
          Manage system users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: 0
              }}>
                {users.length}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: '4px 0 0 0'
              }}>
                Total Users
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#e6fffa',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👥
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: 0
              }}>
                {users.filter(u => u.isAdmin).length}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: '4px 0 0 0'
              }}>
                Admins
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef5e7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🔧
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: 0
              }}>
                {users.filter(u => u.isStudent).length}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                margin: '4px 0 0 0'
              }}>
                Students
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#e8f4ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🎓
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Users Table Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '24px 24px 0 24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 16px 0'
            }}>
              All Users
            </h2>
            
            {isLoading && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#718096'
              }}>
                Loading users...
              </div>
            )}
            
            {error && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#e53e3e'
              }}>
                Error loading users.
              </div>
            )}
          </div>

          {!isLoading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#f7fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <th style={{
                      padding: '16px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4a5568',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      User
                    </th>
                    <th style={{
                      padding: '16px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4a5568',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Role
                    </th>
                    <th style={{
                      padding: '16px 24px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#4a5568',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.userId} style={{
                      borderBottom: index < users.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <td style={{
                        padding: '16px 24px'
                      }}>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#2d3748'
                          }}>
                            {user.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#718096'
                          }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 24px'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '20px',
                          backgroundColor: user.isAdmin ? '#fed7d7' : 
                                          user.isTeacher ? '#fef5e7' : '#e6fffa',
                          color: user.isAdmin ? '#c53030' : 
                                 user.isTeacher ? '#d69e2e' : '#00b894'
                        }}>
                          {user.isAdmin ? 'Admin' : user.isTeacher ? 'Instructor' : user.isStudent ? 'Student' : 'Unknown'}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px 24px',
                        textAlign: 'right'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEditUser(user)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#4a5568',
                              backgroundColor: '#f7fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.userId)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#e53e3e',
                              backgroundColor: '#fed7d7',
                              border: '1px solid #feb2b2',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {users.length === 0 && !isLoading && !error && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#718096'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                No users found
              </div>
              <div style={{ fontSize: '14px' }}>
                Add your first user to get started
              </div>
            </div>
          )}
        </div>

        {/* Add User Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          padding: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 16px 0'
          }}>
            Add New User
          </h2>
          
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '6px'
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '6px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '6px'
              }}>
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                backgroundColor: '#4299e1',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Add User
            </button>
          </form>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            maxWidth: '90vw',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#2d3748',
              margin: '0 0 16px 0'
            }}>
              Edit User
            </h3>
            
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '6px'
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '6px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '6px'
                }}>
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#4299e1',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4a5568',
                    backgroundColor: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;