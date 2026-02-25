
import React, { useState } from 'react';
import { StoreItem, CartItem, UserProfile } from '../types';
import { STORE_ITEMS, COLORS } from '../constants';
import { ShoppingBag, Star, Plus, Minus, Package, ChevronRight, Filter, X, ShieldCheck, Heart, Sparkles, ArrowRight, CreditCard, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';

interface MomKartProps { profile: UserProfile; }

const CATEGORIES = ['All', 'Baby Care', 'Recovery', 'Nutrition', 'Devices', 'Maternity Care'];

const MomKart: React.FC<MomKartProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'nb'>('upi');
  
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const addToCart = (item: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.09; // 9% SGST + 9% CGST = 18% Total
  const sgst = Math.round(cartSubtotal * taxRate);
  const cgst = Math.round(cartSubtotal * taxRate);
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = cartSubtotal + sgst + cgst + deliveryCharge;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const options = {
      key: "rzp_test_your_key_here", // Replace with actual key
      amount: total * 100, // Amount in paise
      currency: "INR",
      name: "AfterMa Store",
      description: "Maternal Care Essentials",
      image: "https://picsum.photos/200",
      handler: function (response: any) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        setCart([]);
        setShowCart(false);
      },
      prefill: {
        name: profile.name,
        email: "mom@example.com",
        contact: profile.caregiver.contact || "9999999999",
      },
      theme: {
        color: theme.primary,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const filteredItems = activeCategory === 'All' ? STORE_ITEMS : STORE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="animate-in w-full -mt-4 lg:-mt-8 pb-32 relative">
      {/* Floating Basket Anchor */}
      <button 
        onClick={() => setShowCart(true)}
        className="fixed bottom-10 right-10 z-[55] h-16 w-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">{cart.length}</span>}
      </button>

      <div className="bg-white border-b border-gray-100 px-6 lg:px-12 py-3 flex items-center gap-8 sticky top-[64px] lg:top-[80px] z-[45] shadow-sm -mx-4 lg:-mx-8 transition-all duration-300">
        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 pr-8 shrink-0">
          <Filter size={12} className="text-slate-300" />
          <span>Curations</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95 ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{cat}</button>
          ))}
        </div>
        <div className="shrink-0 hidden lg:flex items-center gap-6 border-l border-slate-100 pl-8">
          <button onClick={() => setShowCart(true)} className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-600 text-white transition-all text-[11px] font-bold active:scale-95 group shadow-xl">
            <ShoppingBag size={14} />
            <span>Cart</span>
            <div className="bg-white/20 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold">{cart.length}</div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 mt-10 px-0 md:px-2">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.01)] p-10 lg:p-14 group">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100"><Sparkles size={14} className="text-slate-400" /><span className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.2em]">Verified Recovery Essentials</span></div>
            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">The Safe Store <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400">for Maternal Care.</span></h2>
            <p className="text-slate-500 text-sm lg:text-lg font-medium max-w-lg leading-relaxed opacity-85">20+ hand-picked clinical grade products to support your Nurture, Transition, and Healing phases.</p>
          </div>
          <div className="absolute right-[-2%] top-[-5%] h-[110%] w-2/5 opacity-[0.02] pointer-events-none flex items-center justify-center translate-x-12 group-hover:scale-105 transition-all duration-[2000ms]"><Package size={500} className="text-slate-900 -rotate-12" /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] transition-all duration-500 group flex flex-col h-full overflow-hidden relative hover:translate-y-[-6px]">
              <div className="relative aspect-[4/5] bg-slate-50/30 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/40"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-[10px] font-bold text-slate-800">{item.rating}</span></div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center"><p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em]">{item.brand}</p><span className="text-[7px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">{item.category}</span></div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug h-9 line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                  <span className="text-xl font-bold text-slate-900 tracking-tight">₹{item.price}</span>
                  <button onClick={() => addToCart(item)} className="h-11 w-11 rounded-full text-white transition-all duration-500 active:scale-90 shadow-lg hover:shadow-xl flex items-center justify-center group/btn relative overflow-hidden" style={{ backgroundColor: theme.primary }}><Plus size={20} strokeWidth={3} className="relative z-10 group-hover/btn:rotate-90 transition-transform" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCart && (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-400 lg:rounded-l-[3rem] overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100 shadow-inner"><ShoppingBag size={20} /></div>
                 <div className="space-y-0.5"><h3 className="text-xl font-bold text-slate-900 tracking-tight">Healing Cart</h3><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{cart.length} verified items</p></div>
              </div>
              <button onClick={() => setShowCart(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-white border border-slate-50 shadow-sm group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0"><img src={item.image} className="w-full h-full object-cover" alt={item.name} /></div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                       <h4 className="font-bold text-slate-900 text-[13px] line-clamp-1">{item.name}</h4>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-400 transition-colors"><X size={14} /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">₹{item.price}</span>
                      <div className="flex items-center gap-3 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-300"><Minus size={12} strokeWidth={3} /></button>
                        <span className="text-[11px] font-bold min-w-[14px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-300"><Plus size={12} strokeWidth={3} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-slate-50 bg-slate-50/30 space-y-8 rounded-t-[3rem]">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold text-slate-400"><span>Subtotal</span><span className="text-slate-900">₹{cartSubtotal}</span></div>
                  <div className="flex justify-between text-xs font-bold text-slate-400"><span>GST (18%)</span><span className="text-slate-900">₹{sgst + cgst}</span></div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-3"><span>Express Delivery</span><button onClick={() => setExpressDelivery(!expressDelivery)} className={`w-9 h-5 rounded-full relative transition-all duration-300 ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${expressDelivery ? 'left-4.5' : 'left-0.5'}`} /></button></div>
                    <span className={expressDelivery ? 'text-slate-900' : 'text-emerald-500'}>{expressDelivery ? '+₹49' : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold text-slate-900 pt-4 border-t border-slate-100 tracking-tight"><span>Total</span><span>₹{total}</span></div>
                </div>

                <div className="space-y-4">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Payment Method</p>
                   <div className="grid grid-cols-3 gap-3">
                      <PaymentTab active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} icon={<Smartphone size={16} />} label="UPI" />
                      <PaymentTab active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={16} />} label="Card" />
                      <PaymentTab active={paymentMethod === 'nb'} onClick={() => setPaymentMethod('nb')} icon={<Landmark size={16} />} label="NetBank" />
                   </div>
                </div>

                <button 
                  className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold text-sm shadow-2xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                  onClick={handleCheckout}
                >
                  Confirm Order <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
     {icon}
     <span className="text-[9px] font-bold uppercase">{label}</span>
  </button>
);

export default MomKart;
