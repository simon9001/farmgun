import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Shield,
    Bell,
    Calendar,
    ChevronRight,
    Clock,
    CheckCircle,
    AlertCircle,
    LayoutDashboard,
    Settings,
    MoreVertical
} from 'lucide-react';
import { selectCurrentUser } from '../features/Slice/AuthSlice';
import { useGetMyBookingsQuery } from '../features/Api/bookingsApi';
import { useGetUserNotificationsQuery } from '../features/Api/notificationsApi';

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const [activeSection, setActiveSection] = useState('overview');

    const { data: bookingsData, isLoading: bookingsLoading } = useGetMyBookingsQuery();
    const { data: notificationsData, isLoading: notificationsLoading } = useGetUserNotificationsQuery();

    const bookings = bookingsData?.bookings?.slice(0, 3) || [];
    const notifications = notificationsData?.notifications?.slice(0, 5) || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-border/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                            <div className="relative flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center text-green-600 shadow-inner mb-4 overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="stroke-[1.5]" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                                <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                                    {user?.role === 'admin' ? (
                                        <Shield className="w-3.5 h-3.5 text-green-600" />
                                    ) : (
                                        <User className="w-3.5 h-3.5 text-green-600" />
                                    )}
                                    <span className="capitalize">{user?.role}</span>
                                </p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-border/50 transition-colors hover:border-green-200 dark:hover:border-green-800">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-blue-500 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                                        <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-border/50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Links</p>
                                <nav className="space-y-1">
                                    <a href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all">
                                        <LayoutDashboard size={18} />
                                        Main Dashboard
                                    </a>
                                    <a href="#settings" className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 transition-all">
                                        <Settings size={18} />
                                        Profile Settings
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Bookings Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    Upcoming Bookings
                                </h3>
                                <a href="/dashboard" className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">
                                    View All
                                    <ChevronRight size={14} />
                                </a>
                            </div>

                            <div className="grid gap-4">
                                {bookingsLoading ? (
                                    [1, 2].map(i => <div key={i} className="h-24 bg-white dark:bg-gray-900 rounded-3xl border border-border/50 animate-pulse" />)
                                ) : bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <motion.div
                                            key={booking.id}
                                            whileHover={{ x: 5 }}
                                            className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-border/50 shadow-sm flex items-center gap-4 transition-all"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/30 flex flex-col items-center justify-center text-green-700 shrink-0">
                                                <span className="text-[10px] font-bold uppercase">{new Date(booking.date).toLocaleDateString('en-KE', { month: 'short' })}</span>
                                                <span className="text-lg font-black leading-none">{new Date(booking.date).getDate()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-foreground truncate">{booking.service?.name}</h4>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Clock size={12} />
                                                    {booking.start_time} - {booking.end_time}
                                                </p>
                                            </div>
                                            <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-3xl p-8 border border-dashed border-border/50 text-center">
                                        <p className="text-muted-foreground text-sm">No upcoming bookings found.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Notifications Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    Recent Activity
                                </h3>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                                {notificationsLoading ? (
                                    <div className="p-8 space-y-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : notifications.length > 0 ? (
                                    <div className="divide-y divide-border/30">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${notif.type === 'booking_confirmation' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {notif.type === 'booking_confirmation' ? <CheckCircle size={18} /> : <Bell size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground leading-tight">{notif.message}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1.5 uppercase font-bold tracking-tighter">
                                                        {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-muted-foreground text-sm">Your activity history is empty.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
