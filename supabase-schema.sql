-- =============================================
-- HYPERTROPHY PRO - SUPABASE DATABASE SCHEMA
-- =============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  weight_unit TEXT DEFAULT 'kg',
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- EXERCISES TABLE (static exercise definitions)
-- =============================================
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  rest TEXT NOT NULL,
  primary_muscle TEXT NOT NULL,
  secondary_muscle TEXT[] DEFAULT '{}',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  equipment TEXT NOT NULL,
  image_url TEXT,
  description TEXT NOT NULL,
  instructions TEXT[] NOT NULL DEFAULT '{}',
  common_mistakes TEXT[] NOT NULL DEFAULT '{}',
  safety_tips TEXT[] NOT NULL DEFAULT '{}',
  alternatives TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Exercises are read-only for all authenticated users
CREATE POLICY "Authenticated users can view exercises" ON exercises
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- WORKOUT_DAYS TABLE (workout day templates)
-- =============================================
CREATE TABLE workout_days (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  focus TEXT NOT NULL,
  is_rest_day BOOLEAN DEFAULT false,
  exercise_ids INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;

-- Workout days are read-only for all authenticated users
CREATE POLICY "Authenticated users can view workout days" ON workout_days
  FOR SELECT TO authenticated USING (true);

-- =============================================
-- WORKOUT_LOGS TABLE (user workout history)
-- =============================================
CREATE TABLE workout_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  day_id INTEGER REFERENCES workout_days(id) NOT NULL,
  total_volume DECIMAL DEFAULT 0,
  duration INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Policies for workout_logs
CREATE POLICY "Users can view their own workout logs" ON workout_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs" ON workout_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs" ON workout_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs" ON workout_logs
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- EXERCISE_LOGS TABLE (individual exercise sets)
-- =============================================
CREATE TABLE exercise_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE NOT NULL,
  exercise_id INTEGER REFERENCES exercises(id) NOT NULL,
  completed BOOLEAN DEFAULT false,
  weights DECIMAL[] DEFAULT '{}',
  completed_sets INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- Policies for exercise_logs (via workout_logs ownership)
CREATE POLICY "Users can view their own exercise logs" ON exercise_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_logs
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own exercise logs" ON exercise_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_logs
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own exercise logs" ON exercise_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workout_logs
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own exercise logs" ON exercise_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workout_logs
      WHERE workout_logs.id = exercise_logs.workout_log_id
      AND workout_logs.user_id = auth.uid()
    )
  );

-- =============================================
-- USER_STATS TABLE (aggregated statistics)
-- =============================================
CREATE TABLE user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_workouts INTEGER DEFAULT 0,
  total_volume DECIMAL DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  personal_records JSONB DEFAULT '{}',
  personal_records_count INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- SEED DATA - EXERCISES
-- =============================================
INSERT INTO exercises (id, name, sets, reps, rest, primary_muscle, secondary_muscle, difficulty, equipment, image_url, description, instructions, common_mistakes, safety_tips, alternatives) VALUES
-- DAY 1 - Chest + Triceps
(1, 'Barbell Bench Press', 4, '6-8', '2-3 min', 'Chest', ARRAY['Triceps', 'Shoulders'], 'Intermediate', 'Barbell, Bench', '/assets/day1/Barbell Bench Press.png', 'The barbell bench press is the king of chest exercises. It targets the pectoralis major, anterior deltoids, and triceps.', ARRAY['Lie flat on the bench with your feet firmly on the floor', 'Grip the bar slightly wider than shoulder-width apart', 'Unrack the bar and lower it to your mid-chest', 'Push the bar back up to the starting position', 'Keep your elbows at about 45 degrees from your body'], ARRAY['Bouncing the bar off your chest', 'Flaring elbows out too wide (90 degrees)', 'Arching your lower back excessively', 'Using momentum instead of controlled movement'], ARRAY['Always use a spotter for heavy lifts', 'Start with lighter weight to warm up', 'Keep your shoulders retracted and depressed', 'Use collars to secure weights on the bar'], ARRAY['Dumbbell Bench Press', 'Incline Bench Press', 'Machine Chest Press']),
(2, 'Incline Dumbbell Press', 3, '8-10', '90 sec', 'Upper Chest', ARRAY['Triceps', 'Shoulders'], 'Intermediate', 'Dumbbells, Incline Bench', '/assets/day1/Incline Dumbbell Press.png', 'The incline dumbbell press targets the upper pectorals more effectively than flat pressing.', ARRAY['Set the bench to a 30-45 degree incline', 'Sit with dumbbells resting on your thighs', 'Kick the dumbbells up to shoulder level', 'Press the dumbbells up until arms are extended', 'Lower slowly to the starting position'], ARRAY['Setting the incline too high (targets shoulders)', 'Not controlling the descent', 'Letting dumbbells drift inward at the top', 'Using too much weight with poor form'], ARRAY['Start with lighter weight to find your groove', 'Keep your back flat against the bench', 'Breathe out as you press up', 'Lower dumbbells to the side of your upper chest'], ARRAY['Incline Barbell Press', 'Reverse Grip Bench Press', 'Cable Incline Fly']),
(3, 'Chest Fly Machine', 3, '12', '60 sec', 'Chest', ARRAY['Shoulders'], 'Beginner', 'Chest Fly Machine', '/assets/day1/Chest Fly Machine.png', 'The chest fly machine provides a safe and effective way to isolate the pectoral muscles.', ARRAY['Adjust the seat so handles are at chest level', 'Sit with your back flat against the pad', 'Grip the handles with palms facing forward', 'Bring arms together in front of you', 'Slowly return to the starting position'], ARRAY['Using too much weight and sacrificing form', 'Not controlling the eccentric phase', 'Rushing through the movement', 'Not fully extending at the start position'], ARRAY['Focus on squeezing your chest at the midpoint', 'Keep shoulders down and back', 'Maintain a controlled tempo throughout', 'Adjust weight to achieve full range of motion'], ARRAY['Dumbbell Fly', 'Cable Crossover', 'Pec Deck']),
(4, 'Weighted Dips', 3, '8-10', '90 sec', 'Triceps', ARRAY['Chest', 'Shoulders'], 'Advanced', 'Dip Station, Weight Belt/Dumbbell', '/assets/day1/Weighted Dips.png', 'Weighted dips are an excellent compound exercise for building triceps and lower chest mass.', ARRAY['Grip the parallel bars and lift yourself up', 'Lean forward slightly to engage chest', 'Lower your body until elbows are at 90 degrees', 'Push back up to the starting position', 'Add weight using a dip belt or dumbbell between legs'], ARRAY['Going too deep and stressing the shoulder joint', 'Not leaning forward enough (less chest engagement)', 'Flaring elbows out too wide', 'Using momentum to push back up'], ARRAY['Master bodyweight dips before adding weight', 'Keep shoulders down and back throughout', 'Control the descent - dont drop quickly', 'Stop if you feel shoulder pain'], ARRAY['Bench Dips', 'Assisted Dip Machine', 'Close Grip Bench Press']),
(5, 'Rope Pushdown', 3, '12-15', '60 sec', 'Triceps', ARRAY[]::TEXT[], 'Beginner', 'Cable Machine, Rope Attachment', '/assets/day1/Rope Pushdown.png', 'The rope pushdown is a staple triceps isolation exercise.', ARRAY['Attach the rope to a high pulley', 'Stand facing the machine with feet shoulder-width apart', 'Grip the rope with palms facing each other', 'Push the rope down, spreading it apart at the bottom', 'Slowly return to the starting position'], ARRAY['Using momentum from the upper body', 'Not spreading the rope at the bottom', 'Letting the weight stack rest between reps', 'Elbows flaring out to the sides'], ARRAY['Keep elbows pinned to your sides', 'Focus on the mind-muscle connection', 'Squeeze triceps hard at the bottom', 'Control the weight on the way up'], ARRAY['Straight Bar Pushdown', 'V-Bar Pushdown', 'Reverse Grip Pushdown']),
(6, 'Overhead Dumbbell Triceps Extension', 3, '10', '60 sec', 'Triceps', ARRAY[]::TEXT[], 'Beginner', 'Dumbbell', '/assets/day1/Overhead Dumbbell Triceps Extension.png', 'The overhead dumbbell triceps extension targets the long head of the triceps.', ARRAY['Stand or sit holding a dumbbell with both hands', 'Lift the dumbbell overhead, arms extended', 'Lower the dumbbell behind your head by bending elbows', 'Extend arms back to the starting position', 'Keep elbows close to your head throughout'], ARRAY['Flaring elbows out to the sides', 'Using too much weight with poor form', 'Not getting a full stretch at the bottom', 'Arching the lower back'], ARRAY['Start light to master the form', 'Keep your core engaged for stability', 'Focus on the triceps stretch and contraction', 'Avoid locking out at the top'], ARRAY['Skull Crushers', 'Cable Overhead Extension', 'EZ Bar Extension']),

-- DAY 2 - Back + Biceps
(7, 'Deadlift', 3, '5', '3-4 min', 'Back', ARRAY['Glutes', 'Hamstrings', 'Traps'], 'Advanced', 'Barbell', '/assets/day2/Deadlift.png', 'The deadlift is a fundamental compound exercise that builds total body strength.', ARRAY['Stand with feet hip-width apart, bar over mid-foot', 'Bend at the hips and knees to grip the bar', 'Keep back flat, chest up, and core braced', 'Drive through your feet to stand up with the bar', 'Lower the bar with control by hinging at the hips'], ARRAY['Rounding the lower back', 'Starting with hips too low (squatting the weight)', 'Jerking the bar off the floor', 'Looking up excessively during the lift'], ARRAY['Always maintain a neutral spine', 'Use a mixed grip or straps for heavy weights', 'Start light and progress gradually', 'Consider using a belt for heavy attempts'], ARRAY['Romanian Deadlift', 'Trap Bar Deadlift', 'Rack Pulls']),
(8, 'Barbell Row', 4, '8', '90 sec', 'Lats', ARRAY['Rhomboids', 'Rear Delts', 'Biceps'], 'Intermediate', 'Barbell', '/assets/day2/Barbell Row.png', 'The barbell row is a classic back builder that develops thickness in the lats and rhomboids.', ARRAY['Stand with feet shoulder-width apart, knees slightly bent', 'Hinge forward at the hips until torso is nearly parallel to floor', 'Grip the bar with hands slightly wider than shoulder width', 'Pull the bar to your lower chest, squeezing shoulder blades', 'Lower the bar with control'], ARRAY['Using momentum to pull the weight', 'Standing too upright', 'Pulling to the wrong position (too high/low)', 'Rounding the lower back'], ARRAY['Keep your core tight throughout', 'Maintain a neutral neck position', 'Focus on pulling with your back, not arms', 'Control the eccentric phase'], ARRAY['Dumbbell Row', 'T-Bar Row', 'Seated Cable Row']),
(9, 'Lat Pulldown (Close Grip)', 3, '10', '60 sec', 'Lats', ARRAY['Biceps', 'Mid Back'], 'Beginner', 'Cable Machine, Close Grip Bar', '/assets/day2/Lat Pulldown.png', 'The close grip lat pulldown emphasizes the lower lats.', ARRAY['Sit at the lat pulldown station, thighs secured under pads', 'Grip the close grip bar with palms facing you', 'Pull the bar down to your upper chest', 'Squeeze your lats at the bottom', 'Slowly return to the starting position'], ARRAY['Using momentum by swinging back', 'Pulling behind the neck (can cause injury)', 'Not fully extending arms at the top', 'Using too much weight with poor form'], ARRAY['Keep your chest up throughout', 'Focus on driving elbows down and back', 'Control the weight on the way up', 'Maintain a slight lean back'], ARRAY['Wide Grip Lat Pulldown', 'Reverse Grip Pulldown', 'Chin-ups']),
(10, 'Seated Cable Row', 3, '12', '60 sec', 'Mid Back', ARRAY['Lats', 'Rear Delts', 'Biceps'], 'Beginner', 'Cable Machine, V-Bar or Straight Bar', '/assets/day2/Seated Cable Row.png', 'The seated cable row is excellent for developing mid-back thickness.', ARRAY['Sit on the platform with feet on the foot rests', 'Grip the handle with both hands', 'Keep knees slightly bent, torso upright', 'Pull the handle to your lower chest', 'Squeeze your shoulder blades together', 'Return with control'], ARRAY['Rounding the back during the pull', 'Using too much upper body momentum', 'Not squeezing at the contraction', 'Letting the weight pull you forward too much'], ARRAY['Maintain an upright torso throughout', 'Focus on the mind-muscle connection with your back', 'Keep shoulders down and back', 'Control the eccentric phase'], ARRAY['Barbell Row', 'T-Bar Row', 'Machine Row']),
(11, 'Barbell Curl', 3, '8-10', '60 sec', 'Biceps', ARRAY['Forearms'], 'Beginner', 'Barbell', '/assets/day2/Barbell Curl.png', 'The barbell curl is the premier biceps mass builder.', ARRAY['Stand with feet shoulder-width apart', 'Grip the bar with palms facing forward, hands shoulder-width', 'Keep elbows pinned to your sides', 'Curl the bar up toward your shoulders', 'Squeeze biceps at the top', 'Lower with control'], ARRAY['Swinging the bar using momentum', 'Moving elbows forward during the curl', 'Not fully extending at the bottom', 'Using a weight thats too heavy'], ARRAY['Keep your core engaged to prevent swinging', 'Focus on the biceps doing the work', 'Maintain a controlled tempo', 'Dont lean back to complete reps'], ARRAY['EZ Bar Curl', 'Dumbbell Curl', 'Cable Curl']),
(12, 'Incline Dumbbell Curl', 3, '10-12', '60 sec', 'Biceps', ARRAY['Forearms'], 'Intermediate', 'Dumbbells, Incline Bench', '/assets/day2/Incline Dumbbell Curl.png', 'The incline dumbbell curl provides a greater stretch for the biceps.', ARRAY['Set an incline bench to about 45 degrees', 'Sit back with dumbbells at your sides, arms hanging', 'Curl both dumbbells up, supinating your wrists', 'Squeeze biceps at the top', 'Lower slowly to the starting position'], ARRAY['Setting the incline too steep', 'Using momentum to curl the weight', 'Not fully extending at the bottom', 'Curling both arms simultaneously'], ARRAY['Keep your back flat against the bench', 'Focus on the stretch at the bottom', 'Control the weight throughout', 'Supinate your wrists as you curl'], ARRAY['Preacher Curl', 'Concentration Curl', 'Hammer Curl']),

-- DAY 4 - Legs (Quad Focus)
(13, 'Barbell Squat', 4, '6-8', '2-3 min', 'Quadriceps', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Advanced', 'Barbell, Squat Rack', '/assets/day4/Barbell Squat.png', 'The barbell squat is the king of leg exercises.', ARRAY['Set the bar at upper chest height in the rack', 'Step under the bar, resting it on your upper back/traps', 'Unrack and step back with feet shoulder-width apart', 'Brace your core and squat down by sitting back', 'Descend until thighs are at least parallel to floor', 'Drive through your feet to stand back up'], ARRAY['Rounding the lower back', 'Knees caving inward', 'Not reaching proper depth', 'Lifting heels off the ground'], ARRAY['Always use a spotter or safety pins for heavy sets', 'Keep your chest up and core braced', 'Push knees out in line with toes', 'Start light and focus on mobility'], ARRAY['Front Squat', 'Goblet Squat', 'Leg Press']),
(14, 'Hack Squat', 3, '10', '90 sec', 'Quadriceps', ARRAY['Glutes'], 'Intermediate', 'Hack Squat Machine', '/assets/day4/Hack Squat.png', 'The hack squat machine provides a guided squatting motion that emphasizes the quadriceps.', ARRAY['Load the machine and position yourself on the platform', 'Place feet shoulder-width apart, slightly forward on platform', 'Unrack the safety handles', 'Lower by bending your knees', 'Push through your heels to return to start'], ARRAY['Going too deep and lifting hips off the pad', 'Locking knees at the top', 'Using too much weight with limited range of motion', 'Positioning feet too low on the platform'], ARRAY['Keep your back flat against the pad', 'Control the descent', 'Dont lock out at the top to maintain tension', 'Adjust foot position for different emphasis'], ARRAY['Leg Press', 'Front Squat', 'Bulgarian Split Squat']),
(15, 'Leg Press', 3, '12', '90 sec', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'Beginner', 'Leg Press Machine', '/assets/day4/Leg Press.png', 'The leg press allows for heavy loading of the legs with minimal spinal stress.', ARRAY['Sit in the machine with your back flat against the pad', 'Place feet shoulder-width apart on the platform', 'Unrack the safety handles', 'Lower the platform by bending your knees', 'Push through your feet to extend legs'], ARRAY['Locking knees at the top', 'Going too deep and lifting hips', 'Using too much weight with tiny range of motion', 'Placing feet too narrow (knee stress)'], ARRAY['Keep your lower back pressed into the seat', 'Control the weight throughout', 'Dont lock out your knees', 'Adjust foot position for different muscle emphasis'], ARRAY['Hack Squat', 'Squat', 'Bulgarian Split Squat']),
(16, 'Leg Extension', 3, '15', '60 sec', 'Quadriceps', ARRAY[]::TEXT[], 'Beginner', 'Leg Extension Machine', '/assets/day4/Leg Extension.png', 'The leg extension is an isolation exercise that targets the quadriceps.', ARRAY['Sit on the machine with your back against the pad', 'Position your ankles under the pad', 'Grip the handles for stability', 'Extend your legs until theyre straight', 'Squeeze your quads at the top', 'Lower with control'], ARRAY['Using momentum to swing the weight up', 'Not controlling the eccentric phase', 'Using too much weight', 'Not fully extending at the top'], ARRAY['Focus on the mind-muscle connection', 'Squeeze hard at the top', 'Control the weight down slowly', 'Adjust the pad so it sits just above your ankles'], ARRAY['Sissy Squat', 'Reverse Nordic Curl', 'Cable Leg Extension']),
(17, 'Standing Calf Raise', 4, '12-15', '60 sec', 'Calves', ARRAY[]::TEXT[], 'Beginner', 'Calf Raise Machine or Smith Machine', '/assets/day4/Standing Calf Raise.png', 'The standing calf raise targets the gastrocnemius.', ARRAY['Stand with the balls of your feet on a raised platform', 'Position your shoulders under the pads', 'Lower your heels below the platform level', 'Push up onto your toes as high as possible', 'Squeeze your calves at the top', 'Lower slowly to stretch'], ARRAY['Bouncing through the movement', 'Not getting a full stretch at the bottom', 'Rushing through reps', 'Using too much weight with poor range of motion'], ARRAY['Control the movement throughout', 'Pause briefly at the top and bottom', 'Focus on the stretch and contraction', 'Use full range of motion'], ARRAY['Seated Calf Raise', 'Donkey Calf Raise', 'Leg Press Calf Raise']),

-- DAY 5 - Shoulders + Rear Delt
(18, 'Dumbbell Shoulder Press', 4, '8', '90 sec', 'Shoulders', ARRAY['Triceps', 'Upper Chest'], 'Intermediate', 'Dumbbells', '/assets/day5/Dumbbell Shoulder Press.png', 'The dumbbell shoulder press is a fundamental exercise for building shoulder mass and strength.', ARRAY['Sit on a bench with back support, feet flat on floor', 'Hold dumbbells at shoulder height, palms facing forward', 'Press the dumbbells overhead until arms are extended', 'Lower slowly to the starting position', 'Keep your core engaged throughout'], ARRAY['Arching the lower back', 'Using momentum to press the weight', 'Not controlling the descent', 'Flaring elbows too far forward'], ARRAY['Keep your back flat against the bench', 'Control the weight throughout', 'Dont lock out elbows at the top', 'Start light to warm up your shoulders'], ARRAY['Barbell Overhead Press', 'Arnold Press', 'Machine Shoulder Press']),
(19, 'Lateral Raise', 4, '12-15', '60 sec', 'Side Delts', ARRAY[]::TEXT[], 'Beginner', 'Dumbbells', '/assets/day5/Lateral Raise.png', 'The lateral raise is essential for building shoulder width.', ARRAY['Stand with feet shoulder-width apart', 'Hold dumbbells at your sides with a slight bend in elbows', 'Raise dumbbells out to the sides until shoulder height', 'Lead with your elbows, slightly forward', 'Lower slowly with control'], ARRAY['Using momentum to swing the weight up', 'Going above shoulder height', 'Keeping arms completely straight', 'Using too much weight'], ARRAY['Use light weight and focus on form', 'Think about leading with your elbows', 'Control the weight on the way down', 'Slightly bend forward for better isolation'], ARRAY['Cable Lateral Raise', 'Machine Lateral Raise', 'Upright Row']),
(20, 'Rear Delt Fly', 4, '15', '60 sec', 'Rear Delts', ARRAY['Upper Back'], 'Beginner', 'Dumbbells or Machine', '/assets/day5/Rear Delt Fly.png', 'The rear delt fly targets the often-neglected posterior deltoid.', ARRAY['Lie face down on an incline bench or bend at the hips', 'Hold dumbbells with arms hanging down', 'Raise dumbbells out to the sides with slightly bent elbows', 'Squeeze your rear delts at the top', 'Lower with control'], ARRAY['Using too much weight', 'Not getting a full contraction', 'Swinging the weight up', 'Not maintaining the bent-over position'], ARRAY['Use light weight and focus on the squeeze', 'Think about pulling with your elbows', 'Keep your back flat', 'Control the movement throughout'], ARRAY['Face Pull', 'Reverse Pec Deck', 'Cable Reverse Fly']),
(21, 'Face Pull', 3, '15', '60 sec', 'Rear Delts', ARRAY['Rhomboids', 'External Rotators'], 'Beginner', 'Cable Machine, Rope Attachment', '/assets/day5/Face Pull.png', 'The face pull is excellent for shoulder health and rear delt development.', ARRAY['Attach a rope to a cable at upper chest height', 'Grab the rope with both hands, step back', 'Pull the rope toward your face', 'Rotate your hands back as you pull', 'Squeeze your rear delts and upper back', 'Return with control'], ARRAY['Using too much weight', 'Not rotating hands back at the end', 'Pulling too low (toward chest)', 'Using momentum'], ARRAY['Focus on the external rotation at the end', 'Keep your shoulders down and back', 'Control the weight throughout', 'This is a control exercise, not a heavy one'], ARRAY['Rear Delt Fly', 'Reverse Pec Deck', 'Band Pull-Apart']),
(22, 'EZ Bar Shrugs', 3, '12', '60 sec', 'Traps', ARRAY[]::TEXT[], 'Beginner', 'EZ Bar', '/assets/day5/EZ Bar Shrugs.png', 'The EZ bar shrug targets the trapezius muscles.', ARRAY['Stand with feet shoulder-width apart', 'Hold the EZ bar in front of you with an overhand grip', 'Shrug your shoulders up toward your ears', 'Squeeze your traps at the top', 'Lower slowly with control'], ARRAY['Rolling shoulders instead of shrugging straight up', 'Using momentum to bounce the weight', 'Not controlling the descent', 'Using straps too early in training'], ARRAY['Shrug straight up and down, not in circles', 'Hold the contraction briefly at the top', 'Control the weight down', 'Consider using straps for heavier weights'], ARRAY['Dumbbell Shrugs', 'Barbell Shrugs', 'Cable Shrugs']),

-- DAY 6 - Legs (Hamstring Focus)
(23, 'Romanian Deadlift', 4, '8', '90 sec', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], 'Intermediate', 'Barbell', '/assets/day6/Romanian Deadlift.png', 'The Romanian deadlift is the premier hamstring builder.', ARRAY['Stand with feet hip-width apart, holding the bar at hip height', 'Keep knees slightly bent but fixed throughout', 'Hinge at the hips, pushing them back', 'Lower the bar down your legs until you feel a hamstring stretch', 'Drive hips forward to return to standing'], ARRAY['Bending the knees too much (turns into a squat)', 'Rounding the lower back', 'Not getting a full stretch in the hamstrings', 'Looking up instead of keeping neck neutral'], ARRAY['Maintain a neutral spine throughout', 'Focus on the hip hinge motion', 'Feel the stretch in your hamstrings', 'Start light to master the form'], ARRAY['Stiff-Leg Deadlift', 'Good Morning', 'Cable Pull-Through']),
(24, 'Lying Leg Curl', 3, '12', '60 sec', 'Hamstrings', ARRAY[]::TEXT[], 'Beginner', 'Leg Curl Machine', '/assets/day6/Lying Leg Curl.png', 'The lying leg curl isolates the hamstrings effectively.', ARRAY['Lie face down on the machine', 'Position your ankles under the pad', 'Curl your heels toward your glutes', 'Squeeze your hamstrings at the top', 'Lower with control'], ARRAY['Using momentum to swing the weight', 'Lifting hips off the pad', 'Not controlling the descent', 'Using too much weight with poor form'], ARRAY['Keep your hips pressed into the pad', 'Focus on the squeeze at the top', 'Control the weight down', 'Adjust the pad for proper positioning'], ARRAY['Seated Leg Curl', 'Nordic Curl', 'Stability Ball Curl']),
(25, 'Bulgarian Split Squat', 3, '10 each leg', '60 sec', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'Intermediate', 'Dumbbells, Bench', '/assets/day6/Bulgarian Split Squat.png', 'The Bulgarian split squat is a unilateral exercise that builds leg strength.', ARRAY['Stand facing away from a bench, holding dumbbells', 'Place one foot on the bench behind you', 'Lower your back knee toward the ground', 'Push through your front foot to return', 'Complete all reps on one side before switching'], ARRAY['Leaning too far forward', 'Not getting full range of motion', 'Letting front knee cave inward', 'Rushing through reps'], ARRAY['Keep your torso upright', 'Focus on the stretch and contraction', 'Keep front knee in line with toes', 'Control the movement throughout'], ARRAY['Walking Lunges', 'Reverse Lunges', 'Step-ups']),
(26, 'Seated Calf Raise', 4, '15', '60 sec', 'Calves', ARRAY[]::TEXT[], 'Beginner', 'Seated Calf Raise Machine', '/assets/day6/Seated Calf Raise.png', 'The seated calf raise targets the soleus muscle.', ARRAY['Sit on the machine with your knees under the pads', 'Place the balls of your feet on the platform', 'Lower your heels below the platform level', 'Push up onto your toes as high as possible', 'Squeeze your calves at the top', 'Lower slowly to stretch'], ARRAY['Bouncing through the movement', 'Not getting a full stretch at the bottom', 'Rushing through reps', 'Using too much weight with poor range of motion'], ARRAY['Control the movement throughout', 'Pause briefly at the top and bottom', 'Focus on the stretch and contraction', 'Use full range of motion'], ARRAY['Standing Calf Raise', 'Donkey Calf Raise', 'Leg Press Calf Raise']),
(27, 'Lunges', 3, '10 each leg', '60 sec', 'Quadriceps', ARRAY['Glutes', 'Hamstrings'], 'Beginner', 'Dumbbells or Barbell', '/assets/day6/Lunges.png', 'Lunges are a fundamental leg exercise that builds strength and balance.', ARRAY['Stand with feet hip-width apart, holding dumbbells at sides', 'Step forward with one leg', 'Lower your back knee toward the ground', 'Push through your front foot to return', 'Alternate legs or complete all reps on one side'], ARRAY['Taking too short of a step', 'Letting front knee go past toes', 'Leaning torso forward', 'Not controlling the descent'], ARRAY['Take a long enough step', 'Keep your torso upright', 'Control the movement throughout', 'Keep front knee in line with ankle'], ARRAY['Walking Lunges', 'Reverse Lunges', 'Bulgarian Split Squat']),

-- DAY 7 - Rest Day (no exercises needed)
(28, 'Light Cardio', 1, '30 min', 'N/A', 'Cardio', ARRAY[]::TEXT[], 'Beginner', 'Treadmill, Bike, or Elliptical', '/assets/day7/Light Cardio.png', 'Light cardio for active recovery.', ARRAY['Choose your preferred cardio machine', 'Maintain a moderate pace', 'Keep heart rate in the fat-burning zone', 'Focus on active recovery'], ARRAY['Going too intense', 'Skipping warm-up', 'Poor posture on machine', 'Not staying hydrated'], ARRAY['Start slow and build up', 'Listen to your body', 'Stay hydrated', 'Cool down properly'], ARRAY['Walking', 'Swimming', 'Cycling']);

-- =============================================
-- SEED DATA - WORKOUT_DAYS
-- =============================================
INSERT INTO workout_days (id, name, focus, is_rest_day, exercise_ids) VALUES
(1, 'Day 1', 'Chest + Triceps (Heavy Focus)', false, ARRAY[1, 2, 3, 4, 5, 6]),
(2, 'Day 2', 'Back + Biceps', false, ARRAY[7, 8, 9, 10, 11, 12]),
(3, 'Day 3', 'Rest / Light Cardio', true, ARRAY[]::INTEGER[]),
(4, 'Day 4', 'Legs (Quad Focus)', false, ARRAY[13, 14, 15, 16, 17]),
(5, 'Day 5', 'Shoulders + Rear Delt', false, ARRAY[18, 19, 20, 21, 22]),
(6, 'Day 6', 'Legs (Hamstring Focus)', false, ARRAY[23, 24, 25, 26, 27]),
(7, 'Day 7', 'Rest / Light Cardio', true, ARRAY[28]);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_date ON workout_logs(date);
CREATE INDEX idx_exercise_logs_workout_log_id ON exercise_logs(workout_log_id);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- =============================================
-- FUNCTION TO UPDATE UPDATED_AT TIMESTAMP
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_logs_updated_at
  BEFORE UPDATE ON workout_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIALIZE USER_STATS ON PROFILE CREATION
-- =============================================
CREATE OR REPLACE FUNCTION init_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION init_user_stats();

-- =============================================
-- DONE! Your database is ready.
-- =============================================
