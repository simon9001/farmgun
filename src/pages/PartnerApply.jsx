import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    MessageSquare,
    Search,
    FileText,
    CheckCircle,
    Handshake,
    UserPlus,
    TrendingUp,
    ArrowRight,
    Send,
    Loader2,
    Check
} from 'lucide-react';
import { useSubmitPartnerInterestMutation } from '../features/Api/partnersApi';

const stages = [
    {
        icon: Users,
        title: "Stage 1: Awareness & Invitation",
        desc: "How they find you: Your website, social media, events, or direct outreach.",
        color: "blue"
    },
    {
        icon: MessageSquare,
        title: "Stage 2: Expression of Interest (EOI)",
        desc: "Partner fills a short online form expressing interest.",
        color: "green",
        isInteractive: true
    },
    {
        icon: Search,
        title: "Stage 3: Initial Review",
        desc: "FarmWithIrene team reviews the EOI for mission fit and feasibility.",
        color: "yellow"
    },
    {
        icon: FileText,
        title: "Stage 4: Proposal Submission",
        desc: "Send the partner instructions for a detailed proposal of their offer.",
        color: "purple"
    },
    {
        icon: CheckCircle,
        title: "Stage 5: Evaluation",
        desc: "Team evaluates alignment, budget, and commitments.",
        color: "indigo"
    },
    {
        icon: Handshake,
        title: "Stage 6: Negotiation & Agreement",
        desc: "Discuss adjustments and draft the agreement/MOU.",
        color: "orange"
    },
    {
        icon: UserPlus,
        title: "Stage 7: Approval & Onboarding",
        desc: "Once signed, partner is officially onboarded and added to the database.",
        color: "teal"
    },
    {
        icon: TrendingUp,
        title: "Stage 8: Activation & Reporting",
        desc: "Partner engagement begins with mentions, projects, and KPI tracking.",
        color: "rose"
    }
];

const PartnerApply = () => {
    const [form, setForm] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        partnership_type: 'sponsorship',
        budget_resources: '',
        interest_reason: ''
    });
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [submitInterest, { isLoading }] = useSubmitPartnerInterestMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitInterest(form).unwrap();
            setStatus('success');
            setForm({
                company_name: '',
                contact_person: '',
                email: '',
                phone: '',
                partnership_type: 'sponsorship',
                budget_resources: '',
                interest_reason: ''
            });
        } catch (err) {
            setStatus('error');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl"
                    >
                        Partner with <span className="text-green-600">FarmWithIrene</span>
                    </motion.h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                        Join our mission to modernize agriculture and support sustainable farming.
                    </p>
                </div>

                {/* Journey Section */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Your Partnership Journey</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stages.map((stage, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-${stage.color}-100 dark:bg-${stage.color}-900/30 flex items-center justify-center text-${stage.color}-600 mb-6`}>
                                    <stage.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{stage.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{stage.desc}</p>
                                {index < stages.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-6 h-6 text-gray-300" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* EOI Form Section */}
                <section id="apply-form" className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-green-600 py-8 px-10 text-white">
                            <h2 className="text-2xl font-bold">Expression of Interest</h2>
                            <p className="opacity-90">Tell us how you would like to collaborate.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                            <Check className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Interest Submitted!</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Thank you for expressing interest in partnering with us. Our team will review your submission and get back to you soon.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setStatus(null)}
                                            className="mt-8 text-green-600 font-bold hover:underline"
                                        >
                                            Submit another interest
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company / Organization Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.company_name}
                                                    onChange={e => setForm({ ...form, company_name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.contact_person}
                                                    onChange={e => setForm({ ...form, contact_person: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={form.phone}
                                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type of Partnership Desired</label>
                                            <select
                                                required
                                                value={form.partnership_type}
                                                onChange={e => setForm({ ...form, partnership_type: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            >
                                                <option value="sponsorship">Sponsorship</option>
                                                <option value="co-branding">Co-branding</option>
                                                <option value="equipment">Equipment</option>
                                                <option value="funding">Funding</option>
                                                <option value="mentorship">Mentorship</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Budget or Resources</label>
                                            <textarea
                                                required
                                                rows={3}
                                                placeholder="What can you provide? (e.g., funding amount, equipment, expertise)"
                                                value={form.budget_resources}
                                                onChange={e => setForm({ ...form, budget_resources: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Why do you want to partner with us?</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={form.interest_reason}
                                                onChange={e => setForm({ ...form, interest_reason: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            Submit Expression of Interest
                                        </button>

                                        {status === 'error' && (
                                            <p className="text-red-500 text-center text-sm">Failed to submit. Please check your connection and try again.</p>
                                        )}
                                    </div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PartnerApply;
