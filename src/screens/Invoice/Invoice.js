import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sendInvoice } from "../../utils/invoiceFunctions";
import Layout from "../../components/Dashboard/Layout";
import useGetAllTransactions from "../../hooks/useGetAllTransactions";
import * as Components from "../../components/all";

const EditInvoice = lazy(() => import("./EditInvoice"));
const InvoiceDetails = lazy(() => import("../../components/Transactions/InvoiceDetails"));

const InvoiceTransaction = (props) => {
  const { id } = useParams();
  const history = useNavigate();
  const { currentUser } = props;
  
  // Fixed: Initialize as null instead of array since we're looking for a single transaction
  const [transaction, setTransaction] = useState(null);
  const [isTransactionLoaded, setIsTransactionLoaded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { transactions, isLoading, error } = useGetAllTransactions();

  useEffect(() => {
    const getTransaction = () => {
      // Fixed: Use find() instead of map() since we're looking for a single transaction
      const foundTransaction = transactions.find(t => t._id === id);
      if (foundTransaction) {
        setTransaction(foundTransaction);
        setIsTransactionLoaded(true);
        setEditedInvoice(foundTransaction);
        setLoading(false);
      }
    };
    
    if (transactions.length > 0 && id) {
      getTransaction();
    } else if (!isLoading && transactions.length === 0) {
      setLoading(false);
    }
  }, [currentUser, transactions, id, isLoading]);

  useEffect(() => {
    if (cancelEdit && transaction) {
      setEditedInvoice(transaction);
      setCancelEdit(false);
    }
  }, [cancelEdit, transaction]);

  // Handle navigation back to invoice list
  const handleBackToList = () => {
    history("/dashboard/admin/invoice/new");
  };

  // Loading state
  if (isLoading || loading) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
              <Components.SubHeading className="!text-2xl mb-2">
                Loading Invoice...
              </Components.SubHeading>
              <Components.Paragraph className="text-gray-600">
                Please wait while we fetch your invoice details
              </Components.Paragraph>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Components.SubHeading className="!text-2xl text-red-600 mb-2">
                Error Loading Invoice
              </Components.SubHeading>
              <Components.Paragraph className="text-gray-600 mb-4">
                {error.message}
              </Components.Paragraph>
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
              >
                Back to Invoices
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Invoice not found state
  if (!transaction && !isLoading) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <Components.SubHeading className="!text-2xl text-gray-500 mb-2">
                Invoice Not Found
              </Components.SubHeading>
              <Components.Paragraph className="text-gray-400 mb-4">
                The invoice with ID "{id}" could not be found. It may have been deleted or the ID is incorrect.
              </Components.Paragraph>
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
              >
                Back to Invoices
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // User access check
  if (!currentUser) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
              <Components.SubHeading className="!text-2xl">
                Authenticating...
              </Components.SubHeading>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Main content
  return (
    <Layout>
      <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
        {/* Header Section */}
        <div className="relative flex bg-white py-6 px-8 items-center rounded-md shadow mb-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start">
              <Components.SubHeading className="!text-3xl mb-2">
                Invoice <span className="text-[#F38315]">#{transaction._id?.slice(-8)}</span>
              </Components.SubHeading>
              <Components.Paragraph className="!font-[Grandstander] text-gray-600">
                {edit ? "Edit invoice details and items" : "View invoice details and manage"}
              </Components.Paragraph>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              {edit && (
                <button
                  onClick={() => setEdit(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel Edit
                </button>
              )}
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Invoices
              </button>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        {!edit && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">Invoice View Mode</h3>
                    <p className="text-sm text-blue-700">
                      You're currently viewing the invoice. Click Edit to make changes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEdit(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="bg-white rounded-md shadow flex-1 overflow-auto">
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
                transaction={transaction}
                currentUser={currentUser}
                setEdit={setEdit}
                sendInvoice={sendInvoice}
                history={history}
                id={id}
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
                transaction={transaction}
                setIsTransactionLoaded={setIsTransactionLoaded}
              />
            </Suspense>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceTransaction;