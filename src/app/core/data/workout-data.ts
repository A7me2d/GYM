import { Exercise, WorkoutDay } from '../models/exercise.model';

const createExercise = (
  id: number,
  name: string,
  sets: number,
  reps: string,
  rest: string,
  primaryMuscle: string,
  secondaryMuscle: string[],
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  equipment: string,
  description: string,
  instructions: string[],
  commonMistakes: string[],
  safetyTips: string[],
  alternatives: string[],
  imageUrl?: string
): Exercise => ({
  id,
  name,
  sets,
  reps,
  rest,
  primaryMuscle,
  secondaryMuscle,
  difficulty,
  equipment,
  imageUrl: imageUrl || `https://images.unsplash.com/photo-1571019614242-c5c8d8d8d8d8?w=400&h=300&fit=crop&query=${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
  description,
  instructions,
  commonMistakes,
  safetyTips,
  alternatives
});

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: 1,
    name: 'Day 1',
    focus: 'Chest + Triceps (Heavy Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        1,
        'Barbell Bench Press',
        4,
        '6-8',
        '2-3 min',
        'Chest',
        ['Triceps', 'Shoulders'],
        'Intermediate',
        'Barbell, Bench',
        'The barbell bench press is the king of chest exercises. It targets the pectoralis major, anterior deltoids, and triceps. This compound movement builds upper body pushing strength and mass.',
        [
          'Lie flat on the bench with your feet firmly on the floor',
          'Grip the bar slightly wider than shoulder-width apart',
          'Unrack the bar and lower it to your mid-chest',
          'Push the bar back up to the starting position',
          'Keep your elbows at about 45 degrees from your body'
        ],
        [
          'Bouncing the bar off your chest',
          'Flaring elbows out too wide (90 degrees)',
          'Arching your lower back excessively',
          'Using momentum instead of controlled movement'
        ],
        [
          'Always use a spotter for heavy lifts',
          'Start with lighter weight to warm up',
          'Keep your shoulders retracted and depressed',
          'Use collars to secure weights on the bar'
        ],
        ['Dumbbell Bench Press', 'Incline Bench Press', 'Machine Chest Press'],
        '/assets/day1/Barbell Bench Press.png'
      ),
      createExercise(
        2,
        'Incline Dumbbell Press',
        3,
        '8-10',
        '90 sec',
        'Upper Chest',
        ['Triceps', 'Shoulders'],
        'Intermediate',
        'Dumbbells, Incline Bench',
        'The incline dumbbell press targets the upper pectorals more effectively than flat pressing. Using dumbbells allows for a greater range of motion and helps correct muscle imbalances.',
        [
          'Set the bench to a 30-45 degree incline',
          'Sit with dumbbells resting on your thighs',
          'Kick the dumbbells up to shoulder level',
          'Press the dumbbells up until arms are extended',
          'Lower slowly to the starting position'
        ],
        [
          'Setting the incline too high (targets shoulders)',
          'Not controlling the descent',
          'Letting dumbbells drift inward at the top',
          'Using too much weight with poor form'
        ],
        [
          'Start with lighter weight to find your groove',
          'Keep your back flat against the bench',
          'Breathe out as you press up',
          'Lower dumbbells to the side of your upper chest'
        ],
        ['Incline Barbell Press', 'Reverse Grip Bench Press', 'Cable Incline Fly'],
        '/assets/day1/Incline Dumbbell Press.png'
      ),
      createExercise(
        3,
        'Chest Fly Machine',
        3,
        '12',
        '60 sec',
        'Chest',
        ['Shoulders'],
        'Beginner',
        'Chest Fly Machine',
        'The chest fly machine provides a safe and effective way to isolate the pectoral muscles. The guided movement pattern helps maintain proper form throughout the exercise.',
        [
          'Adjust the seat so handles are at chest level',
          'Sit with your back flat against the pad',
          'Grip the handles with palms facing forward',
          'Bring arms together in front of you',
          'Slowly return to the starting position'
        ],
        [
          'Using too much weight and sacrificing form',
          'Not controlling the eccentric phase',
          'Rushing through the movement',
          'Not fully extending at the start position'
        ],
        [
          'Focus on squeezing your chest at the midpoint',
          'Keep shoulders down and back',
          'Maintain a controlled tempo throughout',
          'Adjust weight to achieve full range of motion'
        ],
        ['Dumbbell Fly', 'Cable Crossover', 'Pec Deck'],
        '/assets/day1/Chest Fly Machine.png'
      ),
      createExercise(
        4,
        'Weighted Dips',
        3,
        '8-10',
        '90 sec',
        'Triceps',
        ['Chest', 'Shoulders'],
        'Advanced',
        'Dip Station, Weight Belt/Dumbbell',
        'Weighted dips are an excellent compound exercise for building triceps and lower chest mass. Adding weight increases the challenge for advanced lifters.',
        [
          'Grip the parallel bars and lift yourself up',
          'Lean forward slightly to engage chest',
          'Lower your body until elbows are at 90 degrees',
          'Push back up to the starting position',
          'Add weight using a dip belt or dumbbell between legs'
        ],
        [
          'Going too deep and stressing the shoulder joint',
          'Not leaning forward enough (less chest engagement)',
          'Flaring elbows out too wide',
          'Using momentum to push back up'
        ],
        [
          'Master bodyweight dips before adding weight',
          'Keep shoulders down and back throughout',
          'Control the descent - dont drop quickly',
          'Stop if you feel shoulder pain'
        ],
        ['Bench Dips', 'Assisted Dip Machine', 'Close Grip Bench Press'],
        '/assets/day1/Weighted Dips.png'
      ),
      createExercise(
        5,
        'Rope Pushdown',
        3,
        '12-15',
        '60 sec',
        'Triceps',
        [],
        'Beginner',
        'Cable Machine, Rope Attachment',
        'The rope pushdown is a staple triceps isolation exercise. The rope attachment allows for a greater range of motion and better muscle activation at the bottom of the movement.',
        [
          'Attach the rope to a high pulley',
          'Stand facing the machine with feet shoulder-width apart',
          'Grip the rope with palms facing each other',
          'Push the rope down, spreading it apart at the bottom',
          'Slowly return to the starting position'
        ],
        [
          'Using momentum from the upper body',
          'Not spreading the rope at the bottom',
          'Letting the weight stack rest between reps',
          'Elbows flaring out to the sides'
        ],
        [
          'Keep elbows pinned to your sides',
          'Focus on the mind-muscle connection',
          'Squeeze triceps hard at the bottom',
          'Control the weight on the way up'
        ],
        ['Straight Bar Pushdown', 'V-Bar Pushdown', 'Reverse Grip Pushdown'],
        '/assets/day1/Rope Pushdown.png'
      ),
      createExercise(
        6,
        'Overhead Dumbbell Triceps Extension',
        3,
        '10',
        '60 sec',
        'Triceps',
        [],
        'Beginner',
        'Dumbbell',
        'The overhead dumbbell triceps extension targets the long head of the triceps. This exercise helps build full triceps development and arm size.',
        [
          'Stand or sit holding a dumbbell with both hands',
          'Lift the dumbbell overhead, arms extended',
          'Lower the dumbbell behind your head by bending elbows',
          'Extend arms back to the starting position',
          'Keep elbows close to your head throughout'
        ],
        [
          'Flaring elbows out to the sides',
          'Using too much weight with poor form',
          'Not getting a full stretch at the bottom',
          'Arching the lower back'
        ],
        [
          'Start light to master the form',
          'Keep your core engaged for stability',
          'Focus on the triceps stretch and contraction',
          'Avoid locking out at the top'
        ],
        ['Skull Crushers', 'Cable Overhead Extension', 'EZ Bar Extension'],
        '/assets/day1/Overhead Dumbbell Triceps Extension.png'
      )
    ]
  },
  {
    id: 2,
    name: 'Day 2',
    focus: 'Back + Biceps',
    isRestDay: false,
    exercises: [
      createExercise(
        7,
        'Deadlift',
        3,
        '5',
        '3-4 min',
        'Back',
        ['Glutes', 'Hamstrings', 'Traps'],
        'Advanced',
        'Barbell',
        'The deadlift is a fundamental compound exercise that builds total body strength. It primarily targets the posterior chain including the back, glutes, and hamstrings.',
        [
          'Stand with feet hip-width apart, bar over mid-foot',
          'Bend at the hips and knees to grip the bar',
          'Keep back flat, chest up, and core braced',
          'Drive through your feet to stand up with the bar',
          'Lower the bar with control by hinging at the hips'
        ],
        [
          'Rounding the lower back',
          'Starting with hips too low (squatting the weight)',
          'Jerking the bar off the floor',
          'Looking up excessively during the lift'
        ],
        [
          'Always maintain a neutral spine',
          'Use a mixed grip or straps for heavy weights',
          'Start light and progress gradually',
          'Consider using a belt for heavy attempts'
        ],
        ['Romanian Deadlift', 'Trap Bar Deadlift', 'Rack Pulls'],
        '/assets/day2/Deadlift.png'
      ),
      createExercise(
        8,
        'Barbell Row',
        4,
        '8',
        '90 sec',
        'Lats',
        ['Rhomboids', 'Rear Delts', 'Biceps'],
        'Intermediate',
        'Barbell',
        'The barbell row is a classic back builder that develops thickness in the lats, rhomboids, and middle back. Its essential for a strong, muscular back.',
        [
          'Stand with feet shoulder-width apart, knees slightly bent',
          'Hinge forward at the hips until torso is nearly parallel to floor',
          'Grip the bar with hands slightly wider than shoulder width',
          'Pull the bar to your lower chest, squeezing shoulder blades',
          'Lower the bar with control'
        ],
        [
          'Using momentum to pull the weight',
          'Standing too upright',
          'Pulling to the wrong position (too high/low)',
          'Rounding the lower back'
        ],
        [
          'Keep your core tight throughout',
          'Maintain a neutral neck position',
          'Focus on pulling with your back, not arms',
          'Control the eccentric phase'
        ],
        ['Dumbbell Row', 'T-Bar Row', 'Seated Cable Row'],
        '/assets/day2/Barbell Row.png'
      ),
      createExercise(
        9,
        'Lat Pulldown (Close Grip)',
        3,
        '10',
        '60 sec',
        'Lats',
        ['Biceps', 'Mid Back'],
        'Beginner',
        'Cable Machine, Close Grip Bar',
        'The close grip lat pulldown emphasizes the lower lats and provides a greater range of motion compared to wide grip variations. Its excellent for building lat width.',
        [
          'Sit at the lat pulldown station, thighs secured under pads',
          'Grip the close grip bar with palms facing you',
          'Pull the bar down to your upper chest',
          'Squeeze your lats at the bottom',
          'Slowly return to the starting position'
        ],
        [
          'Using momentum by swinging back',
          'Pulling behind the neck (can cause injury)',
          'Not fully extending arms at the top',
          'Using too much weight with poor form'
        ],
        [
          'Keep your chest up throughout',
          'Focus on driving elbows down and back',
          'Control the weight on the way up',
          'Maintain a slight lean back'
        ],
        ['Wide Grip Lat Pulldown', 'Reverse Grip Pulldown', 'Chin-ups'],
        '/assets/day2/Lat Pulldown.png'
      ),
      createExercise(
        10,
        'Seated Cable Row',
        3,
        '12',
        '60 sec',
        'Mid Back',
        ['Lats', 'Rear Delts', 'Biceps'],
        'Beginner',
        'Cable Machine, V-Bar or Straight Bar',
        'The seated cable row is an excellent exercise for developing mid-back thickness. The constant tension from the cable provides effective muscle stimulation.',
        [
          'Sit on the platform with feet on the foot rests',
          'Grip the handle with both hands',
          'Keep knees slightly bent, torso upright',
          'Pull the handle to your lower chest',
          'Squeeze your shoulder blades together',
          'Return with control'
        ],
        [
          'Rounding the back during the pull',
          'Using too much upper body momentum',
          'Not squeezing at the contraction',
          'Letting the weight pull you forward too much'
        ],
        [
          'Maintain an upright torso throughout',
          'Focus on the mind-muscle connection with your back',
          'Keep shoulders down and back',
          'Control the eccentric phase'
        ],
        ['Barbell Row', 'T-Bar Row', 'Machine Row'],
        '/assets/day2/Seated Cable Row.png'
      ),
      createExercise(
        11,
        'Barbell Curl',
        3,
        '8-10',
        '60 sec',
        'Biceps',
        ['Forearms'],
        'Beginner',
        'Barbell',
        'The barbell curl is the premier biceps mass builder. It allows for heavy loading and targets both heads of the biceps for maximum arm development.',
        [
          'Stand with feet shoulder-width apart',
          'Grip the bar with palms facing forward, hands shoulder-width',
          'Keep elbows pinned to your sides',
          'Curl the bar up toward your shoulders',
          'Squeeze biceps at the top',
          'Lower with control'
        ],
        [
          'Swinging the bar using momentum',
          'Moving elbows forward during the curl',
          'Not fully extending at the bottom',
          'Using a weight thats too heavy'
        ],
        [
          'Keep your core engaged to prevent swinging',
          'Focus on the biceps doing the work',
          'Maintain a controlled tempo',
          'Dont lean back to complete reps'
        ],
        ['EZ Bar Curl', 'Dumbbell Curl', 'Cable Curl'],
        '/assets/day2/Barbell Curl.png'
      ),
      createExercise(
        12,
        'Incline Dumbbell Curl',
        3,
        '10-12',
        '60 sec',
        'Biceps',
        ['Forearms'],
        'Intermediate',
        'Dumbbells, Incline Bench',
        'The incline dumbbell curl provides a greater stretch for the biceps and emphasizes the long head. This variation helps build peaked biceps.',
        [
          'Set an incline bench to about 45 degrees',
          'Sit back with dumbbells at your sides, arms hanging',
          'Curl both dumbbells up, supinating your wrists',
          'Squeeze biceps at the top',
          'Lower slowly to the starting position'
        ],
        [
          'Setting the incline too steep',
          'Using momentum to curl the weight',
          'Not fully extending at the bottom',
          'Curling both arms simultaneously (can use alternating)'
        ],
        [
          'Keep your back flat against the bench',
          'Focus on the stretch at the bottom',
          'Control the weight throughout',
          'Supinate your wrists as you curl'
        ],
        ['Preacher Curl', 'Concentration Curl', 'Hammer Curl'],
        '/assets/day2/Incline Dumbbell Curl.png'
      )
    ]
  },
  {
    id: 3,
    name: 'Day 3',
    focus: 'Rest / Light Cardio',
    isRestDay: true,
    exercises: []
  },
  {
    id: 4,
    name: 'Day 4',
    focus: 'Legs (Quad Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        13,
        'Barbell Squat',
        4,
        '6-8',
        '2-3 min',
        'Quadriceps',
        ['Glutes', 'Hamstrings', 'Core'],
        'Advanced',
        'Barbell, Squat Rack',
        'The barbell squat is the king of leg exercises. Its a compound movement that builds strength and mass in the quadriceps, glutes, and entire lower body.',
        [
          'Set the bar at upper chest height in the rack',
          'Step under the bar, resting it on your upper back/traps',
          'Unrack and step back with feet shoulder-width apart',
          'Brace your core and squat down by sitting back',
          'Descend until thighs are at least parallel to floor',
          'Drive through your feet to stand back up'
        ],
        [
          'Rounding the lower back',
          'Knees caving inward',
          'Not reaching proper depth',
          'Lifting heels off the ground'
        ],
        [
          'Always use a spotter or safety pins for heavy sets',
          'Keep your chest up and core braced',
          'Push knees out in line with toes',
          'Start light and focus on mobility'
        ],
        ['Front Squat', 'Goblet Squat', 'Leg Press'],
        '/assets/day4/Barbell Squat.png'
      ),
      createExercise(
        14,
        'Hack Squat',
        3,
        '10',
        '90 sec',
        'Quadriceps',
        ['Glutes'],
        'Intermediate',
        'Hack Squat Machine',
        'The hack squat machine provides a guided squatting motion that emphasizes the quadriceps. Its excellent for building quad size with reduced spinal loading.',
        [
          'Load the machine and position yourself on the platform',
          'Place feet shoulder-width apart, slightly forward on platform',
          'Unrack the safety handles',
          'Lower by bending your knees',
          'Push through your heels to return to start'
        ],
        [
          'Going too deep and lifting hips off the pad',
          'Locking knees at the top',
          'Using too much weight with limited range of motion',
          'Positioning feet too low on the platform'
        ],
        [
          'Keep your back flat against the pad',
          'Control the descent',
          'Dont lock out at the top to maintain tension',
          'Adjust foot position for different emphasis'
        ],
        ['Leg Press', 'Front Squat', 'Bulgarian Split Squat'],
        '/assets/day4/Hack Squat.png'
      ),
      createExercise(
        15,
        'Leg Press',
        3,
        '12',
        '90 sec',
        'Quadriceps',
        ['Glutes', 'Hamstrings'],
        'Beginner',
        'Leg Press Machine',
        'The leg press allows for heavy loading of the legs with minimal spinal stress. Its excellent for building quad mass and is beginner-friendly.',
        [
          'Sit in the machine with your back flat against the pad',
          'Place feet shoulder-width apart on the platform',
          'Unrack the safety handles',
          'Lower the platform by bending your knees',
          'Push through your feet to extend legs'
        ],
        [
          'Locking knees at the top',
          'Going too deep and lifting hips',
          'Using too much weight with tiny range of motion',
          'Placing feet too narrow (knee stress)'
        ],
        [
          'Keep your lower back pressed into the seat',
          'Control the weight throughout',
          'Dont lock out your knees',
          'Adjust foot position for different muscle emphasis'
        ],
        ['Hack Squat', 'Squat', 'Bulgarian Split Squat'],
        '/assets/day4/Leg Press.png'
      ),
      createExercise(
        16,
        'Leg Extension',
        3,
        '15',
        '60 sec',
        'Quadriceps',
        [],
        'Beginner',
        'Leg Extension Machine',
        'The leg extension is an isolation exercise that targets the quadriceps. Its excellent for finishing off your quad workout and building definition.',
        [
          'Sit on the machine with your back against the pad',
          'Position your ankles under the pad',
          'Grip the handles for stability',
          'Extend your legs until theyre straight',
          'Squeeze your quads at the top',
          'Lower with control'
        ],
        [
          'Using momentum to swing the weight up',
          'Not controlling the eccentric phase',
          'Using too much weight',
          'Not fully extending at the top'
        ],
        [
          'Focus on the mind-muscle connection',
          'Squeeze hard at the top',
          'Control the weight down slowly',
          'Adjust the pad so it sits just above your ankles'
        ],
        ['Sissy Squat', 'Reverse Nordic Curl', 'Cable Leg Extension'],
        '/assets/day4/Leg Extension.png'
      ),
      createExercise(
        17,
        'Standing Calf Raise',
        4,
        '12-15',
        '60 sec',
        'Calves',
        [],
        'Beginner',
        'Calf Raise Machine or Smith Machine',
        'The standing calf raise targets the gastrocnemius, the larger calf muscle visible from behind. This exercise builds calf size and ankle stability.',
        [
          'Stand with the balls of your feet on a raised platform',
          'Position your shoulders under the pads',
          'Lower your heels below the platform level',
          'Push up onto your toes as high as possible',
          'Squeeze your calves at the top',
          'Lower slowly to stretch'
        ],
        [
          'Bouncing through the movement',
          'Not getting a full stretch at the bottom',
          'Rushing through reps',
          'Using too much weight with poor range of motion'
        ],
        [
          'Control the movement throughout',
          'Pause briefly at the top and bottom',
          'Focus on the stretch and contraction',
          'Use full range of motion'
        ],
        ['Seated Calf Raise', 'Donkey Calf Raise', 'Leg Press Calf Raise'],
        '/assets/day4/Standing Calf Raise.png'
      )
    ]
  },
  {
    id: 5,
    name: 'Day 5',
    focus: 'Shoulders + Rear Delt',
    isRestDay: false,
    exercises: [
      createExercise(
        18,
        'Dumbbell Shoulder Press',
        4,
        '8',
        '90 sec',
        'Shoulders',
        ['Triceps', 'Upper Chest'],
        'Intermediate',
        'Dumbbells',
        'The dumbbell shoulder press is a fundamental exercise for building shoulder mass and strength. It targets all three heads of the deltoid with emphasis on the front and middle heads.',
        [
          'Sit on a bench with back support, feet flat on floor',
          'Hold dumbbells at shoulder height, palms facing forward',
          'Press the dumbbells overhead until arms are extended',
          'Lower slowly to the starting position',
          'Keep your core engaged throughout'
        ],
        [
          'Arching the lower back',
          'Using momentum to press the weight',
          'Not controlling the descent',
          'Flaring elbows too far forward'
        ],
        [
          'Keep your back flat against the bench',
          'Control the weight throughout',
          'Dont lock out elbows at the top',
          'Start light to warm up your shoulders'
        ],
        ['Barbell Overhead Press', 'Arnold Press', 'Machine Shoulder Press'],
        '/assets/day5/Dumbbell Shoulder Press.png'
      ),
      createExercise(
        19,
        'Lateral Raise',
        4,
        '12-15',
        '60 sec',
        'Side Delts',
        [],
        'Beginner',
        'Dumbbells',
        'The lateral raise is essential for building shoulder width. It isolates the middle deltoid head, creating the appearance of broader shoulders.',
        [
          'Stand with feet shoulder-width apart',
          'Hold dumbbells at your sides with a slight bend in elbows',
          'Raise dumbbells out to the sides until shoulder height',
          'Lead with your elbows, slightly forward',
          'Lower slowly with control'
        ],
        [
          'Using momentum to swing the weight up',
          'Going above shoulder height',
          'Keeping arms completely straight',
          'Using too much weight'
        ],
        [
          'Use light weight and focus on form',
          'Think about leading with your elbows',
          'Control the weight on the way down',
          'Slightly bend forward for better isolation'
        ],
        ['Cable Lateral Raise', 'Machine Lateral Raise', 'Upright Row'],
        '/assets/day5/Lateral Raise.png'
      ),
      createExercise(
        20,
        'Rear Delt Fly',
        4,
        '15',
        '60 sec',
        'Rear Delts',
        ['Upper Back'],
        'Beginner',
        'Dumbbells or Machine',
        'The rear delt fly targets the often-neglected posterior deltoid. Developing rear delts improves shoulder health, posture, and creates a 3D shoulder look.',
        [
          'Lie face down on an incline bench or bend at the hips',
          'Hold dumbbells with arms hanging down',
          'Raise dumbbells out to the sides with slightly bent elbows',
          'Squeeze your rear delts at the top',
          'Lower with control'
        ],
        [
          'Using too much weight',
          'Not getting a full contraction',
          'Swinging the weight up',
          'Not maintaining the bent-over position'
        ],
        [
          'Use light weight and focus on the squeeze',
          'Think about pulling with your elbows',
          'Keep your back flat',
          'Control the movement throughout'
        ],
        ['Face Pull', 'Reverse Pec Deck', 'Cable Reverse Fly'],
        '/assets/day5/Rear Delt Fly.png'
      ),
      createExercise(
        21,
        'Face Pull',
        3,
        '15',
        '60 sec',
        'Rear Delts',
        ['Rhomboids', 'External Rotators'],
        'Beginner',
        'Cable Machine, Rope Attachment',
        'The face pull is excellent for shoulder health and rear delt development. It also strengthens the rotator cuff and improves posture.',
        [
          'Attach a rope to a cable at upper chest height',
          'Grab the rope with both hands, step back',
          'Pull the rope toward your face',
          'Rotate your hands back as you pull',
          'Squeeze your rear delts and upper back',
          'Return with control'
        ],
        [
          'Using too much weight',
          'Not rotating hands back at the end',
          'Pulling too low (toward chest)',
          'Using momentum'
        ],
        [
          'Focus on the external rotation at the end',
          'Keep your shoulders down and back',
          'Control the weight throughout',
          'This is a control exercise, not a heavy one'
        ],
        ['Rear Delt Fly', 'Reverse Pec Deck', 'Band Pull-Apart'],
        '/assets/day5/Face Pull.png'
      ),
      createExercise(
        22,
        'EZ Bar Shrugs',
        3,
        '12',
        '60 sec',
        'Traps',
        [],
        'Beginner',
        'EZ Bar',
        'The EZ bar shrug targets the trapezius muscles. Well-developed traps create a powerful upper body appearance and support neck health.',
        [
          'Stand with feet shoulder-width apart',
          'Hold the EZ bar in front of you with an overhand grip',
          'Shrug your shoulders up toward your ears',
          'Squeeze your traps at the top',
          'Lower slowly with control'
        ],
        [
          'Rolling shoulders instead of shrugging straight up',
          'Using momentum to bounce the weight',
          'Not controlling the descent',
          'Using straps too early in training'
        ],
        [
          'Shrug straight up and down, not in circles',
          'Hold the contraction briefly at the top',
          'Control the weight down',
          'Consider using straps for heavier weights'
        ],
        ['Dumbbell Shrugs', 'Barbell Shrugs', 'Cable Shrugs'],
        '/assets/day5/EZ Bar Shrugs.png'
      )
    ]
  },
  {
    id: 6,
    name: 'Day 6',
    focus: 'Legs (Hamstring Focus)',
    isRestDay: false,
    exercises: [
      createExercise(
        23,
        'Romanian Deadlift',
        4,
        '8',
        '90 sec',
        'Hamstrings',
        ['Glutes', 'Lower Back'],
        'Intermediate',
        'Barbell',
        'The Romanian deadlift is the premier hamstring builder. It emphasizes the eccentric phase and provides a deep stretch in the hamstrings.',
        [
          'Stand with feet hip-width apart, holding the bar at hip height',
          'Keep knees slightly bent but fixed throughout',
          'Hinge at the hips, pushing them back',
          'Lower the bar down your legs until you feel a hamstring stretch',
          'Drive hips forward to return to standing'
        ],
        [
          'Bending the knees too much (turns into a squat)',
          'Rounding the lower back',
          'Not getting a full stretch in the hamstrings',
          'Looking up instead of keeping neck neutral'
        ],
        [
          'Maintain a neutral spine throughout',
          'Focus on the hip hinge motion',
          'Feel the stretch in your hamstrings',
          'Start light to master the form'
        ],
        ['Stiff-Leg Deadlift', 'Good Morning', 'Cable Pull-Through'],
        '/assets/day6/Romanian Deadlift.png'
      ),
      createExercise(
        24,
        'Lying Leg Curl',
        3,
        '12',
        '60 sec',
        'Hamstrings',
        [],
        'Beginner',
        'Leg Curl Machine',
        'The lying leg curl isolates the hamstrings effectively. Its excellent for building hamstring size and strength with minimal lower back involvement.',
        [
          'Lie face down on the machine',
          'Position your ankles under the pad',
          'Curl your heels toward your glutes',
          'Squeeze your hamstrings at the top',
          'Lower with control'
        ],
        [
          'Using momentum to swing the weight',
          'Lifting hips off the pad',
          'Not controlling the descent',
          'Using too much weight with poor form'
        ],
        [
          'Keep your hips pressed into the pad',
          'Focus on the squeeze at the top',
          'Control the weight down',
          'Adjust the pad for proper positioning'
        ],
        ['Seated Leg Curl', 'Nordic Curl', 'Stability Ball Curl'],
        '/assets/day6/Lying Leg Curl.png'
      ),
      createExercise(
        25,
        'Bulgarian Split Squat',
        3,
        '10 each leg',
        '60 sec',
        'Quadriceps',
        ['Glutes', 'Hamstrings'],
        'Intermediate',
        'Dumbbells, Bench',
        'The Bulgarian split squat is a unilateral exercise that builds leg strength while improving balance. It targets quads and glutes with minimal spinal loading.',
        [
          'Stand facing away from a bench, holding dumbbells',
          'Place one foot on the bench behind you',
          'Lower your back knee toward the ground',
          'Push through your front foot to return',
          'Complete all reps on one side before switching'
        ],
        [
          'Leaning too far forward',
          'Not getting full range of motion',
          'Letting front knee cave inward',
          'Rushing through reps'
        ],
        [
          'Keep your torso upright',
          'Control the descent',
          'Push through your front heel',
          'Start light to master the form'
        ],
        ['Lunges', 'Step-Ups', 'Single-Leg Leg Press'],
        '/assets/day6/Bulgarian Split Squat.png'
      ),
      createExercise(
        26,
        'Hip Thrust',
        3,
        '8-10',
        '90 sec',
        'Glutes',
        ['Hamstrings'],
        'Intermediate',
        'Barbell, Bench',
        'The hip thrust is the premier glute builder. It provides heavy loading for the glutes with minimal lower back stress.',
        [
          'Sit on the floor with your upper back against a bench',
          'Roll a barbell over your hips',
          'Drive through your heels to lift your hips',
          'Squeeze your glutes hard at the top',
          'Lower with control'
        ],
        [
          'Not getting full hip extension at the top',
          'Looking up instead of keeping chin tucked',
          'Pushing through toes instead of heels',
          'Using too much weight with poor form'
        ],
        [
          'Squeeze your glutes hard at the top',
          'Keep your chin tucked to your chest',
          'Drive through your heels',
          'Use a pad or mat to protect your hips'
        ],
        ['Glute Bridge', 'Romanian Deadlift', 'Cable Pull-Through'],
        '/assets/day6/Hip Thrust.png'
      ),
      createExercise(
        27,
        'Seated Calf Raise',
        4,
        '15',
        '60 sec',
        'Calves',
        [],
        'Beginner',
        'Seated Calf Raise Machine',
        'The seated calf raise targets the soleus muscle, which lies beneath the gastrocnemius. This exercise builds calf size from a different angle.',
        [
          'Sit in the machine with your knees under the pads',
          'Place the balls of your feet on the platform',
          'Release the safety and lower your heels',
          'Push up onto your toes as high as possible',
          'Squeeze your calves at the top',
          'Lower slowly'
        ],
        [
          'Using momentum to bounce',
          'Not getting a full stretch at the bottom',
          'Rushing through reps',
          'Using too much weight with poor range'
        ],
        [
          'Control the movement throughout',
          'Get a full stretch at the bottom',
          'Pause briefly at the top',
          'Focus on the squeeze'
        ],
        ['Standing Calf Raise', 'Donkey Calf Raise', 'Tibialis Raise'],
        '/assets/day6/Seated Calf Raise.png'
      )
    ]
  },
  {
    id: 7,
    name: 'Day 7',
    focus: 'Rest',
    isRestDay: true,
    exercises: []
  }
];

export const getWorkoutDay = (id: number): WorkoutDay | undefined => {
  return WORKOUT_DAYS.find(day => day.id === id);
};

export const getExercise = (id: number): Exercise | undefined => {
  for (const day of WORKOUT_DAYS) {
    const exercise = day.exercises.find(ex => ex.id === id);
    if (exercise) return exercise;
  }
  return undefined;
};

export const getAllExercises = (): Exercise[] => {
  return WORKOUT_DAYS.flatMap(day => day.exercises);
};
