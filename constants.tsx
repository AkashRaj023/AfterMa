
import { RecoveryActivity, RecoveryPhase, StoreItem } from './types';

export const COLORS = {
  pink: { 
    primary: '#EC4899', // Slightly deeper pink for visibility
    bg: '#FFF5F7', 
    border: '#F9A8D4', 
    text: '#831843', 
    ring: 'ring-pink-200',
    light: '#FDF2F8'
  },
  green: { 
    primary: '#10B981', // More vibrant emerald for visibility
    bg: '#F0FDF4', 
    border: '#A7F3D0', 
    text: '#064E3B', 
    ring: 'ring-emerald-200',
    light: '#ECFDF5'
  },
  blue: { 
    primary: '#0EA5E9', // Stronger sky blue
    bg: '#F0F9FF', 
    border: '#BAE6FD', 
    text: '#0C4A6E', 
    ring: 'ring-sky-200',
    light: '#F0F9FF'
  },
  grey: { 
    primary: '#64748B', // Medium slate
    bg: '#F8FAFC', 
    border: '#CBD5E1', 
    text: '#334155', 
    ring: 'ring-slate-200',
    light: '#F8FAFC'
  },
  yellow: { 
    primary: '#F59E0B', // Warm amber/yellow
    bg: '#FFFBEB', 
    border: '#FBBF24', 
    text: '#92400E', 
    ring: 'ring-amber-200',
    light: '#FFFBEB'
  }
};

export const PRICING = { plus: 399 };
export const SLOGAN = "Safe Healing Journey";

export const HELPLINES = {
  india: {
    name: "Kiran Mental Health",
    number: "1800-599-0019",
    label: "24/7 National Helpline"
  },
  emergency: "112"
};

export const PHASES: RecoveryPhase[] = ['Stabilize', 'Strengthen', 'Restore', 'Rebuild Confidence'];

export const RECOVERY_DATABASE: RecoveryActivity[] = [
  // Phase 1: Stabilize
  { id: 'st-1', phase: 'Stabilize', category: 'breathing', title: 'Deep Diaphragmatic Breath', description: 'Gently expand your belly as you inhale. Essential for internal pressure management.', duration: 5, points: 10, intensityScale: 1 },
  { id: 'st-2', phase: 'Stabilize', category: 'pelvic', title: 'Gentle Floor Awareness', description: 'Visualization and very light engagement of the pelvic floor.', duration: 3, points: 10, intensityScale: 1 },
  { id: 'st-cs-1', phase: 'Stabilize', category: 'physio', title: 'Log Rolling Technique', description: 'Safe way to get out of bed without straining incision.', duration: 2, points: 15, typeSpecific: 'c-section', intensityScale: 2 },
  
  // Phase 2: Strengthen
  { id: 'sg-1', phase: 'Strengthen', category: 'pelvic', title: 'Timed Kegel Series', description: 'Structured holds and releases to build functional strength.', duration: 5, points: 20, intensityScale: 3 },
  { id: 'sg-2', phase: 'Strengthen', category: 'physio', title: 'Transverse Abdominal Wake-up', description: 'Subtle deep core engagement without crunching.', duration: 4, points: 20, intensityScale: 4 },
  
  // Phase 3: Restore
  { id: 'rt-1', phase: 'Restore', category: 'walking', title: 'Structured Interval Walk', description: '10 min walk with posture focus.', duration: 10, points: 30, intensityScale: 5 },
  { id: 'rt-2', phase: 'Restore', category: 'stretching', title: 'Post-Nursing Neck Stretch', description: 'Relieve tension from nursing or holding the baby.', duration: 5, points: 15, intensityScale: 3 },
  
  // Phase 4: Rebuild Confidence
  { id: 'rb-1', phase: 'Rebuild Confidence', category: 'physio', title: 'Functional Mobility Flow', description: 'Gentle full-body movement patterns.', duration: 15, points: 50, intensityScale: 7 },
  { id: 'rb-cp', phase: 'Rebuild Confidence', category: 'checkpoint', title: 'Diastasis Recti Final Check', description: 'Assess core closure before advanced activity.', duration: 10, points: 100, intensityScale: 2 }
];

export const STABILIZATION_TASKS = [
  "Gratitude: Write 3 small wins from today.",
  "Bonding: 5 mins of skin-to-skin or eye contact.",
  "Grounding: Notice 5 things you can see and 4 you can touch.",
  "Hydration: Drink a glass of warm Ajwain water."
];

export const NUTRITION_GUIDE = [
  { 
    title: "Iron & Energy", 
    items: ["Ragi (Finger Millet)", "Spinach", "Beetroot", "Traditional Soup (Shorba)"],
    benefit: "Replenishes blood loss and prevents anemia."
  },
  { 
    title: "Digestive Health", 
    items: ["Ajwain Water", "Fenugreek (Methi)", "Lauki (Bottle Gourd)"],
    benefit: "Aids digestion and lactation."
  },
  { 
    title: "Calcium Recovery", 
    items: ["Dairy/Curd", "Sesame Seeds", "Almonds"],
    benefit: "Supports bone health and milk production."
  }
];

export const EPDS_QUESTIONS = [
  "I have been able to laugh and see the bright side of things.",
  "I have looked forward with enjoyment to things.",
  "I have blamed myself unnecessarily when things went wrong.",
  "I have been anxious or worried for no good reason.",
  "I have felt scared or panicky for no very good reason.",
  "Things have been getting on top of me.",
  "I have been so unhappy that I have had difficulty sleeping.",
  "I have felt sad or miserable.",
  "I have been so unhappy that I have been crying.",
  "The thought of harming myself has occurred to me."
];

export const STORE_ITEMS: StoreItem[] = [
  { id: 'p1', name: 'Organic Nipple Balm', brand: 'Lansinoh', category: 'Recovery', price: 450, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200', description: 'Soothes and protects sensitive skin.', rating: 4.8 },
  { id: 'p2', name: 'Cotton Belly Wrap', brand: 'Mothercare', category: 'Recovery', price: 1200, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=200', description: 'Comfortable support for postpartum core.', rating: 4.9 },
  { id: 'p3', name: 'Cerelac Wheat-Apple', brand: 'Nestlé', category: 'Nutrition', price: 350, image: 'https://images.unsplash.com/photo-1544787210-2211d430154e?auto=format&fit=crop&q=80&w=200', description: 'Traditional infant nutrition supplement.', rating: 4.7 },
  { id: 'p4', name: 'Symphony Breast Pump', brand: 'Medela', category: 'Devices', price: 4500, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200', description: 'Hospital-grade efficiency for home use.', rating: 4.6 },
  { id: 'p5', name: 'Pure Almond Baby Oil', brand: 'Himalaya', category: 'Baby Care', price: 250, image: 'https://images.unsplash.com/photo-1555820585-c5ae44394b79?auto=format&fit=crop&q=80&w=200', description: 'Traditional Ayurvedic care for infants.', rating: 4.9 },
  { id: 'p6', name: 'Diaper Rash Cream', brand: 'Sebamed', category: 'Baby Care', price: 550, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=200', description: 'pH balanced clinical protection.', rating: 4.8 },
  { id: 'p7', name: 'Stretch Mark Lotion', brand: 'Mamaearth', category: 'Recovery', price: 499, image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=200', description: 'Toxin-free care for recovery skin.', rating: 4.7 },
  { id: 'p8', name: 'Natural Baby Wipes', brand: 'Johnson & Johnson', category: 'Baby Care', price: 199, image: 'https://images.unsplash.com/photo-1584305650818-bc19bca9445a?auto=format&fit=crop&q=80&w=200', description: 'Clinically proven mildness for soft skin.', rating: 4.6 },
  { id: 'p9', name: 'Avent Natural Bottle', brand: 'Philips Avent', category: 'Devices', price: 850, image: 'https://images.unsplash.com/photo-1610492317734-d89741c8c114?auto=format&fit=crop&q=80&w=200', description: 'Wide breast-shaped nipple for natural latch.', rating: 4.8 },
  { id: 'p10', name: 'Postpartum Tea Mix', brand: 'Pigeon', category: 'Nutrition', price: 420, image: 'https://images.unsplash.com/photo-1594631252845-595b998e31b6?auto=format&fit=crop&q=80&w=200', description: 'Supports lactation and digestive ease.', rating: 4.5 },
  { id: 'p11', name: 'Baby Bath Foam', brand: 'Chicco', category: 'Baby Care', price: 600, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=200', description: 'No-tears formula with calendula.', rating: 4.7 },
  { id: 'p12', name: 'Bio-Oil Skincare Oil', brand: 'Bio-Oil', category: 'Recovery', price: 700, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200', description: 'Specialist scar and stretch mark treatment.', rating: 4.9 },
  { id: 'p13', name: 'Comfort Nursing Bra', brand: 'FirstCry', category: 'Recovery', price: 890, image: 'https://images.unsplash.com/photo-1582533089852-02c3cd51aa5a?auto=format&fit=crop&q=80&w=200', description: 'Seamless support for all-day wear.', rating: 4.8 },
];

export const EXPERT_DATA = [
  // Physiotherapy
  { category: 'Physiotherapy', name: 'Dr. Shweta Singh', role: 'Pelvic Floor Physiotherapist', credentials: 'MPT (Obstetrics & Gynecology), 12+ Years Exp.', insight: 'Core stability starts with the breath; focus on your diaphragm to heal the pelvic floor.', price: '₹1200' },
  { category: 'Physiotherapy', name: 'Dr. Rohan Das', role: 'Rehab Specialist', credentials: 'MPT (Sports Rehab), 8+ Years Exp.', insight: 'Gentle steps lead to great strides in abdominal recovery.', price: '₹1100' },
  { category: 'Physiotherapy', name: 'Dr. Anjali Deshmukh', role: 'Pelvic Health Expert', credentials: 'BPT, Specialized in Postpartum Physio', insight: 'Listening to your pelvic floor is the first step to reclaiming your strength.', price: '₹1000' },
  { category: 'Physiotherapy', name: 'Dr. Vikram Seth', role: 'Senior Physiotherapist', credentials: 'MPT, Max Hospital Fellow', insight: 'Functional stability is the key foundation for pain-free motherhood.', price: '₹1300' },
  
  // OB-GYN
  { category: 'OB-GYN', name: 'Dr. Meena Iyer', role: 'Senior Obstetrician', credentials: 'MD, DNB (OB-GYN), Apollo Hospitals', insight: 'Recovery is a marathon, not a sprint. Listen to your body’s signals for rest.', price: '₹1500' },
  { category: 'OB-GYN', name: 'Dr. Sunita Kapoor', role: 'Maternal Care Specialist', credentials: 'MBBS, MS (OB-GYN), 15+ Years Exp.', insight: 'Proper nutrition is as important as physical rest for internal healing.', price: '₹1400' },
  { category: 'OB-GYN', name: 'Dr. Preeti Verma', role: 'Gynae Surgeon', credentials: 'MD (OB-GYN), Fortis Healthcare', insight: 'Incision care and gentle movement are the pillars of surgical recovery.', price: '₹1600' },
  { category: 'OB-GYN', name: 'Dr. Lakshmi Narayan', role: 'Women Wellness Expert', credentials: 'DGO, Maternal Health Researcher', insight: 'Mental and physical health are deeply linked in the postpartum period.', price: '₹1200' },

  // Lactation
  { category: 'Lactation', name: 'Dr. Kavita Reddy', role: 'IBCLC Lactation Consultant', credentials: 'Certified Lactation Professional', insight: 'A good latch is the foundation of a happy feeding journey for both mother and child.', price: '₹1000' },
  { category: 'Lactation', name: 'Dr. Smita Patil', role: 'Feeding Counselor', credentials: 'Certified Breastfeeding Counselor (BPNI)', insight: 'Patience and persistence are your best allies in establishing milk supply.', price: '₹900' },
  { category: 'Lactation', name: 'Dr. Neha Sharma', role: 'Lactation Expert', credentials: 'Certified Consultant, Cloudnine Hospitals', insight: 'Correct positioning can alleviate the majority of nursing discomfort.', price: '₹1100' },
  { category: 'Lactation', name: 'Dr. Priya Bansal', role: 'Child Nutritionist', credentials: 'M.Sc. Nutrition, IBCLC Associate', insight: 'Hydration and balanced meals directly support a sustainable nursing journey.', price: '₹1200' }
];

export const NGO_DATA = [
  { name: 'White Swan Foundation', area: 'Mental Health Awareness', contact: '080-2555-5555', website: 'whiteswanfoundation.org' },
  { name: 'Sangath', area: 'Maternal Mental Health', contact: '011-4050-6666', website: 'sangath.in' },
  { name: 'The Banyan', area: 'Crisis Support', contact: '044-2454-5555', website: 'thebanyan.org' }
];

export const INSURANCE_DATA = [
  { bank: 'SBI Life', plan: 'Sampoorna Suraksha', benefit: 'Maternity Rider & Newborn Cover', minAge: 18 },
  { bank: 'ICICI Lombard', plan: 'Health Shield', benefit: 'Cashless Delivery & Recovery Assist', minAge: 21 },
  { bank: 'Canara Bank', plan: 'Canara Health Plus', benefit: 'Low-cost Premium for Young Mothers', minAge: 18 },
  { bank: 'Axis Bank', plan: 'Axis Care Plus', benefit: 'Exclusive Postpartum Wellness Benefits', minAge: 25 }
];

export const GOVT_SCHEMES = [
  { title: 'PMMVY', fullName: 'Pradhan Mantri Matru Vandana Yojana', benefit: '₹5,000 Direct Benefit Transfer', eligibility: 'First-time mothers' },
  { title: 'JSY', fullName: 'Janani Suraksha Yojana', benefit: 'Financial assistance for institutional delivery', eligibility: 'Below Poverty Line mothers' },
  { title: 'JSSK', fullName: 'Janani Shishu Suraksha Karyakram', benefit: 'Zero-cost cashless delivery & treatment', eligibility: 'All pregnant women in govt hospitals' }
];
