import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addItem, removeItem, sendInvoice } from "../../utils/invoiceFunctions";
import * as Papa from "papaparse";
import Layout from "../../components/Dashboard/Layout";
import useGetAllUsers from "../../hooks/useGetAllUsers";
import useGetAllTransactions from "../../hooks/useGetAllTransactions";
import * as Components from "../../components/all";

const NewInvoiceForm = lazy(() => import("../../components/Form/Invoice/NewInvoiceForm"));
const EditInvoice = lazy(() => import("./EditInvoice"));
const InvoiceDetails = lazy(() => import("../../components/Transactions/InvoiceDetails"));

const NewInvoice = (props) => {
  const { currentUser } = props;
  const history = useNavigate();
  const { id } = useParams();
  
  // Tab management
  const [activeTab, setActiveTab] = useState(id ? "manage" : "create");
  
  // Loading states
  const [loading, setLoading] = useState(true);
  
  // Create Invoice states
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    qty: 0,
    price: 0
  });
  
  const [selectedInput, setSelectedInput] = useState("");
  const [inputFilter, setInputFilter] = useState("");
  const [showStudentResults, setShowStudentResults] = useState(false);
  const [focused, setFocused] = useState({});
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [isStudentFound, setIsStudentFound] = useState(false);
  const [areStudentsLoaded, setAreStudentsLoaded] = useState(false);
  const { users } = useGetAllUsers();

  const [assignedCourse, setAssignedCourse] = useState({
    student: { username: "" },
  });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [newInvoice, setNewInvoice] = useState({
    _id: "",
    user: {
      username: "",
      email: "",
      address: "",
      contactNum: ""
    },
    manualDateAdded: "",
    cart: { items: [], total_quantity: 0, total_price: 0 },
  });

  // Manage Invoices states
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = useGetAllTransactions();
  const [localTransactions, setLocalTransactions] = useState([]);
  
  // Edit Invoice states
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [edit, setEdit] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState({});
  const [isTransactionLoaded, setIsTransactionLoaded] = useState(false);

  // CSV data loading
  useEffect(() => {
    let unmounted = false;

    const readCsv = () => {
      fetch("data.csv")
        .then((response) => response.text())
        .then((responseText) => {
          const data = Papa.parse(responseText, {
            complete: function(results) {
              const res = results.data
                .map((data) => ({
                  _id: data[0],
                  price: data[20] || 0,
                  name: data[19] || "",
                }))
                .slice(0, 100)
                .sort((a, b) =>
                  a.name.toUpperCase() < b.name.toUpperCase()
                    ? -1
                    : a.name.toUpperCase() > b.name.toUpperCase()
                    ? 1
                    : 0
                );
              setProductIds(res);
            },
          });
          return data;
        })
        .catch((error) => {
          console.error("Error loading CSV:", error);
          setProductIds([]);
        });
    };

    if (!unmounted) {
      readCsv();
      setLoading(false);
    }

    return () => {
      unmounted = true;
    };
  }, []);

  // Load students
  useEffect(() => {
    if (users.length > 0 && !areStudentsLoaded) {
      const studentsData = [];
      users.forEach((user) => {
        if (user.isStudent) {
          studentsData.push(user);
        }
      });
      setStudents(studentsData);
      setAreStudentsLoaded(true);
    }
  }, [users, areStudentsLoaded]);

  // Sync transactions
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setLocalTransactions(transactions);
    }
  }, [transactions]);

  // Handle URL params for direct invoice access
  useEffect(() => {
    if (id && transactions.length > 0) {
      const transaction = transactions.find(t => t._id === id);
      if (transaction) {
        setSelectedTransaction(transaction);
        setEditedInvoice(transaction);
        setIsTransactionLoaded(true);
        setActiveTab("view");
      }
    }
  }, [id, transactions]);

  // Handle edit cancellation
  useEffect(() => {
    if (cancelEdit && selectedTransaction) {
      setEditedInvoice(selectedTransaction);
      setCancelEdit(false);
    }
  }, [cancelEdit, selectedTransaction]);

  // Student assignment handlers
  const handleSelectedStudent = (student) => {
    setShowStudentResults(false);
    setSelectedStudent(student);
    setIsStudentFound(true);
    setAssignedCourse({ student });
    
    const studentInput = document.getElementById("assigned-student");
    if (studentInput) {
      studentInput.value = student.username;
    }
  };

  const handleAssignedStudent = (e) => {
    setShowStudentResults(true);
    if (!e.target.value) {
      setIsStudentFound(false);
    }
    setFilteredStudents(
      students.filter((s) =>
        s.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setAssignedCourse({
      ...assignedCourse,
      student: { username: e.target.value },
    });
  };

  useEffect(() => {
    if (focused && focused !== "assigned-student") {
      setShowStudentResults(false);
    }
  }, [focused]);

  // Handle viewing an invoice
  const handleViewInvoice = (transaction) => {
    setSelectedTransaction(transaction);
    setEditedInvoice(transaction);
    setIsTransactionLoaded(true);
    setEdit(false);
    setActiveTab("view");
    history(`/dashboard/transaction/${transaction._id}/invoice`);
  };

  // Handle editing an invoice
  const handleEditInvoice = (transaction) => {
    setSelectedTransaction(transaction);
    setEditedInvoice(transaction);
    setIsTransactionLoaded(true);
    setEdit(true);
    setActiveTab("view");
  };

  // Render invoices table
  const renderInvoicesTable = () => {
    if (transactionsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
            <Components.Paragraph>Loading invoices...</Components.Paragraph>
          </div>
        </div>
      );
    }

    if (transactionsError) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Components.SubHeading className="!text-xl text-red-600 mb-2">
            Error Loading Invoices
          </Components.SubHeading>
          <Components.Paragraph className="text-gray-600">
            {transactionsError.message}
          </Components.Paragraph>
        </div>
      );
    }

    if (!localTransactions || localTransactions.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <Components.SubHeading className="!text-xl text-gray-500 mb-2">
            No Invoices Found
          </Components.SubHeading>
          <Components.Paragraph className="text-gray-400 mb-4">
            You haven't created any invoices yet.
          </Components.Paragraph>
          <button
            onClick={() => setActiveTab("create")}
            className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
          >
            Create Your First Invoice
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {localTransactions.length}
            </div>
            <div className="text-sm text-gray-600">Total Invoices</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            {/* <div className="text-2xl font-bold text-[#F38315]">
              ${localTransactions.reduce((sum, t) => sum + (t.cart?.total_price || 0), 0).toFixed(2)}
            </div> */}
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              ${(localTransactions.reduce((sum, t) => sum + (t.cart?.total_price || 0), 0) / localTransactions.length || 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Average Amount</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{transaction._id?.slice(-8)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user?.username || 'Unknown Client'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.user?.email || 'No email'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.manualDateAdded || transaction.dateAdded || 'No date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(transaction.cart?.total_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Sent
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewInvoice(transaction)}
                        className="text-[#F38315] hover:text-[#e57309] font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditInvoice(transaction)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
              <Components.SubHeading className="!text-2xl">Loading...</Components.SubHeading>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser.isAdmin) {
    history("/dashboard");
    return null;
  }

  return (
    <Layout>
      <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
        {/* Header Section */}
        <div className="relative flex bg-white py-6 px-8 items-center rounded-md shadow mb-6">
          <div className="flex flex-col items-start">
            <Components.SubHeading className="!text-3xl mb-2">
              Invoice <span className="text-[#F38315]">Management</span>
            </Components.SubHeading>
            <Components.Paragraph className="!font-[Grandstander] text-gray-600">
              Create new invoices or manage existing ones
            </Components.Paragraph>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "create"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Invoice
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "manage"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Manage Invoices ({localTransactions.length})
            </button>
            {selectedTransaction && (
              <button
                onClick={() => setActiveTab("view")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "view"
                    ? "bg-white text-[#F38315] shadow"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View/Edit Invoice
              </button>
            )}
          </nav>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-md shadow flex-1 overflow-auto">
          {activeTab === "create" ? (
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                  <Components.Paragraph>Loading invoice form...</Components.Paragraph>
                </div>
              </div>
            }>
              <NewInvoiceForm 
                productIds={productIds}
                newInvoice={newInvoice}
                setNewInvoice={setNewInvoice}
                newItem={newItem}
                setNewItem={setNewItem}
                setProductIds={setProductIds}
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                history={history}
                assignedCourse={assignedCourse}
                setAssignedCourse={setAssignedCourse}
                handleAssignedStudent={handleAssignedStudent}
                handleSelectedStudent={handleSelectedStudent}
                showStudentResults={showStudentResults}
                setShowStudentResults={setShowStudentResults}
                filteredStudents={filteredStudents}
                setFilteredStudents={setFilteredStudents}
                selectedStudent={selectedStudent}
                isStudentFound={isStudentFound}
                currentUser={currentUser}
                students={students}
                focused={focused}
                setFocused={setFocused}
                addItem={addItem}
                removeItem={removeItem}
                sendInvoice={sendInvoice}
                setLoading={setLoading}
                imgPlaceholder="https://via.placeholder.com/150"
              />
            </Suspense>
          ) : activeTab === "manage" ? (
            <div className="p-6">
              {renderInvoicesTable()}
            </div>
          ) : activeTab === "view" && selectedTransaction ? (
            <div className="h-full overflow-auto">
              {!edit ? (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading invoice details...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <InvoiceDetails
                    transaction={selectedTransaction}
                    currentUser={currentUser}
                    setEdit={setEdit}
                    sendInvoice={sendInvoice}
                    history={history}
                    id={selectedTransaction._id}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading edit form...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <EditInvoice
                    {...props}
                    setEdit={setEdit}
                    editedInvoice={editedInvoice}
                    setEditedInvoice={setEditedInvoice}
                    setCancelEdit={setCancelEdit}
                    setLoading={setLoading}
                    transaction={selectedTransaction}
                    setIsTransactionLoaded={setIsTransactionLoaded}
                  />
                </Suspense>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default NewInvoice;