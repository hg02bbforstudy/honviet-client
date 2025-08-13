import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE, ADMIN_EMAILS } from '../constants';
import { Search, Filter, Eye, Edit, Trash2, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import FeedbackChart from '../components/FeedbackChart';
import TrendChart from '../components/TrendChart';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    paymentStatus: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({});
  const [feedbackPagination, setFeedbackPagination] = useState({});
  const navigate = useNavigate();

  // Kiểm tra xem user có phải admin không
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }
    
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchFeedbacks();
    }
  }, [filters, navigate, activeTab]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        fetchFeedbacks();
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, filters, activeTab]);

  // Update last updated time when orders/feedbacks change
  useEffect(() => {
    if ((activeTab === 'orders' && orders.length > 0) || (activeTab === 'feedback' && feedbacks.length > 0)) {
      setLastUpdated(new Date());
      
      // Check for new orders and play notification sound
      if (activeTab === 'orders' && previousOrderCount > 0 && orders.length > previousOrderCount && soundEnabled) {
        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDaJ2fPSfC0ELYnS9N2LPAoUXrTq66pVFAxEnt/yuW0gBDWG3nOkRQ');
        audio.play().catch(() => {}); // Ignore errors if audio fails
      }
      
      if (activeTab === 'orders') {
        setPreviousOrderCount(orders.length);
      }
    }
  }, [orders, feedbacks, previousOrderCount, soundEnabled, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`${API_BASE}/orders?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      } else {
        setError(data.message || 'Lỗi khi tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'status' && key !== 'paymentStatus') queryParams.append(key, value);
      });

      const response = await fetch(`${API_BASE}/ar-feedback?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setFeedbacks(data.data.feedbacks);
        setFeedbackPagination(data.data.pagination);
        setFeedbackStats(data.data.stats);
        setError('');
      } else {
        setError(data.message || 'Lỗi khi tải danh sách đánh giá');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, paymentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchOrders(); // Refresh danh sách
        setShowOrderModal(false);
        alert('Cập nhật trạng thái thành công!');
      } else {
        alert(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Lỗi kết nối server');
    }
  };

  const handleDeleteOrder = async (orderId, orderTime) => {
    // Xác nhận trước khi xóa
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa đơn hàng ${orderTime}?\n\nHành động này không thể hoàn tác!`
    );
    
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Xóa đơn hàng thành công!');
        fetchOrders(); // Refresh danh sách
        
        // Đóng modal nếu đang xem đơn hàng vừa xóa
        if (selectedOrder && selectedOrder._id === orderId) {
          setShowOrderModal(false);
          setSelectedOrder(null);
        }
      } else {
        alert(data.message || 'Lỗi khi xóa đơn hàng');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Lỗi kết nối server');
    }
  };

  const handleDeleteFeedback = async (feedbackId, username) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa đánh giá của ${username}?\n\nHành động này không thể hoàn tác!`
    );
    
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/ar-feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Xóa đánh giá thành công!');
        fetchFeedbacks(); // Refresh danh sách
      } else {
        alert(data.message || 'Lỗi khi xóa đánh giá');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Lỗi kết nối server');
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';
  const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

  // Check if order is new (created within last 5 minutes)
  const isNewOrder = (createdAt) => {
    const orderTime = new Date(createdAt);
    const now = new Date();
    const diffMinutes = (now - orderTime) / (1000 * 60);
    return diffMinutes <= 5;
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const texts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {texts[status]}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const texts = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      failed: 'Thanh toán thất bại'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colors[paymentStatus]}`}>
        {texts[paymentStatus]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                {activeTab === 'orders' ? 'Quản lý đơn hàng' : 'Đánh giá trải nghiệm AR'}
                {autoRefresh && (
                  <span className="inline-flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm font-normal text-green-600">Live</span>
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
              </p>
              
              {/* Tab Navigation */}
              <div className="flex gap-1 mt-3">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-honvietRed text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📦 Đơn hàng
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`px-3 py-1 text-xs sm:text-sm rounded-lg font-medium transition-colors ${
                    activeTab === 'feedback'
                      ? 'bg-honvietRed text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🎯 Đánh giá AR
                </button>
              </div>
            </div>
            
            {/* Auto-refresh controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <label className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <span className="whitespace-nowrap">Tự động</span>
                </label>
                
                <label className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="rounded"
                  />
                  <span className="whitespace-nowrap">🔊</span>
                </label>
                
                {autoRefresh && (
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="text-xs sm:text-sm border rounded px-1 sm:px-2 py-1"
                  >
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>1p</option>
                    <option value={300}>5p</option>
                  </select>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => activeTab === 'orders' ? fetchOrders() : fetchFeedbacks()}
                  className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs sm:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  {loading ? '⟳' : '🔄'}
                  <span className="hidden sm:inline ml-1">Làm mới</span>
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-honvietRed text-white rounded-lg hover:bg-honvietRed/80 text-xs sm:text-sm whitespace-nowrap"
                >
                  <span className="sm:hidden">🏠</span>
                  <span className="hidden sm:inline">Về trang chủ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats cho Orders */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-honvietRed" />
                </div>
                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Tổng đơn hàng</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900">{stats.totalOrders || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500" />
                </div>
                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Chờ xử lý</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900">{stats.pendingOrders || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-500" />
                </div>
                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Đã giao</p>
                  <p className="text-sm sm:text-lg lg:text-2xl font-semibold text-gray-900">{stats.deliveredOrders || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-honvietGold rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">₫</span>
                  </div>
                </div>
                <div className="ml-2 sm:ml-3 lg:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Doanh thu</p>
                  <p className="text-xs sm:text-sm lg:text-2xl font-semibold text-gray-900 break-all">{formatPrice(stats.totalRevenue || 0)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn, tên..."
                    className="pl-7 sm:pl-10 w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Trạng thái đơn</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                >
                  <option value="">Tất cả</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Thanh toán</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
                >
                  <option value="">Tất cả</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Sắp xếp</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters({ ...filters, sortBy, sortOrder, page: 1 });
                  }}
                >
                  <option value="createdAt-desc">Mới nhất</option>
                  <option value="createdAt-asc">Cũ nhất</option>
                  <option value="total-desc">Giá trị cao</option>
                  <option value="total-asc">Giá trị thấp</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Filters */}
        {activeTab === 'feedback' && (
          <>
            {/* Xu hướng theo thời gian */}
            <TrendChart feedbacks={feedbacks} />
            
            {/* Biểu đồ thống kê chi tiết */}
            <FeedbackChart stats={feedbackStats} />
            
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, email..."
                      className="pl-7 sm:pl-10 w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Sắp xếp</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-honvietRed"
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters({ ...filters, sortBy, sortOrder, page: 1 });
                    }}
                  >
                    <option value="createdAt-desc">Mới nhất</option>
                    <option value="createdAt-asc">Cũ nhất</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honvietRed"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => activeTab === 'orders' ? fetchOrders() : fetchFeedbacks()}
                className="px-4 py-2 bg-honvietRed text-white rounded-lg hover:bg-honvietRed/80"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              {/* Orders Content */}
              {activeTab === 'orders' && (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã đơn hàng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khách hàng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng tiền
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thanh toán
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày đặt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr 
                            key={order._id} 
                            className={`hover:bg-gray-50 ${
                              isNewOrder(order.createdAt) 
                                ? 'bg-green-50 border-l-4 border-green-400 animate-pulse' 
                                : ''
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 relative">
                              {order.orderTime}
                              {isNewOrder(order.createdAt) && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                              <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(order.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getPaymentStatusBadge(order.paymentStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="text-honvietRed hover:text-honvietRed/80 mr-3"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order._id, order.orderTime)}
                                className="text-red-600 hover:text-red-800"
                                title="Xóa đơn hàng"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-3 p-3 sm:p-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id}
                        className={`bg-white rounded-lg shadow p-3 sm:p-4 border-l-4 ${
                          isNewOrder(order.createdAt) 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs sm:text-sm font-mono font-semibold text-gray-900 truncate">
                                {order.orderTime}
                              </p>
                              {isNewOrder(order.createdAt) && (
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-base sm:text-lg font-semibold text-honvietRed truncate">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="text-honvietRed hover:text-honvietRed/80 p-1.5 sm:p-2"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id, order.orderTime)}
                              className="text-red-600 hover:text-red-800 p-1.5 sm:p-2"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{order.customerInfo.name}</p>
                            <p className="text-xs text-gray-500 truncate">{order.customerInfo.email}</p>
                            <p className="text-xs text-gray-500">{order.customerInfo.phone}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                          
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Feedback Content */}
              {activeTab === 'feedback' && (
                <div className="p-1 xs:p-2 sm:p-3">
                  {/* Ultra Compact Grid Layout */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-2 sm:gap-3">
                    {feedbacks.map((feedback) => (
                      <div key={feedback._id} className="bg-white rounded-md border border-gray-200 p-2 hover:shadow-sm transition-shadow relative group">
                        {/* Delete Button - Micro */}
                        <button
                          onClick={() => handleDeleteFeedback(feedback._id, feedback.username)}
                          className="absolute top-1 right-1 text-red-400 hover:text-red-600 p-0.5 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Xóa"
                        >
                          <Trash2 size={10} />
                        </button>
                        
                        {/* User Info - Micro */}
                        <div className="mb-2 pr-4">
                          <h3 className="text-xs font-semibold text-gray-900 truncate leading-tight">{feedback.username}</h3>
                          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-0.5">
                            <span className="truncate flex-1">{new Date(feedback.createdAt).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</span>
                          </div>
                        </div>
                        
                        {/* Feedback Micro Cards */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 px-1.5 py-1 bg-blue-50 rounded-sm border-l-2 border-blue-400">
                            <span className="text-[10px]">😊</span>
                            <p className="text-[10px] font-medium text-blue-700 truncate flex-1" title={feedback.question1Answer}>
                              {feedback.question1Answer}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 px-1.5 py-1 bg-green-50 rounded-sm border-l-2 border-green-400">
                            <span className="text-[10px]">⚡</span>
                            <p className="text-[10px] font-medium text-green-700 truncate flex-1" title={feedback.question2Answer}>
                              {feedback.question2Answer}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 px-1.5 py-1 bg-purple-50 rounded-sm border-l-2 border-purple-400">
                            <span className="text-[10px]">👥</span>
                            <p className="text-[10px] font-medium text-purple-700 truncate flex-1" title={feedback.question3Answer}>
                              {feedback.question3Answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {(activeTab === 'orders' ? pagination.totalPages : feedbackPagination.totalPages) > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={!(activeTab === 'orders' ? pagination.hasPrev : feedbackPagination.hasPrev)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={!(activeTab === 'orders' ? pagination.hasNext : feedbackPagination.hasNext)}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span> đến{' '}
                        <span className="font-medium">
                          {Math.min(filters.page * filters.limit, activeTab === 'orders' ? pagination.totalOrders : feedbackPagination.totalFeedbacks)}
                        </span>{' '}
                        trong <span className="font-medium">{activeTab === 'orders' ? pagination.totalOrders : feedbackPagination.totalFeedbacks}</span> kết quả
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                          disabled={!(activeTab === 'orders' ? pagination.hasPrev : feedbackPagination.hasPrev)}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Trước
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          {filters.page} / {activeTab === 'orders' ? pagination.totalPages : feedbackPagination.totalPages}
                        </span>
                        <button
                          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                          disabled={!(activeTab === 'orders' ? pagination.hasNext : feedbackPagination.hasNext)}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Sau
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-10 lg:top-20 mx-auto p-3 sm:p-5 border w-11/12 sm:w-10/12 md:w-3/4 lg:w-1/2 max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate pr-2">
                  Chi tiết đơn hàng #{selectedOrder.orderTime}
                </h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Thông tin khách hàng</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Tên:</span>
                      <span className="ml-2 font-medium break-words">{selectedOrder.customerInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SĐT:</span>
                      <span className="ml-2 font-medium break-all">{selectedOrder.customerInfo.phone}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-2 font-medium break-all">{selectedOrder.customerInfo.email}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="ml-2 font-medium break-words">{selectedOrder.customerInfo.address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Sản phẩm</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 border rounded">
                        <img 
                          src={item.image[0]} 
                          alt={item.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium truncate">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">{item.brand}</div>
                        </div>
                        <div className="text-xs sm:text-sm text-right flex-shrink-0">
                          <div>SL: {item.quantity}</div>
                          <div className="font-medium">{formatPrice(item.price)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Tóm tắt đơn hàng</h4>
                  <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Thành tiền:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí ship:</span>
                      <span>{formatPrice(selectedOrder.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-sm sm:text-base border-t pt-1">
                      <span>Tổng cộng:</span>
                      <span className="text-honvietRed">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Cập nhật trạng thái</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Trạng thái đơn hàng
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value, selectedOrder.paymentStatus)}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Trạng thái thanh toán
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                        value={selectedOrder.paymentStatus}
                        onChange={(e) => updateOrderStatus(selectedOrder._id, selectedOrder.status, e.target.value)}
                      >
                        <option value="pending">Chờ thanh toán</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="failed">Thất bại</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 gap-3">
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id, selectedOrder.orderTime)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto justify-center"
                  >
                    <Trash2 size={14} />
                    Xóa đơn hàng
                  </button>
                  
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Footer */}
      <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white rounded-lg shadow-lg p-2 sm:p-3 border max-w-[120px] sm:max-w-xs">
        <div className="flex items-center gap-1 sm:gap-2 text-xs">
          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-gray-600 text-xs">
            {autoRefresh ? `${refreshInterval}s` : 'Tắt'}
          </span>
        </div>
        {activeTab === 'orders' && orders.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {orders.filter(order => isNewOrder(order.createdAt)).length} mới
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
