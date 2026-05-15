export interface RoutineStep {
  step: number
  title: string
  description: string
  amount?: string
  notes?: string
  infoDetail?: string
}

export interface DayRoutine {
  am: RoutineStep[]
  pm: RoutineStep[]
}

// Helper to build steps without repeating boilerplate
function s(step: number, title: string, description: string, amount?: string, infoDetail?: string): RoutineStep {
  return { step, title, description, ...(amount && amount !== '--' ? { amount } : {}), ...(infoDetail ? { infoDetail } : {}) }
}

// ══════════════════════════════════════════
// SUNDAY
// ══════════════════════════════════════════
const sundayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Rinse Hair with Water Only', 'No shampoo today.'),
  s(6, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(7, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(8, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(9, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(10, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(11, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(12, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(13, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(14, 'Macro Factor Photo', 'Log food photo for tracking.'),
]

const sundayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Salicylic Acid 2% Masque', 'Nose only. Apply to dry nose for 10 min, then rinse off before double cleanse.', 'Thin layer'),
  s(5, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Add water to emulsify, rinse.', 'Generous on face'),
  s(6, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(7, 'Pat Dry', 'Wait until fully dry.'),
  s(8, 'No Active Tonight', 'Rest night. Your skin barrier recovers. Never skip this.'),
  s(9, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(10, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(11, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(12, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
]

// ══════════════════════════════════════════
// MONDAY
// ══════════════════════════════════════════
const mondayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Tea Tree Shampoo', 'Hair wash day. Lather at scalp, rinse.', 'Quarter-sized'),
  s(6, 'Tea Tree Conditioner', 'Mid-lengths to ends only. Leave 1-2 min, rinse.', 'Quarter-sized'),
  s(7, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(8, 'Neti Pot', 'Distilled water only. After shower.'),
  s(9, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(10, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(11, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(12, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(13, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(14, 'Tallow Lip Balm', 'Reapply throughout the day as needed.', 'Thin layer'),
  s(15, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(16, 'Macro Factor Photo', 'Log food photo for tracking.'),
  s(17, 'Switch to Washcloth 2', 'Retire Washcloth 1 to the hamper.'),
]

const mondayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose for sebum plugs. Add water to emulsify, rinse.', 'Generous on face'),
  s(5, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(6, 'Pat Dry', 'Wait until fully dry.'),
  s(7, 'OmniLux Mask', 'On clean, dry skin. No actives underneath.', '10 min'),
  s(8, 'Tretinoin 0.025%', 'Thin layer across full face. Avoid eye area, corners of nose and mouth.', 'Pea-sized'),
  s(9, 'Wait', 'Let tretinoin absorb before moisturizing.', '10-15 min'),
  s(10, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(11, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(12, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(13, 'Petroleum Jelly', 'Finger and toe cuticles. Every night during high-salt POTS loading, every other night otherwise.', 'Thin layer'),
  s(14, 'Charge Toothbrush', 'Plug in for tomorrow.'),
]

// ══════════════════════════════════════════
// TUESDAY
// ══════════════════════════════════════════
const tuesdayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Rinse Hair with Water Only', 'No shampoo today.'),
  s(6, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(7, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(8, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(9, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(10, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(11, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(12, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(13, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(14, 'Macro Factor Photo', 'Log food photo for tracking.'),
]

const tuesdayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Nano Glass Foot File', 'Foot care night. File feet while bone-dry BEFORE face cleanse. One direction only.'),
  s(5, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose. Add water to emulsify, rinse.', 'Generous on face'),
  s(6, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(7, 'Pat Dry', 'Wait until fully dry.'),
  s(8, 'OmniLux Mask', 'On clean, dry skin. No actives underneath.', '10 min'),
  s(9, 'Azelaic Acid 10%', 'Thin layer across full face. Can go closer to eye area than tretinoin.', 'Pea-sized'),
  s(10, 'Wait', 'Azelaic is more forgiving, but still let it absorb.', '5-10 min'),
  s(11, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(12, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(13, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(14, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
  s(15, 'Urea 40% Cream', 'On heels and callus-prone areas.', 'Generous'),
  s(16, 'Cotton Socks', 'Put on over the urea. Leave on overnight.'),
]

// ══════════════════════════════════════════
// WEDNESDAY
// ══════════════════════════════════════════
const wednesdayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Tea Tree Shampoo', 'Hair wash day. Lather at scalp, rinse.', 'Quarter-sized'),
  s(6, 'Tea Tree Conditioner', 'Mid-lengths to ends only. Leave 1-2 min, rinse.', 'Quarter-sized'),
  s(7, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(8, 'Neti Pot', 'Distilled water only. After shower.'),
  s(9, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(10, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(11, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(12, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(13, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(14, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(15, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(16, 'Macro Factor Photo', 'Log food photo for tracking.'),
  s(17, 'Switch to Washcloth 3 + Body Towel 2', 'Retire Washcloth 2 and Body Towel 1 to the hamper.'),
]

const wednesdayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose. Add water to emulsify, rinse.', 'Generous on face'),
  s(5, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(6, 'Pat Dry', 'Wait until fully dry.'),
  s(7, 'OmniLux Mask', 'On clean, dry skin. No actives underneath.', '10 min'),
  s(8, 'Tretinoin 0.025%', 'Thin layer across full face. Avoid eye area, corners of nose and mouth.', 'Pea-sized'),
  s(9, 'Wait', 'Let tretinoin absorb before moisturizing.', '10-15 min'),
  s(10, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(11, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(12, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(13, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
]

// ══════════════════════════════════════════
// THURSDAY
// ══════════════════════════════════════════
const thursdayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Rinse Hair with Water Only', 'No shampoo today.'),
  s(6, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(7, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(8, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(9, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(10, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(11, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(12, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(13, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(14, 'Macro Factor Photo', 'Log food photo for tracking.'),
]

const thursdayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose. Add water to emulsify, rinse.', 'Generous on face'),
  s(5, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(6, 'Pat Dry', 'Wait until fully dry.'),
  s(7, 'OmniLux Mask', 'On clean, dry skin. No actives underneath.', '10 min'),
  s(8, 'Tretinoin 0.025%', 'Thin layer across full face. Avoid eye area, corners of nose and mouth.', 'Pea-sized'),
  s(9, 'Wait', 'Let tretinoin absorb before moisturizing.', '10-15 min'),
  s(10, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(11, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(12, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(13, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
  s(14, 'Charge Toothbrush', 'Plug in for tomorrow.'),
]

// ══════════════════════════════════════════
// FRIDAY
// ══════════════════════════════════════════
const fridayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(3, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(4, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(5, 'Tea Tree Shampoo', 'Hair wash day. Lather at scalp, rinse.', 'Quarter-sized'),
  s(6, 'Tea Tree Conditioner', 'Mid-lengths to ends only. Leave 1-2 min, rinse.', 'Quarter-sized'),
  s(7, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(8, 'Neti Pot', 'Distilled water only. After shower.'),
  s(9, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(10, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(11, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(12, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(13, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(14, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(15, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(16, 'Macro Factor Photo', 'Log food photo for tracking.'),
  s(17, 'Switch to Washcloth 4', 'Retire Washcloth 3 to the hamper. Last one before Saturday laundry reset.'),
]

const fridayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose. Add water to emulsify, rinse.', 'Generous on face'),
  s(5, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(6, 'Pat Dry', 'Wait until fully dry.'),
  s(7, 'Azelaic Acid 10%', 'Thin layer across full face. Can go closer to eye area than tretinoin.', 'Pea-sized'),
  s(8, 'Wait', 'No OmniLux tonight. Let azelaic absorb.', '5-10 min'),
  s(9, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(10, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(11, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(12, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
]

// ══════════════════════════════════════════
// SATURDAY
// ══════════════════════════════════════════
const saturdayAM: RoutineStep[] = [
  s(1, 'Brush Teeth', 'Start your routine with oral hygiene.'),
  s(2, 'Trim Hair: Nose, Ears, Body', 'Safety trimmer. Dry skin. Check with 3-way mirror.'),
  s(3, 'Trim Beard', '#3 guard.'),
  s(4, 'Trim Neckline', 'Use neckline template. Maintain London Formal taper.'),
  s(5, 'Trim Nails', 'Fingers and toes.'),
  s(6, 'Cold Face Plunge', 'Ice-cold water. Before any products.', '15-30 sec'),
  s(7, 'Cetaphil Cleanser', 'On face in the shower.', 'Dime-sized'),
  s(8, 'Bioderma Oil', 'On body in the shower. Massage onto wet skin, rinse.', 'Generous'),
  s(9, 'Rinse Hair with Water Only', 'No shampoo today.'),
  s(10, 'Cotton Swabs', 'Outer ear only.', '1 per ear'),
  s(11, 'LRP Moisturizer', 'Full body while skin is still slightly damp.', 'Generous'),
  s(12, 'Vitamin C Serum', 'Full face and neck on dry skin. Wait 60-90 sec.', '3-4 drops'),
  s(13, 'Argireline 10%', 'Press directly into the 11 lines only. Don\'t spread.', '2 drops'),
  s(14, 'Multi-Peptide Eye Serum', 'Tap along orbital bone with ring finger. Don\'t rub.', 'Small dab per eye'),
  s(15, 'LRP SPF 30', 'Full face and neck. Seals everything.', 'Nickel-sized'),
  s(16, 'Tallow Lip Balm', 'Reapply as needed.', 'Thin layer'),
  s(17, 'Weigh Myself on Scale', 'Track daily weight for trends.'),
  s(18, 'Macro Factor Photo', 'Log food photo for tracking.'),
  s(19, 'Start Towel Laundry', 'Wash all 4 washcloths + both body towels. Do after shower.'),
]

const saturdayPM: RoutineStep[] = [
  s(1, 'Floss', 'Full mouth.'),
  s(2, 'Brush + Toothpaste', 'Standard brushing routine.'),
  s(3, 'Tongue Scraper', 'Tongue heavy and limp. No tension.', '3-5 passes'),
  s(4, 'Nano Glass Foot File', 'Foot care night. File feet while bone-dry BEFORE face cleanse. One direction only.'),
  s(5, 'Bioderma Oil', 'Massage onto DRY face 30-60 sec. Extra time on nose. Add water to emulsify, rinse.', 'Generous on face'),
  s(6, 'Cetaphil Cleanser', 'Second cleanse.', 'Dime-sized'),
  s(7, 'Pat Dry', 'Wait until fully dry.'),
  s(8, 'OmniLux Mask', 'On clean, dry skin. No actives underneath.', '10 min'),
  s(9, 'Tretinoin 0.025%', 'Thin layer across full face. Avoid eye area, corners of nose and mouth.', 'Pea-sized'),
  s(10, 'Wait', 'Let tretinoin absorb before moisturizing.', '10-15 min'),
  s(11, 'LRP Moisturizer (Face)', 'Full face.', 'Dime-sized'),
  s(12, 'LRP Moisturizer (Body)', 'Full body if needed.', 'Generous'),
  s(13, 'Tallow Lip Balm', 'Protect lips overnight.', 'Thin layer'),
  s(14, 'Petroleum Jelly', 'Finger and toe cuticles.', 'Thin layer'),
  s(15, 'Urea 40% Cream', 'On heels and callus-prone areas.', 'Generous'),
  s(16, 'Cotton Socks', 'Put on over the urea. Leave on overnight.'),
]

// ══════════════════════════════════════════
// WEEKLY MAP
// ══════════════════════════════════════════
export const weeklyRoutines: Record<string, DayRoutine> = {
  sunday:    { am: sundayAM,    pm: sundayPM },
  monday:    { am: mondayAM,    pm: mondayPM },
  tuesday:   { am: tuesdayAM,   pm: tuesdayPM },
  wednesday: { am: wednesdayAM, pm: wednesdayPM },
  thursday:  { am: thursdayAM,  pm: thursdayPM },
  friday:    { am: fridayAM,    pm: fridayPM },
  saturday:  { am: saturdayAM,  pm: saturdayPM },
}

export function getTodayRoutine(): { steps: RoutineStep[]; period: 'am' | 'pm'; dayName: string } {
  const now = new Date()
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = days[now.getDay()]
  const hour = now.getHours()
  const period = hour < 15 ? 'am' : 'pm'
  const routine = weeklyRoutines[dayName]
  return { steps: routine[period], period, dayName }
}
