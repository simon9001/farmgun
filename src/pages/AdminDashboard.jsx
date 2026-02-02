import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell, Users, BarChart3, Send, Loader2, Check,
    AlertCircle, ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/Slice/AuthSlice';
import { useGetDashboardStatsQuery, useGetAllUsersQuery } from '../features/Api/adminApi';
import { useSendNotificationMutation } from '../features/Api/notificationsApi';

const AdminDashboard = () => {
    const user = useSelector(selectCurrentUser);
    const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery();
    const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery({});
    const [sendNotification, { isLoading: sending }] = useSendNotificationMutation();

    const [notificationForm, setNotificationForm] = useState({
        user_id: '',
        type: 'booking_confirmation',
        message: '',
    });
    const [sendStatus, setSendStatus] = useState({ success: false, error: null });
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const users = usersData?.users || [];
    const stats = statsData || {};

    const handleSendNotification = async (e) => {
        e.preventDefault();
        setSendStatus({ success: false, error: null });

        try {
            await sendNotification(notificationForm).unwrap();
            setSendStatus({ success: true, error: null });
            setNotificationForm({ user_id: '', type: 'info', message: '' });
            setTimeout(() => setSendStatus({ success: false, error: null }), 3000);
        } catch (err) {
            setSendStatus({ success: false, error: err.data?.error || 'Failed to send notification' });
        }
    };

    const handleSelectUser = (selectedUser) => {
        setNotificationForm(prev => ({ ...prev, user_id: selectedUser.id }));
        setShowUserDropdown(false);
    };

    const selectedUserName = users.find(u => u.id === notificationForm.user_id)?.name || 'Select User';

    if (user?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the admin dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your platform and send notifications</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {statsLoading ? '...' : stats.totalUsers || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {statsLoading ? '...' : stats.totalBookings || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Bell className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Services</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {statsLoading ? '...' : stats.totalServices || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Send Notification Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Send className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Send Notification</h2>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-4">
                    {/* User Selection */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select User
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
                        >
                            <span className={notificationForm.user_id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                                {usersLoading ? 'Loading...' : selectedUserName}
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </button>

                        {showUserDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {users.map(u => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => handleSelectUser(u)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                                    >
                                        <span className="text-gray-900 dark:text-white">{u.name}</span>
                                        <span className="text-xs text-gray-500">{u.email}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notification Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notification Type
                        </label>
                        <select
                            value={notificationForm.type}
                            onChange={(e) => setNotificationForm(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="booking_confirmation">Booking Confirmation</option>
                            <option value="reminder">Reminder</option>
                            <option value="payment_receipt">Payment Receipt</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Message
                        </label>
                        <textarea
                            value={notificationForm.message}
                            onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                            rows={4}
                            placeholder="Enter notification message..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                            required
                        />
                    </div>

                    {/* Status Messages */}
                    {sendStatus.success && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                            <Check className="w-5 h-5" />
                            <span>Notification sent successfully!</span>
                        </div>
                    )}

                    {sendStatus.error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            <span>{sendStatus.error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={sending || !notificationForm.user_id || !notificationForm.message}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Notification
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
