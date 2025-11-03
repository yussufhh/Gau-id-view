import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  UserX, 
  UserCheck,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Calendar,
  Mail,
  Phone,
  BookOpen,
  User
} from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 'STU001',
      name: 'John Kamau Doe',
      admissionNumber: 'S110/2099/23',
      email: 'john.doe@student.gau.ac.ke',
      phone: '+254 712 345 678',
      course: 'Bachelor of Computer Science',
      department: 'Computer Science',
      yearOfStudy: 'Year 3',
      dateOfBirth: '1998-05-15',
      status: 'active',
      idStatus: 'issued',
      registrationDate: '2023-09-15',
      lastActive: '2024-11-03T08:30:00',
      address: 'P.O. Box 1234, Garissa',
      nextOfKin: 'Mary Doe - Mother',
      nextOfKinPhone: '+254 722 987 654'
    },
    {
      id: 'STU002',
      name: 'Mary Njeri Mwangi',
      admissionNumber: 'S110/2088/23',
      email: 'mary.mwangi@student.gau.ac.ke',
      phone: '+254 722 987 654',
      course: 'Bachelor of Business Administration',
      department: 'Business',
      yearOfStudy: 'Year 2',
      dateOfBirth: '1999-08-22',
      status: 'active',
      idStatus: 'pending',
      registrationDate: '2023-09-15',
      lastActive: '2024-11-02T15:45:00',
      address: 'P.O. Box 5678, Nairobi',
      nextOfKin: 'Peter Mwangi - Father',
      nextOfKinPhone: '+254 733 456 789'
    },
    {
      id: 'STU003',
      name: 'David Ochieng Otieno',
      admissionNumber: 'S110/2077/23',
      email: 'david.otieno@student.gau.ac.ke',
      phone: '+254 733 456 789',
      course: 'Bachelor of Education',
      department: 'Education',
      yearOfStudy: 'Year 4',
      dateOfBirth: '1997-12-10',
      status: 'inactive',
      idStatus: 'expired',
      registrationDate: '2023-09-15',
      lastActive: '2024-10-15T10:20:00',
      address: 'P.O. Box 9876, Kisumu',
      nextOfKin: 'Grace Otieno - Mother',
      nextOfKinPhone: '+254 744 567 890'
    }
  ]);

  const [filteredStudents, setFilteredStudents] = useState(students);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const departments = ['Computer Science', 'Business', 'Education', 'Engineering', 'Health Sciences'];

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(student => student.department === departmentFilter);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, departmentFilter, students]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIdStatusColor = (status) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStudentStatus = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'active' ? 'inactive' : 'active' }
        : student
    ));
  };

  const handleEditStudent = (updatedStudent) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setEditingStudent(null);
  };

  const exportStudents = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Admission Number,Email,Course,Department,Status,ID Status\n" +
      filteredStudents.map(student => 
        `${student.name},${student.admissionNumber},${student.email},${student.course},${student.department},${student.status},${student.idStatus}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StudentDetailModal = ({ student, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Header */}
          <div className="flex items-center space-x-6 bg-gray-50 rounded-lg p-6">
            <div className="w-20 h-20 bg-[#00923F] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
              <p className="text-lg text-gray-600">{student.admissionNumber}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getIdStatusColor(student.idStatus)}`}>
                  ID: {student.idStatus.charAt(0).toUpperCase() + student.idStatus.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-800">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-800">{student.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-gray-800">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="text-gray-800">{student.course}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="text-gray-800">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year of Study</p>
                  <p className="text-gray-800">{student.yearOfStudy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="text-gray-800">{new Date(student.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact & Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Next of Kin</p>
                <p className="text-gray-800">{student.nextOfKin}</p>
                <p className="text-sm text-gray-600 mt-2">Phone</p>
                <p className="text-gray-800">{student.nextOfKinPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-gray-800">{student.address}</p>
                <p className="text-sm text-gray-600 mt-2">Last Active</p>
                <p className="text-gray-800">{new Date(student.lastActive).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setEditingStudent(student)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-5 h-5 inline mr-2" />
              Edit Profile
            </button>
            <button
              onClick={() => toggleStudentStatus(student.id)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                student.status === 'active' 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {student.status === 'active' ? <UserX className="w-5 h-5 inline mr-2" /> : <UserCheck className="w-5 h-5 inline mr-2" />}
              {student.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditStudentModal = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState(student);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Edit Student Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({...formData, yearOfStudy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
                >
                  <option value="Year 1">Year 1</option>
                  <option value="Year 2">Year 2</option>
                  <option value="Year 3">Year 3</option>
                  <option value="Year 4">Year 4</option>
                  <option value="Year 5">Year 5</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-600">Manage student profiles and records</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00923F] text-white rounded-lg hover:bg-[#007A33] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
            <button
              onClick={exportStudents}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00923F] focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#00923F] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.admissionNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.course}</div>
                    <div className="text-sm text-gray-500">{student.department} • {student.yearOfStudy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(student.status)}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIdStatusColor(student.idStatus)}`}>
                      {student.idStatus.charAt(0).toUpperCase() + student.idStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingStudent(student)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStudentStatus(student.id)}
                        className={`transition-colors ${
                          student.status === 'active' 
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {student.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No students found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No students have been registered yet.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewingStudent && (
        <StudentDetailModal
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleEditStudent}
        />
      )}
    </div>
  );
};

export default StudentManagement;