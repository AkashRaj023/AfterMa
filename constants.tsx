
import { RecoveryActivity, RecoveryPhase, StoreItem } from './types';

export const COLORS = {
  PINK: { primary: '#EC4899', bg: '#FFF5F7', border: '#F9A8D4', text: '#831843', ring: 'ring-pink-200', light: '#FFF5F7' },
  GREEN: { primary: '#10B981', bg: '#F0FDF4', border: '#A7F3D0', text: '#064E3B', ring: 'ring-emerald-200', light: '#F0FDF4' },
  BLUE: { primary: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD', text: '#0C4A6E', ring: 'ring-sky-200', light: '#F0F9FF' },
  PURPLE: { primary: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', text: '#4C1D95', ring: 'ring-purple-200', light: '#F5F3FF' },
  YELLOW: { primary: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', text: '#78350F', ring: 'ring-amber-200', light: '#FFFBEB' }
};

export const PRICING = { plus: 399 };
export const SLOGAN = "Safe Healing Journey";

export const HELPLINES = {
  india: { name: "Kiran Mental Health", number: "1800-599-0019", label: "24/7 National Helpline" },
  emergency: "112"
};

export const PHASES: RecoveryPhase[] = [
  'Pre-conception', 'Trimester 1', 'Trimester 2', 'Trimester 3', 
  'Month 1', 'Month 2', 'Month 3', 'Month 4+'
];

export const RECOVERY_DATABASE: RecoveryActivity[] = [
  // Nurture Phase (Prenatal)
  { id: 't1-1', phase: 'Trimester 1', category: 'Prenatal Care', title: 'Nausea Management', description: 'Gentle hydration and dry ginger tracking to soothe morning sickness.', duration: 5, frequency: 'Daily', points: 15, intensityScale: 1 },
  { id: 't1-2', phase: 'Trimester 1', category: 'Prenatal Care', title: 'Pelvic Floor Intro', description: 'Visualizing engagement and diaphragmatic breathing for stability.', duration: 8, frequency: 'Daily', points: 20, intensityScale: 2 },
  { id: 't2-1', phase: 'Trimester 2', category: 'Physical Recovery', title: 'Round Ligament Mobility', description: 'Stretches to alleviate hip and groin discomfort.', duration: 12, frequency: 'Daily', points: 25, intensityScale: 3 },
  { id: 't2-2', phase: 'Trimester 2', category: 'Prenatal Care', title: 'Iron-Rich Snacking', description: 'Tracking spinach, dates, and beetroot intake.', duration: 2, frequency: 'Daily', points: 10, intensityScale: 1 },
  
  // Birth Transition Phase (Trimester 3 / Immediate Post)
  { id: 't3-1', phase: 'Trimester 3', category: 'Birth Prep', title: 'Perineal Preparation', description: 'Techniques for tissue elasticity and labor readiness.', duration: 10, frequency: 'Daily', points: 30, intensityScale: 2 },
  { id: 't3-2', phase: 'Trimester 3', category: 'Birth Prep', title: 'Labor Breathing Drills', description: 'Controlled exhalation techniques for contractions.', duration: 15, frequency: 'Daily', points: 35, intensityScale: 3 },
  { id: 'm1-p1', phase: 'Month 1', category: 'Physical Recovery', title: 'First Week Triage', description: 'Monitoring lochia and incision healing signs.', duration: 5, frequency: 'Daily', points: 50, intensityScale: 1 },

  // Healing Phase (Postpartum Recovery)
  { id: 'm1-e1', phase: 'Month 1', category: 'Emotional Stabilization', title: 'Hormonal Reset Breath', description: 'Calming the nervous system during the baby blues window.', duration: 10, frequency: 'Daily', points: 20, intensityScale: 1 },
  { id: 'm1-s1', phase: 'Month 1', category: 'Strength Building', title: 'Pelvic Power 1.0', description: 'Low intensity kegel sets for initial restoration.', duration: 5, frequency: 'Daily', points: 25, intensityScale: 2 },
  { id: 'm2-p1', phase: 'Month 2', category: 'Physical Recovery', title: 'Diastasis Check', description: 'Self-assessment and initial core alignment drills.', duration: 10, frequency: '3x week', points: 40, intensityScale: 3 },
  { id: 'm3-s1', phase: 'Month 3', category: 'Strength Building', title: 'Postpartum Core Restore', description: 'Safe transverse abdominis activation.', duration: 15, frequency: '3x week', points: 45, intensityScale: 5 }
];

export const STABILIZATION_TASKS = [
  "Safe Space: Light a lavender candle and breathe for 2 mins.",
  "Connection: Place hands on bump or hold baby skin-to-skin.",
  "Hydration: One full glass of warm mineralized water.",
  "Gratitude: One thing your body did well today."
];

export const NUTRITION_GUIDE = [
  { title: 'Warming Foods', items: ['Ginger Tea', 'Turmeric Milk', 'Warm Porridge'], benefit: 'Aids digestion and reduces inflammation.' },
  { title: 'Iron & Energy', items: ['Spinach', 'Lentils', 'Dates'], benefit: 'Replenishes blood loss and boosts stamina.' },
  { title: 'Lactation Support', items: ['Fenugreek', 'Fennel Seeds', 'Oats'], benefit: 'Supports healthy milk supply naturally.' }
];

export const EPDS_QUESTIONS = [
  { id: 1, question: "I have been able to laugh and see the funny side of things", options: ["As much as I always could", "Not quite so much now", "Definitely not so much now", "Not at all"] },
  { id: 2, question: "I have looked forward with enjoyment to things", options: ["As much as I ever did", "Rather less than I used to", "Definitely less than I used to", "Hardly at all"] },
  { id: 3, question: "I have blamed myself unnecessarily when things went wrong", options: ["Yes, most of the time", "Yes, some of the time", "Not very often", "No, never"] },
  { id: 4, question: "I have been anxious or worried for no good reason", options: ["No, not at all", "Hardly ever", "Yes, sometimes", "Yes, very often"] },
  { id: 5, question: "I have felt scared or panicky for no very good reason", options: ["Yes, quite a lot", "Yes, sometimes", "No, not much", "No, not at all"] }
];

export const STORE_ITEMS: StoreItem[] = [
  // Recovery (6)
  { id: 'p1', name: 'Organic Nipple Balm', brand: 'Mamaearth', category: 'Recovery', price: 450, image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400', description: 'Soothes and protects sensitive skin.', rating: 4.8 },
  { id: 'p2', name: 'Cotton Belly Wrap', brand: 'FirstCry', category: 'Recovery', price: 1200, image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400', description: 'Comfortable support for postpartum core.', rating: 4.9 },
  { id: 'p3', name: 'Witch Hazel Pads', brand: 'FridaMom', category: 'Recovery', price: 899, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', description: 'Instant cooling relief for perineal healing.', rating: 4.7 },
  { id: 'p4', name: 'Peri Bottle', brand: 'Upside Down', category: 'Recovery', price: 499, image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=400', description: 'Ergonomic cleansing during recovery.', rating: 4.6 },
  { id: 'p5', name: 'Sitz Bath Soak', brand: 'The Moms Co', category: 'Recovery', price: 350, image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&q=80&w=400', description: 'Epsom salts with essential oils.', rating: 4.8 },
  { id: 'p6', name: 'Scar Silicone Tape', brand: 'Mederma', category: 'Recovery', price: 1500, image: 'https://images.unsplash.com/photo-1583946099379-f9c9cb8bc030?auto=format&fit=crop&q=80&w=400', description: 'Advanced C-Section scar management.', rating: 4.5 },
  
  // Pregnancy Essentials (4)
  { id: 'mat1', name: 'Support Belt Pro', brand: 'Tynor', category: 'Maternity Care', price: 1450, image: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&q=80&w=400', description: 'Trimester 3 pelvic and back relief.', rating: 4.7 },
  { id: 'mat2', name: 'Pregnancy Leggings', brand: 'Zivame', category: 'Maternity Care', price: 999, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', description: 'High-waisted over-the-bump stretch.', rating: 4.8 },
  { id: 'mat3', name: 'Maternity Nursing Bra', brand: 'Enamor', category: 'Maternity Care', price: 850, image: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?auto=format&fit=crop&q=80&w=400', description: 'Seamless comfort for sensitive skin.', rating: 4.9 },
  { id: 'mat4', name: 'Compression Socks', brand: 'HealthShakti', category: 'Maternity Care', price: 650, image: 'https://images.unsplash.com/photo-1582719202047-76d3432ee323?auto=format&fit=crop&q=80&w=400', description: 'Reduces leg swelling in T3.', rating: 4.4 },

  // Nutrition (4)
  { id: 'n1', name: 'Prenatal Multivitamin', brand: 'HealthKart', category: 'Nutrition', price: 850, image: 'https://images.unsplash.com/photo-1550573105-158674c6bb7a?auto=format&fit=crop&q=80&w=400', description: 'DHA and Folic acid optimized.', rating: 4.9 },
  { id: 'n2', name: 'Lactation Cookies', brand: 'MamaFix', category: 'Nutrition', price: 550, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400', description: 'Oats, flaxseed and fenugreek blend.', rating: 4.6 },
  { id: 'n3', name: 'Herbal Infusion Tea', brand: 'TeaCurry', category: 'Nutrition', price: 399, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400', description: 'Morning sickness relief blend.', rating: 4.5 },
  { id: 'n4', name: 'Organic Ghee', brand: 'Amul', category: 'Nutrition', price: 650, image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=400', description: 'Traditional healthy fats for healing.', rating: 4.9 },

  // Baby Care (3)
  { id: 'b1', name: 'Bamboo Diapers', brand: 'SuperBottoms', category: 'Baby Care', price: 999, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400', description: 'Eco-friendly and chemical-free.', rating: 4.8 },
  { id: 'b2', name: 'Safe-Touch Lotion', brand: 'Sebamed', category: 'Baby Care', price: 750, image: 'https://images.unsplash.com/photo-1512496011931-6213467c3f9a?auto=format&fit=crop&q=80&w=400', description: 'pH 5.5 clinically tested for newborns.', rating: 4.7 },
  { id: 'b3', name: 'Swaddle Wrap Set', brand: 'LuvLap', category: 'Baby Care', price: 1100, image: 'https://images.unsplash.com/photo-1555133539-dfa3b50e1611?auto=format&fit=crop&q=80&w=400', description: 'Soft breathable organic cotton.', rating: 4.9 },

  // Devices (3)
  { id: 'd1', name: 'Electric Breast Pump', brand: 'Philips Avent', category: 'Devices', price: 8500, image: 'https://images.unsplash.com/photo-1594498639139-e483980f8451?auto=format&fit=crop&q=80&w=400', description: 'Quiet and efficient multi-speed.', rating: 4.8 },
  { id: 'd2', name: 'Smart Baby Monitor', brand: 'Motorola', category: 'Devices', price: 4500, image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=400', description: 'Full HD video with night vision.', rating: 4.5 },
  { id: 'd3', name: 'Infrared Thermometer', brand: 'Omron', category: 'Devices', price: 1800, image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400', description: 'Non-contact instant reading.', rating: 4.6 }
];

export const EXPERT_DATA = [
  // Physiotherapy (4)
  { category: 'Physiotherapy', name: 'Dr. Shweta Singh', role: 'Pelvic Specialist', credentials: 'MPT, W-Health Expert', insight: 'Restoring core stability is a journey of layers, not speed.', price: '₹1200' },
  { category: 'Physiotherapy', name: 'Dr. Rohan Mehra', role: 'Manual Therapist', credentials: 'BPT, Sports Med (Postpartum Focus)', insight: 'Movement is medicine for the healing abdomen.', price: '₹1000' },
  { category: 'Physiotherapy', name: 'Dr. Ananya Roy', role: 'Movement Therapist', credentials: 'MPT, Pilates Certified', insight: 'Align your breath before you align your spine.', price: '₹1500' },
  { category: 'Physiotherapy', name: 'Dr. Kabir Das', role: 'Geriatric & Maternal Physio', credentials: 'MPT (Obstetrics)', insight: 'Safety first in every postpartum stretch.', price: '₹1100' },
  
  // OB-GYN (4)
  { category: 'OB-GYN', name: 'Dr. Meena Iyer', role: 'Sr. Obstetrician', credentials: 'MD, DNB (OB-GYN)', insight: 'Your 6-week checkup is just the beginning of healing.', price: '₹1500' },
  { category: 'OB-GYN', name: 'Dr. Priya Varma', role: 'Maternal Fetal Expert', credentials: 'MD, Apollo Specialist', insight: 'Trust your intuition as much as your clinical data.', price: '₹2000' },
  { category: 'OB-GYN', name: 'Dr. Sameer Gupta', role: 'Gynaecological Surgeon', credentials: 'MD, FRCOG', insight: 'Advanced care for C-section and complex recoveries.', price: '₹1800' },
  { category: 'OB-GYN', name: 'Dr. Neha Sharma', role: 'Reproductive Health Lead', credentials: 'DGO, MD', insight: 'Empowered birth begins with empowered knowledge.', price: '₹1600' },

  // Lactation (4)
  { category: 'Lactation', name: 'Dr. Kavita Reddy', role: 'IBCLC Consultant', credentials: 'Certified Specialist', insight: 'Every latch is a lesson in patience and bonding.', price: '₹1000' },
  { category: 'Lactation', name: 'Sister Mary John', role: 'Breastfeeding Educator', credentials: 'RN, Certified Educator', insight: 'The right support makes all the difference in milk supply.', price: '₹800' },
  { category: 'Lactation', name: 'Dr. Aisha Khan', role: 'Pediatric Lactation Expert', credentials: 'MBBS, IBCLC', insight: 'Feeding is a dialogue between you and your baby.', price: '₹1200' },
  { category: 'Lactation', name: 'Dr. Pooja Balan', role: 'Holistic Feeding Coach', credentials: 'Certified Consultant', insight: 'Nutrition and rest are the pillars of lactation.', price: '₹950' },

  // Mental Health (4)
  { category: 'Mental Health', name: 'Dr. Anjali Deshmukh', role: 'Perinatal Psychiatrist', credentials: 'MD, NIMHANS Specialist', insight: 'Your mind needs as much care as your body during this transition.', price: '₹1800' },
  { category: 'Mental Health', name: 'Dr. Sameera Khan', role: 'Clinical Psychologist', credentials: 'PhD, Postpartum Focus', insight: 'Acknowledging your feelings is the first step to emotional resilience.', price: '₹1400' },
  { category: 'Mental Health', name: 'Dr. Vikram Sethi', role: 'Family Therapist', credentials: 'M.Phil, TISS Graduate', insight: 'Strong family bonds are the foundation of maternal wellness.', price: '₹1200' },
  { category: 'Mental Health', name: 'Dr. Ritu Kapoor', role: 'Mindfulness Coach', credentials: 'MBSR Certified, MSc Psych', insight: 'Presence in the moment is a powerful tool for new mothers.', price: '₹1000' }
];

export const NGO_DATA = [
  { name: 'White Swan Foundation', area: 'Mental Health Awareness', contact: '080-2555-5555', website: 'whiteswanfoundation.org' },
  { name: 'Sangath', area: 'Maternal Mental Health', contact: '011-4050-6666', website: 'sangath.in' },
  { name: 'SNEHA', area: 'Women & Newborn Care', contact: '022-2404-2627', website: 'snehamumbai.org' },
  { name: 'ARTH', area: 'Reproductive Rights & Care', contact: '029-4248-3561', website: 'arthindia.org' }
];

export const GOVT_SCHEMES = [
  { title: 'PMMVY', fullName: 'Pradhan Mantri Matru Vandana Yojana', benefit: '₹5,000 for nutritional support', eligibility: 'Pregnant & Lactating' },
  { title: 'JSY', fullName: 'Janani Suraksha Yojana', benefit: 'Cash assistance for institutional delivery', eligibility: 'Rural/Urban low income' },
  { title: 'JSSK', fullName: 'Janani Shishu Suraksha Karyakram', benefit: 'Free diagnostics and delivery care', eligibility: 'Pregnant Women' },
  { title: 'PMSMA', fullName: 'Pradhan Mantri Surakshit Matritva Abhiyan', benefit: 'Free checkups on 9th of every month', eligibility: 'Pregnant Women T2/T3' },
  { title: 'LaQshya', fullName: 'Labour Room Quality Improvement', benefit: 'Assurance of safe dignified birth', eligibility: 'All public facilities' }
];
