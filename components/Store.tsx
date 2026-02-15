
import React, { useState } from 'react';
import { StoreItem, CartItem, UserProfile } from '../types';
import { STORE_ITEMS, COLORS } from '../constants';
import { ShoppingBag, Star, Plus, Minus, Package, ChevronRight, Filter, X, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface MomKartProps { profile: UserProfile; }

const CATEGORIES = ['All', 'Baby Care', 'Recovery', 'Nutrition', 'Devices'];

const MomKart: React.FC<MomKartProps> = ({ profile }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expressDelivery, setExpressDelivery] = useState(false);
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
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = cartSubtotal + deliveryCharge;

  const filteredItems = activeCategory === 'All' 
    ? STORE_ITEMS 
    : STORE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="animate-in w-full -mt-4 lg:-mt-8 pb-32">
      {/* Apple-style Liquid Glass Sub-Navbar - Sticky but refined */}
      <div 
        className="bg-white/60 backdrop-blur-3xl border-b border-white/40 px-6 lg:px-12 py-4 flex items-center gap-8 sticky top-[64px] lg:top-[80px] z-[45] shadow-[0_4px_30px_rgba(0,0,0,0.03)] -mx-4 lg:-mx-8 transition-all duration-500"
      >
        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] border-r border-slate-200/50 pr-8 shrink-0">
          <Filter size={14} className="text-slate-300" strokeWidth={2.5} />
          <span>Curations</span>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 ${
                activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-2xl scale-[1.05]' 
                : 'bg-white/50 text-slate-500 hover:bg-white hover:text-slate-900 border border-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="shrink-0 flex items-center gap-6 border-l border-slate-200/50 pl-8">
          <button 
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/5 hover:bg-slate-900/10 text-slate-900 transition-all text-xs font-bold active:scale-95 group shadow-sm border border-white"
          >
            <ShoppingBag size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="hidden md:inline">Basket</span>
            <div 
              className="text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-xl"
              style={{ backgroundColor: theme.primary }}
            >
              {cart.length}
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-14 mt-14 px-0 md:px-2">
        {/* Modern Apple Satin Hero Section */}
        <div className="relative rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/50 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.02)] p-12 lg:p-20 group">
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-900/5 rounded-xl border border-white shadow-inner"><Sparkles size={18} className="text-slate-400" /></div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em]">Ethically Sourced & Vetted</span>
            </div>
            <h2 className="text-4xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
              Healing Essentials <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400">for New Mothers.</span>
            </h2>
            <p className="text-slate-500 text-base lg:text-xl font-medium max-w-xl leading-relaxed opacity-85 italic">
              "Curating only the safest, clinically-recommended recovery and baby-care products for your delicate sanctuary."
            </p>
            <div className="flex flex-wrap items-center gap-10 pt-6">
               <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600/80">
                 <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100/50 shadow-inner"><ShieldCheck size={20} /></div>
                 Clinical Grade
               </div>
               <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-pink-500/80">
                 <div className="p-2 bg-pink-50 rounded-2xl border border-pink-100/50 shadow-inner"><Heart size={20} /></div>
                 Gentle Care
               </div>
            </div>
          </div>
          <div className="absolute right-[-5%] top-[-10%] h-[120%] w-2/5 opacity-[0.02] pointer-events-none flex items-center justify-center translate-x-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-[3000ms] ease-in-out">
             <Package size={600} className="text-slate-900 -rotate-12" />
          </div>
        </div>

        {/* Cohesive Apple Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-[3rem] border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 group flex flex-col h-full overflow-hidden relative hover:translate-y-[-12px]">
              <div className="relative aspect-[4/5] bg-slate-50/50 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                <div className="absolute top-6 right-6 bg-white/70 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-white/40">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-[12px] font-bold text-slate-900">{item.rating}</span>
                </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">{item.brand}</p>
                    <span className="text-[9px] font-bold bg-slate-50 text-slate-400 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-100/50">{item.category}</span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight h-12 line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed opacity-75 italic">"{item.description}"</p>
                </div>
                
                <div className="flex items-center justify-between pt-10 mt-8 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-slate-900 tracking-tighter leading-none">₹{item.price}</span>
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1.5 opacity-80">Verified Brand</span>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="h-16 w-16 rounded-full text-white transition-all duration-500 active:scale-90 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center group/btn relative overflow-hidden"
                    style={{ backgroundColor: theme.primary, background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)` }}
                  >
                    <Plus size={28} strokeWidth={3} className="relative z-10 group-hover/btn:rotate-90 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Slide-out Basket - Frosted Liquid Glass */}
      {showCart && (
        <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex justify-end animate-in fade-in duration-500">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-[60px] h-full shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[4rem] border-l border-white/50 overflow-hidden">
            <div className="p-12 flex justify-between items-center border-b border-white/40">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-slate-900/5 rounded-3xl text-slate-400 shadow-inner border border-white">
                   <ShoppingBag size={32} />
                 </div>
                 <div className="space-y-1">
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Your Bag</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{cart.length} Recovery Essentials</p>
                 </div>
              </div>
              <button onClick={() => setShowCart(false)} className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white/80 rounded-full transition-all shadow-sm">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-10">
                  <div className="p-16 bg-white/40 rounded-full shadow-inner border border-white"><Package size={100} className="text-slate-200" /></div>
                  <div className="space-y-3">
                    <p className="font-bold text-slate-900 text-2xl tracking-tight">Your bag is currently light</p>
                    <p className="text-base text-slate-400 font-medium italic">Explore our healing collections for you and your baby.</p>
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-8 p-8 rounded-[3rem] bg-white border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-white/80 shadow-inner">
                       <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                      <div className="flex justify-between items-start gap-4">
                         <div className="space-y-1.5">
                           <h4 className="font-bold text-slate-900 text-base line-clamp-1 leading-tight tracking-tight">{item.name}</h4>
                           <p className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.25em]">{item.brand}</p>
                         </div>
                         <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <span className="font-bold text-slate-900 text-xl tracking-tighter">₹{item.price}</span>
                        <div className="flex items-center gap-5 bg-slate-50/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/60 shadow-inner">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-300 hover:text-slate-900 transition-colors"><Minus size={18} strokeWidth={3} /></button>
                          <span className="text-base font-bold min-w-[20px] text-center text-slate-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-300 hover:text-slate-900 transition-colors"><Plus size={18} strokeWidth={3} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-12 border-t border-white/40 bg-white/40 space-y-10 rounded-t-[4rem] shadow-[0_-20px_80px_rgba(0,0,0,0.04)]">
                <div className="space-y-5">
                  <div className="flex justify-between text-base font-bold text-slate-400"><span>Subtotal</span><span className="text-slate-900 tracking-tight">₹{cartSubtotal}</span></div>
                  <div className="flex justify-between items-center text-base font-bold text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>Express Care</span>
                      <button 
                        onClick={() => setExpressDelivery(!expressDelivery)} 
                        className={`w-12 h-7 rounded-full relative transition-all duration-500 shadow-inner ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${expressDelivery ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <span className={expressDelivery ? 'text-slate-900 font-bold' : 'text-emerald-500'}>{expressDelivery ? '+₹49' : 'Complimentary'}</span>
                  </div>
                  <div className="flex justify-between text-4xl font-bold text-slate-900 pt-8 border-t border-white/60 tracking-tighter"><span>Total</span><span>₹{total}</span></div>
                </div>
                <button 
                  className="w-full py-7 text-white rounded-[2.5rem] font-bold text-lg tracking-wide shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-5"
                  style={{ backgroundColor: theme.primary, background: `linear-gradient(135deg, ${theme.primary}, ${theme.text}dd)` }}
                  onClick={() => { alert(`Securing Checkout for ₹${total}...`); setShowCart(false); }}
                >
                  Confirm Checkout <ChevronRight size={28} />
                </button>
                <div className="flex items-center justify-center gap-3 opacity-40 grayscale pb-2">
                   <ShieldCheck size={18} /> <span className="text-[10px] font-bold uppercase tracking-[0.25em]">AES-256 Encrypted Payment</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MomKart;
