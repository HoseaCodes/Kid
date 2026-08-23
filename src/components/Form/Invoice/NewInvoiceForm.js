import React from "react";
import LazyLoad from "react-lazyload";
import * as Components from "../../../components/all";

export default function NewInvoiceForm({
  newInvoice,
  setNewInvoice,
  newItem,
  setNewItem,
  setProductIds,
  selectedInput,
  setSelectedInput,
  history,
  productIds,
  sendInvoice,
  setLoading,
  currentUser,
  students,
  setFilteredStudents,
  filteredStudents,
  handleAssignedStudent,
  handleSelectedStudent,
  showStudentResults,
  setShowStudentResults,
  focused,
  setFocused,
  selectedStudent,
  removeItem,
  addItem,
  imgPlaceholder,
  ...props
}) {
  // Helper function to safely calculate item total
  const calculateItemTotal = (item) => {
    const price = parseFloat(item?.price) || 0;
    const qty = parseInt(item?.qty) || 0;
    return (price * qty).toFixed(2);
  };

  // Helper function to safely format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-md shadow mb-6 overflow-hidden">
        <div className="bg-[#F38315] px-6 py-4">
          <Components.SubHeading className="!text-2xl !text-white mb-0">
            Invoice
          </Components.SubHeading>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            {/* Company Information */}
            <div className="flex-1">
              <Components.SubHeading className="!text-lg mb-4">
                Company Information
              </Components.SubHeading>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">Email:</span>
                  <span className="text-sm text-gray-900">Company@email.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">Address:</span>
                  <span className="text-sm text-gray-900">Company's Address</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">Phone:</span>
                  <span className="text-sm text-gray-900">1-800-961-4952</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">Business:</span>
                  <span className="text-sm text-gray-900">Company's Business Number</span>
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={imgPlaceholder}
                alt="Company Logo"
                className="w-20 h-20 object-contain border rounded-lg"
              />
            </div>
          </div>

          {/* Recipient and Invoice Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recipient Information */}
            <div>
              <Components.SubHeading className="!text-lg mb-4">
                <span className="text-[#F38315]">Bill To</span>
              </Components.SubHeading>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter client username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        user: {
                          ...newInvoice.user,
                          username: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter client email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        user: {
                          ...newInvoice.user,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter client address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        user: {
                          ...newInvoice.user,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        user: {
                          ...newInvoice.user,
                          contactNum: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <Components.SubHeading className="!text-lg mb-4">
                Invoice <span className="text-[#F38315]">Details</span>
              </Components.SubHeading>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Invoice #:</span>
                  <span className="text-sm text-gray-900">Auto-generated</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Date:</span>
                  <input
                    type="date"
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#F38315] focus:border-transparent"
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        manualDateAdded: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Amount Due:</span>
                  <span className="text-lg font-bold text-[#F38315]">
                    {formatCurrency(newInvoice?.cart?.total_price || 0)}
                  </span>
                </div>

                {/* Student Selection for Admin */}
                {currentUser?.isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Student
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
                        id="assigned-student"
                        placeholder="Search for student..."
                        onClick={(e) => {
                          setShowStudentResults(true);
                          setFocused(e.target.id);
                          if (!e.target.value.length && setFilteredStudents && students) {
                            setFilteredStudents(students);
                          }
                        }}
                        onChange={(e) => {
                          if (handleAssignedStudent) {
                            handleAssignedStudent(e);
                          }
                        }}
                      />
                      {showStudentResults && filteredStudents && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {filteredStudents.slice(0, 10).map((student) => (
                            <button
                              key={student.id || student.username}
                              type="button"
                              className="w-full text-left px-4 py-2 hover:bg-[#F38315]/10 transition-colors"
                              onClick={() => {
                                if (handleSelectedStudent) {
                                  handleSelectedStudent(student);
                                }
                              }}
                            >
                              {student.username}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-md shadow mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <Components.SubHeading className="!text-lg mb-0">
            Invoice <span className="text-[#F38315]">Items</span>
          </Components.SubHeading>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S. No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Existing Items */}
              {newInvoice?.cart?.items && newInvoice.cart.items.length > 0 &&
                newInvoice.cart.items.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.id || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.name || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.qty || 0}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(item.price || 0)}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(calculateItemTotal(item))}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                        onClick={() => {
                          if (removeItem) {
                            removeItem({
                              setNewInvoice,
                              newInvoice,
                              item,
                            });
                          }
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Add New Item Row */}
              <tr className="bg-blue-50">
                <td className="px-4 py-4 text-sm text-gray-900">
                  {(newInvoice?.cart?.items?.length || 0) + 1}
                </td>
                <td className="px-4 py-4">
                  <input
                    type="text"
                    placeholder="Item ID"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#F38315] focus:border-transparent"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        id: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="text"
                    placeholder="Item name"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#F38315] focus:border-transparent"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        name: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="0"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#F38315] focus:border-transparent"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        qty: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#F38315] focus:border-transparent"
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {formatCurrency(calculateItemTotal(newItem))}
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F38315] hover:bg-[#e57309] transition-colors"
                    onClick={() => {
                      if (addItem) {
                        addItem({
                          newItem,
                          setNewItem,
                          setProductIds,
                          newInvoice,
                          setNewInvoice,
                          selectedInput,
                          setSelectedInput,
                          history,
                          productIds,
                          sendInvoice,
                          setLoading,
                          currentUser,
                        });
                      }
                    }}
                  >
                    Add Item
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signature */}
        <div className="bg-white rounded-md shadow p-6">
          <Components.SubHeading className="!text-lg mb-4">
            Signature
          </Components.SubHeading>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <LazyLoad height={100} offset={100} once>
              <img 
                loading="lazy" 
                src={imgPlaceholder} 
                alt="Signature" 
                className="w-24 h-16 object-contain mx-auto mb-2"
              />
            </LazyLoad>
            <p className="text-sm text-gray-500">Signature Here</p>
          </div>
        </div>

        {/* Total and Actions */}
        <div className="bg-white rounded-md shadow p-6">
          <Components.SubHeading className="!text-lg mb-4">
            Summary
          </Components.SubHeading>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-[#F38315]">
                {formatCurrency(newInvoice?.cart?.total_price || 0)}
              </span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                We offer limited 10 days refund policy and 30 days workmanship
                warranty on all of our services. For more details, please read our
                refund policy.
              </p>
            </div>
          </div>

          {/* Send Invoice Button */}
          <button
            className="w-full px-6 py-3 bg-[#F38315] text-white font-medium rounded-md hover:bg-[#e57309] transition-colors"
            onClick={() => {
              if (sendInvoice) {
                sendInvoice({
                  currentUser,
                  transactionId: newInvoice._id,
                  history,
                  setLoading,
                  newInvoice,
                  isNewInvoice: true,
                  selectedStudent,
                });
              }
            }}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
}