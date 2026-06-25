import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Minus, BarChart2,
    X, Search, MapPin, ChevronRight, Loader2,
    MessageSquare, Eye, ArrowUpRight, Award, AlertCircle
} from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────────────────────
const changeBadge = (change) => {
    if (change === null || change === undefined) return null;
    const isUp   = change > 0;
    const isDown = change < 0;
    return {
        isUp, isDown,
        cls: isUp   ? 'bg-green-500/20 text-green-400 border-green-500/30' :
             isDown ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-white/10 text-white/40 border-white/10',
        Icon: isUp ? TrendingUp : isDown ? TrendingDown : Minus,
        label: `${isUp ? '+' : ''}${Number(change).toFixed(1)}%`,
    };
};

// ─── Price row in the ticker list ────────────────────────────────────────────
const PriceRow = ({ item, onClick }) => {
    const badge = changeBadge(item.price_change);
    return (
        <button
            onClick={() => onClick(item)}
            className="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/8 active:bg-white/12 transition-colors group cursor-pointer"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-white text-[13px] font-semibold leading-tight truncate group-hover:text-green-300 transition-colors">
                        {item.crop_name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-white/25 shrink-0" />
                        <p className="text-white/35 text-[10px] truncate">
                            {item.market.split(',')[0]}
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-green-400 font-bold text-[13px]">
                        KES {Number(item.price_per_unit).toLocaleString()}
                    </p>
                    <p className="text-white/25 text-[10px]">/{item.unit}</p>
                </div>
            </div>
            {badge && (
                <div className="mt-1.5 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${badge.cls}`}>
                        <badge.Icon className="w-2.5 h-2.5" />
                        {badge.label}
                    </span>
                    <span className="text-white/20 text-[9px]">vs prev. day</span>
                </div>
            )}
            {/* tap hint */}
            <div className="flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-2.5 h-2.5 text-white/15 group-hover:text-green-400/50 transition-colors" />
                <span className="text-[9px] text-white/15 group-hover:text-green-400/50 transition-colors">Tap for details</span>
            </div>
        </button>
    );
};

// ─── Expanded detail overlay ─────────────────────────────────────────────────
const DetailOverlay = ({ item, allPrices, onClose }) => {
    if (!item) return null;

    const badge       = changeBadge(item.price_change);
    const allPricesArr = allPrices || [];

    // Global commentary / outlook come from first item (admin sets one per day)
    const commentary = allPricesArr.find(p => p.commentary)?.commentary || null;
    const outlook    = allPricesArr.find(p => p.outlook)?.outlook     || null;

    // Price context across today's crops
    const sorted   = [...allPricesArr].sort((a, b) => b.price_per_unit - a.price_per_unit);
    const rank     = sorted.findIndex(p => p.id === item.id) + 1;
    const maxP     = sorted[0]?.price_per_unit || 1;
    const minP     = sorted[sorted.length - 1]?.price_per_unit || 0;
    const pct      = Math.round(((item.price_per_unit - minP) / (maxP - minP || 1)) * 100);

    // Nearby / similar crops (same rough price tier ±30%)
    const similar = allPricesArr
        .filter(p => p.id !== item.id)
        .sort((a, b) => Math.abs(a.price_per_unit - item.price_per_unit) - Math.abs(b.price_per_unit - item.price_per_unit))
        .slice(0, 4);

    return (
        <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,8,4,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                key="detail-card"
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                className="relative w-full max-w-md max-h-[88vh] flex flex-col rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)] border border-white/10"
                style={{ background: 'rgba(5,20,10,0.96)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/8 hover:bg-white/15 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ── Hero price block ── */}
                <div className="px-6 pt-6 pb-5 border-b border-white/8 shrink-0">
                    <p className="text-[10px] font-bold text-green-400/70 uppercase tracking-widest mb-1">Market Price Detail</p>
                    <h2 className="text-2xl font-black text-white mb-1">{item.crop_name}</h2>

                    <div className="flex items-end gap-3 mb-3">
                        <div>
                            <span className="text-4xl font-black text-green-400">
                                KES {Number(item.price_per_unit).toLocaleString()}
                            </span>
                            <span className="text-white/40 text-base ml-1">/ {item.unit}</span>
                        </div>
                        {badge && (
                            <span className={`mb-1 inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                                <badge.Icon className="w-3.5 h-3.5" />
                                {badge.label} today
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-white/35 shrink-0" />
                        <p className="text-white/50 text-xs">{item.market}</p>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                    {/* ── Price position bar ── */}
                    {allPricesArr.length > 1 && (
                        <div className="px-6 py-4 border-b border-white/8">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Price Range Today</p>
                                <span className="text-[10px] text-white/30">#{rank} of {allPricesArr.length} crops</span>
                            </div>
                            <div className="relative h-2 bg-white/8 rounded-full overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-700 to-green-400"
                                    style={{ width: `${pct}%` }}
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-green-400 border-2 border-green-900 shadow"
                                    style={{ left: `calc(${pct}% - 6px)` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[9px] text-white/25">KES {minP.toLocaleString()}</span>
                                <span className="text-[9px] text-white/25">KES {maxP.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* ── Commentary (what caused this) ── */}
                    {commentary ? (
                        <div className="px-6 py-4 border-b border-white/8">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="p-1.5 rounded-lg bg-green-500/15">
                                    <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                                </div>
                                <p className="text-[11px] font-bold text-green-400 uppercase tracking-wider">What Caused These Prices</p>
                            </div>
                            <p className="text-white/65 text-[12px] leading-relaxed">{commentary}</p>
                        </div>
                    ) : (
                        <div className="px-6 py-4 border-b border-white/8 flex items-center gap-2 text-white/20">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p className="text-xs">No market analysis posted for this date.</p>
                        </div>
                    )}

                    {/* ── Outlook (what to expect) ── */}
                    {outlook && (
                        <div className="px-6 py-4 border-b border-white/8">
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="p-1.5 rounded-lg bg-emerald-500/15">
                                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">What to Expect Next</p>
                            </div>
                            <p className="text-white/65 text-[12px] leading-relaxed">{outlook}</p>
                        </div>
                    )}

                    {/* ── Price comparison to other crops ── */}
                    {similar.length > 0 && (
                        <div className="px-6 py-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-lg bg-blue-500/15">
                                    <Award className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Compare with Other Crops</p>
                            </div>
                            <div className="space-y-2">
                                {similar.map(p => {
                                    const diff    = p.price_per_unit - item.price_per_unit;
                                    const diffPct = item.price_per_unit > 0 ? ((diff / item.price_per_unit) * 100).toFixed(1) : '—';
                                    const b       = changeBadge(p.price_change);
                                    return (
                                        <div key={p.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/4 hover:bg-white/7 transition-colors">
                                            <div>
                                                <p className="text-white/80 text-[12px] font-semibold">{p.crop_name}</p>
                                                <p className="text-white/30 text-[10px]">{p.market.split(',')[0]}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/80 text-[12px] font-bold">KES {Number(p.price_per_unit).toLocaleString()}</p>
                                                <p className={`text-[10px] font-semibold ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-white/30'}`}>
                                                    {diff > 0 ? '+' : ''}{diffPct}% vs this
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-white/8 shrink-0">
                    <p className="text-white/20 text-[9px] text-center uppercase tracking-wider">
                        Farm with Irene · Prices updated daily
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main MarketTicker component ─────────────────────────────────────────────
const MarketTicker = ({ prices = [], priceDate, isLoading }) => {
    const [isOpen,    setIsOpen]    = useState(true);
    const [search,    setSearch]    = useState('');
    const [isPaused,  setIsPaused]  = useState(false);
    const [selected,  setSelected]  = useState(null);

    const scrollRef = useRef(null);
    const animRef   = useRef(null);
    const posRef    = useRef(0);

    const q        = search.trim().toLowerCase();
    const filtered = q
        ? prices.filter(p =>
            p.crop_name.toLowerCase().includes(q) ||
            p.market.toLowerCase().includes(q)
          )
        : prices;

    // Auto-scroll via rAF — seamless loop using duplicated list
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !isOpen || isPaused || q || selected || filtered.length < 3) {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            return;
        }
        let pos = posRef.current;
        const step = () => {
            pos += 0.45;
            const half = el.scrollHeight / 2;
            if (pos >= half) pos = 0;
            el.scrollTop = pos;
            posRef.current = pos;
            animRef.current = requestAnimationFrame(step);
        };
        animRef.current = requestAnimationFrame(step);
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [isOpen, isPaused, q, selected, filtered.length]);

    // Reset scroll when search clears
    useEffect(() => {
        if (!q && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
            posRef.current = 0;
        }
    }, [q]);

    // Close detail with Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setSelected(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const formattedDate = priceDate
        ? new Date(priceDate + 'T12:00:00').toLocaleDateString('en-KE', {
            weekday: 'short', day: 'numeric', month: 'short'
          })
        : null;

    return (
        <>
            {/* ── Toggle tab ── */}
            <motion.button
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4, type: 'spring', stiffness: 220, damping: 22 }}
                onClick={() => setIsOpen(o => !o)}
                aria-label={isOpen ? 'Hide market prices' : 'Show market prices'}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5 px-2 py-4 rounded-l-xl shadow-2xl transition-colors duration-200"
                style={{ background: 'rgba(22,101,52,0.92)', backdropFilter: 'blur(10px)' }}
            >
                <BarChart2 className="w-4 h-4 text-green-300" />
                <span
                    className="text-[9px] font-black uppercase tracking-widest text-green-200"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    Markets
                </span>
                <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <ChevronRight className="w-3 h-3 text-green-300" />
                </motion.div>
            </motion.button>

            {/* ── Floating panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="market-panel"
                        initial={{ x: '110%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '110%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                        className="fixed right-10 top-1/2 -translate-y-1/2 z-40 w-72 flex flex-col rounded-2xl overflow-hidden border border-white/8"
                        style={{
                            background: 'rgba(4,18,9,0.88)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            maxHeight: '72vh',
                            boxShadow: '0 8px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(74,222,128,0.06)',
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Header */}
                        <div className="px-4 pt-4 pb-3 shrink-0 border-b border-white/8">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                    </span>
                                    <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">
                                        Live Market Prices
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/25 hover:text-white/60 transition-colors p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {formattedDate && (
                                <p className="text-white/30 text-[10px] mb-3">{formattedDate} · Tap a crop for details</p>
                            )}
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25 pointer-events-none" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Crop name or market..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-7 py-1.5 text-[11px] text-white/80 placeholder-white/25 focus:outline-none focus:border-green-500/40 focus:bg-white/8 transition-all"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price list */}
                        <div
                            ref={scrollRef}
                            className="flex-1"
                            style={{ overflowY: q ? 'auto' : 'hidden', scrollbarWidth: 'none' }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center h-32 gap-2 text-white/30">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs">Loading prices...</span>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-white/25 gap-2">
                                    <Search className="w-5 h-5 opacity-40" />
                                    <p className="text-xs">No results for "{search}"</p>
                                </div>
                            ) : (
                                // Duplicate for seamless loop (only when not searching)
                                <div>
                                    {filtered.map((item, i) => (
                                        <PriceRow key={`${item.id}-a-${i}`} item={item} onClick={setSelected} />
                                    ))}
                                    {!q && filtered.map((item, i) => (
                                        <PriceRow key={`${item.id}-b-${i}`} item={item} onClick={setSelected} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 shrink-0 border-t border-white/8 flex items-center justify-between">
                            <p className="text-white/20 text-[9px] uppercase tracking-wider">Farm with Irene</p>
                            {!q && filtered.length > 0 && (
                                <p className="text-white/20 text-[9px]">
                                    {isPaused ? 'Paused' : 'Auto-scroll'} · {filtered.length} crops
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Detail overlay ── */}
            <AnimatePresence>
                {selected && (
                    <DetailOverlay
                        item={selected}
                        allPrices={prices}
                        onClose={() => setSelected(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MarketTicker;
