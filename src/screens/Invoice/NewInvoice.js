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
  
  // Enhanced Manage Invoices states
  const [invoiceType, setInvoiceType] = useState("all");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  // Sync transactions and apply filters
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setLocalTransactions(transactions);
      
      // Apply invoice type filter
      let filtered = [];
      if (invoiceType === "all") {
        filtered = transactions;
      } else {
        filtered = transactions.filter((item) => item.status === invoiceType);
      }
      
      setFilteredInvoices(filtered);
      setSearchedItems(filtered);
    }
  }, [transactions, invoiceType]);

  // Handle invoice type filter
  const handleInvoiceTypeChange = (type) => {
    setInvoiceType(type);
    setCurrentPage(1); // Reset to first page when filtering
    setSearched(false);
  };

  // Handle search functionality
  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      const results = filteredInvoices.filter((item) => {
        const username = item.user?.username || item.username || '';
        const email = item.user?.email || '';
        const invoiceId = item._id || '';
        
        return username.toLowerCase().includes(searchTerm.toLowerCase()) ||
               email.toLowerCase().includes(searchTerm.toLowerCase()) ||
               invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchedItems(results);
      setSearched(true);
    } else {
      setSearchedItems(filteredInvoices);
      setSearched(false);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle table sorting
  const handleSort = (key) => {
    const sortedInvoices = [...searchedItems].sort((a, b) => {
      if (key === "amount") {
        return Number(b.cart?.total_price || 0) - Number(a.cart?.total_price || 0);
      } else if (key === "date") {
        return new Date(b.createdAt || b.dateAdded) - new Date(a.createdAt || a.dateAdded);
      } else if (key === "username") {
        const nameA = (a.user?.username || a.username || '').toUpperCase();
        const nameB = (b.user?.username || b.username || '').toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      } else if (key === "status") {
        const statusA = (a.status || '').toUpperCase();
        const statusB = (b.status || '').toUpperCase();
        if (statusA < statusB) return -1;
        if (statusA > statusB) return 1;
        return 0;
      }
      return 0;
    });
    setSearchedItems(sortedInvoices);
  };

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
    history(`/dashboard/invoices/${transaction._id}`);
  };

  // Handle editing an invoice
  const handleEditInvoice = (transaction) => {
    setSelectedTransaction(transaction);
    setEditedInvoice(transaction);
    setIsTransactionLoaded(true);
    setEdit(true);
    setActiveTab("view");
  };

  // Handle delete invoice confirmation
  const handleDeleteInvoice = (transaction) => {
    setInvoiceToDelete(transaction);
    setShowDeleteModal(true);
  };

  // Handle delete invoice confirmation
  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    setDeleteLoading(true);
    
    try {
      // Replace this with your actual delete API call
      // const response = await fetch(`/api/transactions/${invoiceToDelete._id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${currentUser.token}` // if needed
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete invoice');
      // }

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state by removing the deleted invoice
      const updatedTransactions = localTransactions.filter(t => t._id !== invoiceToDelete._id);
      setLocalTransactions(updatedTransactions);
      
      // Update filtered and searched items
      const updatedFiltered = filteredInvoices.filter(t => t._id !== invoiceToDelete._id);
      setFilteredInvoices(updatedFiltered);
      
      const updatedSearched = searchedItems.filter(t => t._id !== invoiceToDelete._id);
      setSearchedItems(updatedSearched);
      
      // Reset pagination if needed
      const newTotalPages = Math.ceil(updatedSearched.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      
      // Optional: Show success notification
      // showNotification('Invoice deleted successfully', 'success');
      
    } catch (error) {
      console.error('Error deleting invoice:', error);
      // Optional: Show error notification
      // showNotification('Failed to delete invoice. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle cancel delete
  const cancelDeleteInvoice = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return;
    
    setDeleteLoading(true);
    try {
      // Add your delete API call here
      // await deleteTransaction(invoiceToDelete._id);
      
      // For now, we'll simulate the deletion by removing from local state
      const updatedTransactions = localTransactions.filter(t => t._id !== invoiceToDelete._id);
      setLocalTransactions(updatedTransactions);
      
      // Update filtered results as well
      const updatedFiltered = filteredInvoices.filter(t => t._id !== invoiceToDelete._id);
      setFilteredInvoices(updatedFiltered);
      
      const updatedSearched = searchedItems.filter(t => t._id !== invoiceToDelete._id);
      setSearchedItems(updatedSearched);
      
      // Reset page if current page becomes empty
      const newTotalPages = Math.ceil(updatedSearched.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      // Close modal and reset state
      setDeleteConfirmOpen(false);
      setInvoiceToDelete(null);
      
      // TODO: Add success notification here
      console.log(`Invoice ${invoiceToDelete._id} deleted successfully`);
      
    } catch (error) {
      console.error("Error deleting invoice:", error);
      // TODO: Add error notification here
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setInvoiceToDelete(null);
  };

  // Enhanced render invoices table with search, filters, and pagination
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

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(searchedItems.length / itemsPerPage);

    return (
      <div className="space-y-6">
        {/* Invoice Type Filter Buttons */}
        <div className="flex justify-center space-x-2">
          {['all', 'pending', 'for payment', 'completed'].map((type) => (
            <button
              key={type}
              onClick={() => handleInvoiceTypeChange(type)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                invoiceType === type
                  ? 'bg-[#F38315] text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors placeholder-gray-400"
              placeholder="Search by username, email, or invoice ID..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {searchedItems.length}
            </div>
            <div className="text-sm text-gray-600">
              {searched ? 'Found' : invoiceType === 'all' ? 'Total' : invoiceType.charAt(0).toUpperCase() + invoiceType.slice(1)} Invoices
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              ${Number(searchedItems.reduce((sum, t) => sum + (Number(t.cart?.total_price) || 0), 0)).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              ${searchedItems.length > 0 ? (Number(searchedItems.reduce((sum, t) => sum + (Number(t.cart?.total_price) || 0), 0)) / searchedItems.length).toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-gray-600">Average Amount</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {totalPages}
            </div>
            <div className="text-sm text-gray-600">
              Page{totalPages !== 1 ? 's' : ''} Total
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#F38315] transition-colors"
                  onClick={() => handleSort('username')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Username</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#F38315] transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#F38315] transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Amount</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#F38315] transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user?.username || transaction.username || 'Unknown Client'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.user?.email || 'No email'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.manualDateAdded || new Date(transaction.createdAt || transaction.dateAdded).toDateString() || 'No date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.cart?.total_quantity || transaction.cart?.items?.length || 0} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${Number(transaction.cart?.total_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.status === 'for payment' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status?.toUpperCase() || 'SENT'}
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
                      <button
                        onClick={() => handleDeleteInvoice(transaction)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty Search Results */}
          {searched && searchedItems.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Components.SubHeading className="!text-lg text-gray-500 mb-2">
                No Results Found
              </Components.SubHeading>
              <Components.Paragraph className="text-gray-400">
                No invoices found matching your search criteria.
              </Components.Paragraph>
            </div>
          )}
        </div>

        {/* Pagination */}
        {searchedItems.length > itemsPerPage && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, searchedItems.length)} of {searchedItems.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pageNum === currentPage
                          ? 'bg-[#F38315] text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Delete Invoice
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this invoice? This action cannot be undone.
                  </p>
                  {invoiceToDelete && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-900">
                        Invoice #{invoiceToDelete._id?.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {invoiceToDelete.user?.username || invoiceToDelete.username || 'Unknown Client'} - ${Number(invoiceToDelete.cart?.total_price || 0).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={cancelDeleteInvoice}
                      disabled={deleteLoading}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteInvoice}
                      disabled={deleteLoading}
                      className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {deleteLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        'Delete Invoice'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}           
      </div>
    </Layout>
  );
};

export default NewInvoice;