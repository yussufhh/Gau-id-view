import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Package,
  Download,
  AlertTriangle,
  User,
  Calendar,
  MapPin
} from 'lucide-react';

const IDCardManagement = () => {
  const [cards, setCards] = useState([
    {
      id: 'CARD001',
      studentId: 'STU001',
      studentName: 'John Kamau Doe',
      admissionNumber: 'S110/2099/23',
      cardNumber: 'GAU2024001',
      status: 'printed',
      printedDate: '2024-10-25T09:30:00',
      issuedDate: '2024-10-26T14:20:00',
      expiryDate: '2025-10-26',
      cardType: 'student',
      printQueue: false,
      reprints: 0,
      department: 'Computer Science',
      yearOfStudy: 'Year 3',
      photo: null,
      lastUpdated: '2024-10-26T14:20:00'
    },
    {
      id: 'CARD002',
      studentId: 'STU002',
      studentName: 'Mary Njeri Mwangi',
      admissionNumber: 'S110/2088/23',
      cardNumber: 'GAU2024002',
      status: 'in_queue',
      printedDate: null,
      issuedDate: null,
      expiryDate: '2025-11-05',
      cardType: 'student',
      printQueue: true,
      reprints: 0,
      department: 'Business',
      yearOfStudy: 'Year 2',
      photo: null,
      lastUpdated: '2024-11-03T08:15:00'
    },
    {
      id: 'CARD003',
      studentId: 'STU003',
      studentName: 'David Ochieng Otieno',
      admissionNumber: 'S110/2077/23',
      cardNumber: 'GAU2024003',
      status: 'expired',
      printedDate: '2023-09-20T10:15:00',
      issuedDate: '2023-09-21T11:30:00',
      expiryDate: '2024-09-21',
      cardType: 'student',
      printQueue: false,
      reprints: 1,
      department: 'Education',
      yearOfStudy: 'Year 4',
      photo: null,
      lastUpdated: '2024-09-21T00:00:00'
    }
  ]);

  const [filteredCards, setFilteredCards] = useState(cards);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [printQueue, setPrintQueue] = useState([]);
  const [viewingCard, setViewingCard] = useState(null);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showPrintPreview, setShowPrintPreview] = useState(null);

  const cardStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_queue', label: 'In Print Queue', color: 'bg-blue-100 text-blue-800' },
    { value: 'printed', label: 'Printed', color: 'bg-green-100 text-green-800' },
    { value: 'issued', label: 'Issued', color: 'bg-green-100 text-green-800' },
    { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800' },
    { value: 'lost', label: 'Lost/Stolen', color: 'bg-red-100 text-red-800' },
    { value: 'damaged', label: 'Damaged', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    setFilteredCards(filtered);
  }, [searchTerm, statusFilter, cards]);

  useEffect(() => {
    setPrintQueue(cards.filter(card => card.printQueue));
  }, [cards]);

  const getStatusColor = (status) => {
    const statusObj = cardStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  const updateCardStatus = (cardId, newStatus) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { 
            ...card, 
            status: newStatus,
            printedDate: newStatus === 'printed' ? new Date().toISOString() : card.printedDate,
            issuedDate: newStatus === 'issued' ? new Date().toISOString() : card.issuedDate,
            lastUpdated: new Date().toISOString()
          }
        : card
    ));
  };

  const addToPrintQueue = (cardId) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, printQueue: true, status: 'in_queue', lastUpdated: new Date().toISOString() }
        : card
    ));
  };

  const removeFromPrintQueue = (cardId) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, printQueue: false, lastUpdated: new Date().toISOString() }
        : card
    ));
  };

  const processPrintQueue = () => {
    const queuedCards = cards.filter(card => card.printQueue);
    
    queuedCards.forEach(card => {
      updateCardStatus(card.id, 'printed');
      removeFromPrintQueue(card.id);
    });

    alert(`${queuedCards.length} cards have been marked as printed!`);
  };

  const reprintCard = (cardId) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { 
            ...card, 
            reprints: card.reprints + 1, 
            status: 'in_queue',
            printQueue: true,
            lastUpdated: new Date().toISOString()
          }
        : card
    ));
  };

  const bulkAddToQueue = () => {
    setCards(prev => prev.map(card => 
      bulkSelection.includes(card.id)
        ? { ...card, printQueue: true, status: 'in_queue', lastUpdated: new Date().toISOString() }
        : card
    ));
    setBulkSelection([]);
  };

  const exportCardData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Student Name,Admission Number,Card Number,Status,Printed Date,Issued Date,Expiry Date,Reprints\n" +
      filteredCards.map(card => 
        `${card.studentName},${card.admissionNumber},${card.cardNumber},${card.status},${card.printedDate || 'N/A'},${card.issuedDate || 'N/A'},${card.expiryDate},${card.reprints}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "id_cards_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CardDetailModal = ({ card, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">ID Card Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Preview */}
          <div className="bg-gradient-to-r from-[#00923F] to-[#007A33] rounded-lg p-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                <User className="w-12 h-12 text-[#00923F]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{card.studentName}</h3>
                <p className="text-lg opacity-90">{card.admissionNumber}</p>
                <p className="text-sm opacity-75">{card.department} • {card.yearOfStudy}</p>
                <p className="text-lg font-mono mt-2">{card.cardNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-75">Expires</p>
                <p className="font-semibold">{new Date(card.expiryDate).toLocaleDateString()}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(card.status)} text-black`}>
                    {card.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Card Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Card Number</p>
                  <p className="text-gray-800 font-mono">{card.cardNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Card Type</p>
                  <p className="text-gray-800 capitalize">{card.cardType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="text-gray-800">{new Date(card.expiryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reprints</p>
                  <p className="text-gray-800">{card.reprints}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-gray-800">{new Date(card.lastUpdated).toLocaleString()}</p>
                </div>
                {card.printedDate && (
                  <div>
                    <p className="text-sm text-gray-600">Printed Date</p>
                    <p className="text-gray-800">{new Date(card.printedDate).toLocaleString()}</p>
                  </div>
                )}
                {card.issuedDate && (
                  <div>
                    <p className="text-sm text-gray-600">Issued Date</p>
                    <p className="text-gray-800">{new Date(card.issuedDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowPrintPreview(card)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-5 h-5 inline mr-2" />
              Preview Card
            </button>
            <button
              onClick={() => reprintCard(card.id)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Reprint Card
            </button>
            <button
              onClick={() => addToPrintQueue(card.id)}
              className="px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              <Printer className="w-5 h-5 inline mr-2" />
              Add to Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Cards</p>
              <p className="text-2xl font-bold text-gray-800">
                {cards.filter(c => c.status === 'issued').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Print Queue</p>
              <p className="text-2xl font-bold text-gray-800">{printQueue.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-800">
                {cards.filter(c => c.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <RotateCcw className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Reprints</p>
              <p className="text-2xl font-bold text-gray-800">
                {cards.reduce((sum, card) => sum + card.reprints, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Queue Management */}
      {printQueue.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Print Queue</h3>
              <p className="text-blue-600">{printQueue.length} cards waiting to be printed</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={processPrintQueue}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-5 h-5 inline mr-2" />
                Print All ({printQueue.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ID Card Management</h1>
            <p className="text-gray-600">Manage student ID cards and print operations</p>
          </div>
          <div className="flex items-center space-x-2">
            {bulkSelection.length > 0 && (
              <button
                onClick={bulkAddToQueue}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>Add {bulkSelection.length} to Queue</span>
              </button>
            )}
            <button
              onClick={exportCardData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, admission number, or card number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          >
            <option value="all">All Status</option>
            {cardStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredCards.length} of {cards.length} cards
          </div>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkSelection(filteredCards.map(card => card.id));
                      } else {
                        setBulkSelection([]);
                      }
                    }}
                    className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Card Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={bulkSelection.includes(card.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBulkSelection([...bulkSelection, card.id]);
                        } else {
                          setBulkSelection(bulkSelection.filter(id => id !== card.id));
                        }
                      }}
                      className="rounded border-gray-300 text-[#00923F] focus:ring-[#00923F]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#00923F] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {card.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{card.studentName}</div>
                        <div className="text-sm text-gray-500">{card.admissionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{card.cardNumber}</div>
                    <div className="text-sm text-gray-500">
                      {card.reprints > 0 && `${card.reprints} reprint${card.reprints > 1 ? 's' : ''}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(card.status)}`}>
                      {card.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Expires: {new Date(card.expiryDate).toLocaleDateString()}</div>
                    {card.printedDate && (
                      <div>Printed: {new Date(card.printedDate).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {card.printQueue ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        In Queue
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Not queued</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingCard(card)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToPrintQueue(card.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        disabled={card.printQueue}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reprintCard(card.id)}
                        className="text-orange-600 hover:text-orange-900 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No ID cards found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No ID cards have been created yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewingCard && (
        <CardDetailModal
          card={viewingCard}
          onClose={() => setViewingCard(null)}
        />
      )}
    </div>
  );
};

export default IDCardManagement;