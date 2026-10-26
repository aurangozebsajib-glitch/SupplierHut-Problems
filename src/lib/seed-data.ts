import { 
  Problem, 
  SolutionProposal, 
  DiscussionComment, 
  UserProfile, 
  AuditLogItem, 
  ProblemReport 
} from '@/types';

// Seed initial users for quick role switching and testing
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    name: 'Rafiqul Islam (Platform Administrator)',
    email: 'admin@supplierhut.bd',
    role: 'admin',
    title: 'Lead Operations & Verification Lead',
    location: 'Dhaka, Bangladesh',
    bio: 'Oversees problem verification, evidence audits, and challenge sponsor screening across Bangladesh.',
    skills: ['Policy Verification', 'Market Research', 'Audit & Compliance', 'Operations'],
    preferredSectors: ['Agriculture', 'Healthcare', 'Retail & SMEs', 'Technology'],
    portfolioUrl: 'https://supplierhut.bd/team/rafiq',
    savedProblemIds: ['prob-1', 'prob-2'],
    followedChallengeIds: ['prob-2']
  },
  {
    id: 'user-solver-1',
    name: 'Tariqul Hasan',
    email: 'tariq.dev@dhaka.io',
    role: 'solver',
    title: 'Fullstack IoT & Mobile Engineer',
    location: 'Mohakhali, Dhaka',
    bio: 'Software engineer building low-bandwidth tools and IoT telemetry hardware for emerging market logistics.',
    skills: ['React Native', 'Node.js', 'ESP32 / IoT', 'Next.js', 'PostgreSQL', 'Offline-First Apps'],
    preferredSectors: ['Agriculture', 'Logistics', 'Healthcare'],
    portfolioUrl: 'https://github.com/tariq-bd-iot',
    githubUrl: 'https://github.com/tariq-bd-iot',
    savedProblemIds: ['prob-1', 'prob-2', 'prob-3'],
    followedChallengeIds: ['prob-2']
  },
  {
    id: 'user-submitter-1',
    name: 'Fatima Zohra',
    email: 'fatima@bogura-growers.org',
    role: 'submitter',
    title: 'Agriculture Extension & Co-op Coordinator',
    location: 'Mahasthangarh, Bogura',
    bio: 'Working with over 350 smallholder vegetable and spice farmers across northern Bangladesh.',
    skills: ['Agri Supply Chain', 'Rural Field Research', 'Farmer Cooperatives'],
    preferredSectors: ['Agriculture', 'Environment'],
    savedProblemIds: ['prob-2'],
    followedChallengeIds: []
  },
  {
    id: 'user-org-1',
    name: 'Syed Tanvir (Bangladesh Agri-Tech Trust)',
    email: 'tanvir@agri-alliance.org.bd',
    role: 'organization',
    title: 'Program Director - Rural Innovation Challenges',
    location: 'Gulshan-2, Dhaka',
    bio: 'Funding practical, decentralized cold storage and post-harvest technology interventions.',
    skills: ['Grants & Funding', 'Pilot Procurement', 'Impact Measurement'],
    preferredSectors: ['Agriculture', 'Logistics', 'Retail & SMEs'],
    portfolioUrl: 'https://agri-alliance.org.bd',
    savedProblemIds: ['prob-2'],
    followedChallengeIds: ['prob-2']
  }
];

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-1',
    slug: 'food-waste-small-retailers',
    title: 'Perishable Produce Spoilage in Urban Neighborhood Grocery Retailers',
    summary: 'Small grocery stores (mudirdokan) in high-density Dhaka wards lose 12% to 18% of fresh leafy vegetables and tomatoes daily due to lack of micro-chilling and unoptimized evening restocking.',
    fullDescription: 'In neighborhoods like Mirpur, Badda, and Mohammadpur, over 40,000 independent grocery stores purchase perishable items every morning at 5:00 AM from Karwan Bazar or Jatrabari wholesale markets. Due to tropical humidity (exceeding 85% in summer) and the absence of low-cost, compact cooling cabinets, shop owners face rapid wilting. To prevent total loss, they dump inventory at 50% discount after 8:00 PM or throw away unsellable rotting produce. This leads to monthly losses of ৳15,000 to ৳28,000 per store, eroding their thin 6-8% overall net margin.',
    sector: 'Retail & SMEs',
    location: 'Dhaka Metropolitan & Chittagong City',
    division: 'Dhaka',
    affectedCustomerType: 'Neighborhood independent grocers & corner stall retailers (40,000+ shops in Dhaka alone)',
    frequency: 'Daily occurrence throughout the entire summer and monsoon cycle (March - October)',
    existingAlternatives: 'Basic ice slabs in styrofoam iceboxes; manual water spraying every 30 minutes; rapid end-of-day flash markdown sales.',
    whyAlternativesFail: 'Styrofoam boxes melt ice within 4 hours and promote fungal decay through standing meltwater. Commercial glass display chillers cost over ৳65,000 BDT, consume 450W power (expensive commercial tariffs), and are too bulky for 80 sq.ft shops.',
    validationStatus: 'Validated',
    confidenceScorePercent: 92,
    opportunityType: 'Open Problem',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 40000,
      max: 120000,
      displayLabel: '৳40,000 - ৳120,000 BDT'
    },
    skillsRequired: ['Product Design / Hardware', 'Embedded Thermostats', 'SME Distribution', 'B2B Sales'],
    timeToFirstTest: '14 to 21 days for pilot insulated box with passive Peltier/fan chiller',
    featured: true,
    dateReported: '2026-08-14',
    updatedAt: '2026-10-18',
    reportedBy: {
      name: 'Tanmoy Barua',
      role: 'Urban SME Supply Chain Analyst',
      organization: 'Dhaka Commerce Study Group'
    },
    imageUrl: '/images/sme_digital_retail_problem_1792999685564.jpg',
    imageAlt: 'Authentic Dhaka neighborhood grocer managing inventory at counter',
    evidenceSources: [
      {
        title: 'BBS Informal Retail Waste Survey (Urban Dhaka Sample)',
        url: 'https://bbs.gov.bd/sample-retail-study',
        sourceDate: '2025-11-20',
        sourceType: 'Government Report',
        summary: 'Survey of 120 micro-grocers in Mirpur and Mohammadpur reported average monthly perishable losses equivalent to 14.6% of wholesale produce procurement value.',
        verified: true
      },
      {
        title: 'Field Interviews with 18 Shop Owners in Mirpur Section 11',
        sourceDate: '2026-07-05',
        sourceType: 'Field Interview',
        summary: '15 of 18 shopkeepers explicitly stated they would rent or pay ৳1,200/month for a compact 100-liter vegetable preserver if it guaranteed an extra 36 hours of freshness without high electricity bills.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Urban micro-retailers with 60-150 sq.ft physical stores selling perishable fruits and vegetables.',
      estimatedTAMBDT: '৳2.4 Billion BDT annual hardware/preservation market across top 6 municipal corporations in Bangladesh.',
      estimatedSAMBDT: '৳380 Million BDT in Dhaka North and South city corporations.',
      marketSizingMethodology: 'Based on 45,000 registered grocers in Dhaka × ৳8,500 annual equipment amortization or cooling lease fee.',
      demandSignals: [
        'Shopkeepers actively buying ৳150-৳250 worth of dirty block ice daily',
        'End-of-day distress markdowns documented at Karwan Bazar retailers',
        'Rising electricity tariffs making heavy commercial refrigerators uneconomical for fresh greens'
      ],
      competitorsAndSubstitutes: [
        'Walton / Singer commercial beverage glass chillers (not optimized for high-humidity greens)',
        'Traditional thermocol boxes with ice slabs',
        'Daily minimal batch purchasing (increases transport costs and time)'
      ],
      currentPricingExamples: [
        'Traditional styrofoam icebox: ৳850 initial + ৳200/day ice = ৳6,000/mo operating cost',
        'Commercial display cooler: ৳65,000 purchase price + ৳3,500/mo electricity bill'
      ],
      marketGaps: [
        'No modular, low-wattage (under 60W) cooling unit built specifically for humid leafy greens',
        'Absence of hardware-as-a-service (rental model) for micro-merchants who lack upfront capital'
      ]
    },
    potentialSolutions: [
      {
        id: 'sol-1',
        title: 'Evaporative Clay-Insulated Micro-Cooler (Zero Compressor)',
        description: 'A double-walled ventilated cabinet utilizing high-porosity terracotta liners and a 12V DC computer fan with misting wick, maintaining 18-22°C with 85% relative humidity.',
        techStackOrMethod: 'Terracotta, recycled polymer frame, 12V 10W DC fan, lithium backup battery',
        estimatedBuildTime: '3 weeks for prototype',
        upfrontCostEstimateBDT: '৳6,500 per unit prototype cost',
        pros: ['Extremely low power consumption (under 15W)', 'Keeps greens moist without freezing cells', 'Low component cost'],
        cons: ['Requires daily water refilling', 'Less effective on 95%+ ambient humidity days']
      },
      {
        id: 'sol-2',
        title: 'Modular Peltier Chilled Crate System (Stackable)',
        description: 'Standard vegetable crate fitted with top-lid thermoelectric cooling and temperature sensor, powered by solar micro-panel or grid socket.',
        techStackOrMethod: 'Thermoelectric TEC1-12706, heatsink, aluminum cold-plate, digital sensor',
        estimatedBuildTime: '4 weeks',
        upfrontCostEstimateBDT: '৳11,000 prototype cost',
        pros: ['Solid-state with zero compressor noise', 'Stackable on existing vegetable racks'],
        cons: ['Lower thermal efficiency compared to miniature inverter compressors']
      }
    ],
    businessModels: [
      'Equipment Rental: ৳1,500 BDT/month subscription including maintenance and replacement filters',
      'Direct Unit Sale: ৳12,500 BDT with 1-year local warranty',
      'Consortium supply to SME associations with installment payments'
    ],
    validationPlan: {
      interviewQuestions: [
        'How many kilograms of spinach, coriander, and tomatoes did you throw away or discount by 50% in the last 7 days?',
        'How much do you spend on ice blocks and transport each week?',
        'If a cabinet keeps your greens crisp for 48 hours for ৳50/day running cost, would you test it for free for 1 week and pay if it saves you >৳150/day?'
      ],
      landingPageExperiment: 'Display a WhatsApp demo catalog to 50 shopkeepers in Mirpur 11 with photo mockups and rental terms; measure deposit willingness.',
      prototypeMVP: 'Construct 2 functional prototypes and install in 2 cooperative grocery stores in Mirpur for 14 continuous days, measuring daily weight of discarded greens.',
      successCriteria: 'Reduction of daily produce spoilage by at least 65%, with shopkeeper willingness to pay ৳1,200/month rental fee after pilot.',
      first30DaysSteps: [
        'Day 1-7: Conduct structured 15-minute interviews with 30 grocers across Mirpur and Mohammadpur.',
        'Day 8-15: Source local components (fans, terracotta wicks, insulated crates) in Nawabpur market.',
        'Day 16-24: Assemble 2 bench-test prototypes and calibrate temperature sensors.',
        'Day 25-30: Place in 2 test stores and record daily baseline vs saved vegetable weight.'
      ]
    },
    potentialBuyers: [
      'Independent grocery retailers (Mudirdokan owners)',
      'Suburban fruit juice stall operators',
      'Small neighborhood restaurant kitchen managers'
    ],
    customerAcquisitionChannels: [
      'Door-to-door field demonstration during afternoon slow hours (2:00 PM - 4:00 PM)',
      'Partnerships with local Dokandar Somity (Shopkeeper Associations)',
      'Word-of-mouth referral bonuses between adjacent grocery shops'
    ],
    risksAndDependencies: [
      'Grid load shedding in summer requires battery buffer or passive thermal insulation',
      'Rough handling during morning market replenishment requires durable outer shell',
      'Reluctance of traditional shopkeepers to adopt unfamiliar electrical appliances'
    ],
    followerCount: 48,
    solverCount: 9,
    discussionsCount: 14
  },
  {
    id: 'prob-2',
    slug: 'vegetable-cold-chain-bogura',
    title: 'Pre-Cooling Bottlenecks for Northern Vegetable Farmers at Village Arat Points',
    summary: 'Vegetable farmers in Bogura, Joypurhat, and Rajshahi suffer 20-30% field heat deterioration during the first 6 hours post-harvest before reaching Dhaka trucks.',
    fullDescription: 'Northern Bangladesh produces over 45% of the country’s winter and summer vegetables. Farmers harvest crops like cauliflower, pointed gourd (potol), tomatoes, and bitter gourd at 7:00 AM in 34°C field temperatures. The harvested crops sit in unventilated gunny sacks at village collection points (arat) until 4:00 PM when open trucks are loaded for Dhaka. By the time trucks arrive at Karwan Bazar the next morning, 25% of the nutritional weight and aesthetic freshness is degraded, forcing middlemen to slash payout rates to farmers.',
    sector: 'Agriculture',
    location: 'Bogura & Rajshahi Division',
    division: 'Rajshahi',
    affectedCustomerType: 'Smallholder vegetable producers (2-5 bigha landholders) and local rural aggregators (aratdars)',
    frequency: 'Peak occurrence 5 days per week during seasonal harvest months',
    existingAlternatives: 'Sprinkling pond water on sacks; covering with wet banana leaves; hiring rapid direct pickup minivans at 3x freight cost.',
    whyAlternativesFail: 'Wet banana leaves trap heat inside the sacks and trigger accelerated bacterial rot. Minivans are prohibitively expensive for individual farmers with small 200kg daily harvest volumes.',
    validationStatus: 'Validated',
    confidenceScorePercent: 95,
    opportunityType: 'Paid Challenge',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 75000,
      max: 250000,
      displayLabel: '৳75,000 - ৳250,000 BDT'
    },
    skillsRequired: ['Refrigeration / HVAC', 'Solar Microgrid / DC Inverter', 'Agricultural Engineering', 'Rural Distribution'],
    timeToFirstTest: '30 days for mobile pre-cooling trailer or cold room crate array',
    featured: true,
    dateReported: '2026-07-22',
    updatedAt: '2026-10-24',
    reportedBy: {
      name: 'Dr. Mahbubul Alam',
      role: 'Post-Harvest Specialist',
      organization: 'Northern Agri Development Trust'
    },
    imageUrl: '/images/agro_cold_chain_problem_1792999684587.jpg',
    imageAlt: 'Farmers unloading fresh produce at rural Bogura wholesale market',
    evidenceSources: [
      {
        title: 'Horticulture Department Post-Harvest Field Loss Audit',
        url: 'https://dae.gov.bd/postharvest-report-2025',
        sourceDate: '2025-10-15',
        sourceType: 'Government Report',
        summary: 'Field loss between northern farmgate and central transit terminals estimated at ৳4.8 Billion BDT annually for perishables.',
        verified: true
      },
      {
        title: 'Interviews with 24 Aratdars at Mahasthangarh Bazar, Bogura',
        sourceDate: '2026-06-12',
        sourceType: 'Field Interview',
        summary: 'Aratdars confirmed that pre-chilled produce commands a ৳4-৳7/kg premium at Karwan Bazar, and 85% of them would co-fund a shared cooling shed.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Rural vegetable aggregators, farmer co-ops, and peri-urban transport syndicates.',
      estimatedTAMBDT: '৳5.2 Billion BDT across 3,200 rural wholesale haats in northern and southern farming belts.',
      estimatedSAMBDT: '৳620 Million BDT in Bogura, Naogaon, and Jessore commercial vegetable hubs.',
      marketSizingMethodology: '1,200 active village arat nodes requiring ৳500,000 community cold-chain pre-cooling infrastructure over 5 years.',
      demandSignals: [
        'Farmers losing ৳100-৳180 per 40kg maund due to afternoon wilting',
        'Buyer complaints and dock rejections at retail chain distribution centers',
        'High interest from rural financial institutions for leasing productive agri-assets'
      ],
      competitorsAndSubstitutes: [
        'Central district cold stores (potato-only, high minimum deposit limits, far from farmgates)',
        'Private refrigerated reefer trucks (virtually nonexistent on rural feeder roads)',
        'Traditional open-air wooden slat truck transport'
      ],
      currentPricingExamples: [
        'Distress price reduction at Karwan Bazar: ৳5-৳8 per kg discount on wilted greens',
        'Large potato cold storage fee: ৳280 per 50kg bag for 6 months (unsuitable for 2-day vegetable turnover)'
      ],
      marketGaps: [
        'Absence of short-duration (12-48 hour) micro cold hubs charging per-crate-per-day rates (e.g. ৳15/crate)',
        'Lack of forced-air mobile pre-cooling units that can quickly extract field heat within 45 minutes of harvest'
      ]
    },
    potentialSolutions: [
      {
        id: 'sol-201',
        title: 'Solar-Assisted Decentralized Cold Room in Shipping Container',
        description: 'Refurbished 20ft insulated shipping container with 3.5kW solar PV array and thermal ice-bank storage, providing 4-8°C chilling for 4 metric tons of produce.',
        techStackOrMethod: 'Standard 20ft insulated container, DC inverter compressor, phase-change thermal brine tank',
        estimatedBuildTime: '6 weeks',
        upfrontCostEstimateBDT: '৳480,000 complete build cost',
        pros: ['Operates during daylight harvest peaks without costly diesel generator backup', 'Modular and movable'],
        cons: ['Requires road access for container placement and 3-phase grid or solar space']
      },
      {
        id: 'sol-202',
        title: 'Pay-Per-Use Forced-Air Pre-Cooling Mobile Tent',
        description: 'Collapsible high-insulation PVC canopy with a high-velocity chilled fan tunnel that cools crates from 35°C to 12°C in 40 minutes prior to loading.',
        techStackOrMethod: 'Industrial high-CFM blowers, lightweight modular insulated panels, portable condenser unit',
        estimatedBuildTime: '3 weeks',
        upfrontCostEstimateBDT: '৳140,000 build cost',
        pros: ['Rapid cooling halts respiration and water loss immediately', 'Low footprint at village bazars'],
        cons: ['Requires trained operator at collection point']
      }
    ],
    businessModels: [
      'Per-crate micro-fee: ৳15 BDT per 20kg crate for pre-cooling and 12-hour staging',
      'Revenue share with Aratdar Association: 20% commission on cold room rental revenue',
      'Supply chain premium capture: Direct partnership with modern retail chains (e.g., Shwapno, Meena Bazar)'
    ],
    validationPlan: {
      interviewQuestions: [
        'At what time of day does your produce show the highest spoilage?',
        'What is the price difference at Karwan Bazar between fresh morning-cut produce vs evening-stored produce?',
        'Would you pay ৳15 to keep a 20kg crate crisp until the 8:00 PM truck departs?'
      ],
      landingPageExperiment: 'Sign up 10 aratdars in Bogura Mahasthangarh for a paid trial harvest weekend with guaranteed temperature logging.',
      prototypeMVP: 'Deploy a 1-ton mobile trailer cooler at Mahasthangarh arat for 10 days of pointed gourd (potol) auctions.',
      successCriteria: 'Produce temperature dropped to 10°C within 1 hour; 0% spoilage reported upon arrival at Dhaka terminals; 90% repeat farmer booking.',
      first30DaysSteps: [
        'Day 1-10: Visit 5 village collection centers around Bogura and measure internal pulp temperature of harvest crates.',
        'Day 11-20: Finalize CAD drawings and procure compressor and thermal insulation foam.',
        'Day 21-27: Test rapid air circulation and chilling cycle with 20 test crates.',
        'Day 28-30: Present prototype performance data to the Challenge review board.'
      ]
    },
    potentialBuyers: [
      'Village Aratdar cooperatives and wholesale commission agents',
      'Contract farming export enterprises',
      'Modern urban supermarket fresh-sourcing divisions'
    ],
    customerAcquisitionChannels: [
      'Direct demonstration at weekly Haat days (e.g. Sunday & Wednesday haats)',
      'Collaboration with Upazila Agriculture Extension officers',
      'Local cooperative leadership endorsements'
    ],
    risksAndDependencies: [
      'Frequent rural power cuts require robust thermal battery or phase-change cooling reserves',
      'Trust barrier regarding crate accountability and theft during overnight holding',
      'Seasonal crop variation requiring flexible humidity and temperature setpoints'
    ],
    paidChallenge: {
      challengeId: 'chal-bogura-cold-01',
      sponsorOrganization: 'Bangladesh Agri-Tech Alliance (Supported by Dutch-Bangla Agro Fund)',
      sponsorWebsite: 'https://agri-alliance.org.bd/challenges/cold-chain',
      isVerifiedSponsor: true,
      fundingConfirmedBDT: 350000,
      currency: 'BDT',
      applicationDeadline: '2026-11-30',
      deliverables: [
        'Working bench prototype capable of reducing 500kg vegetable crate temperature by 15°C within 60 minutes.',
        'Total power consumption under 1.8kW with battery or thermal storage blueprint.',
        'Bill of materials utilizing at least 70% locally sourcable components in Bangladesh.',
        'Field trial report with temperature logs from a live rural collection point in Bogura or Rajshahi.'
      ],
      selectionCriteria: [
        'Thermal cooling speed and efficiency (30% weight)',
        'Capital cost affordability and local maintainability (25% weight)',
        'Ease of operation by rural youth/operators without engineering degree (20% weight)',
        'Robustness and water/dust resistance in monsoon conditions (25% weight)'
      ],
      milestones: [
        { milestoneName: 'Milestone 1: Architectural Design & BOM Approval', percentage: 25, amountBDT: 87500 },
        { milestoneName: 'Milestone 2: Functional Prototype Demonstration in Dhaka', percentage: 40, amountBDT: 140000 },
        { milestoneName: 'Milestone 3: 7-Day Live Field Validation in Bogura Market', percentage: 35, amountBDT: 122500 }
      ],
      intellectualPropertyTerms: 'The solver retains complete ownership of IP; sponsor receives non-exclusive right to pilot and procure 20 units at negotiated manufacturing rates.',
      escrowStatusNote: '100% of funds (৳350,000 BDT) verified and held in sponsor designated project reserve account. Milestones disbursed upon joint inspection.',
      openPositionsOrSlots: 2,
      applicationsCount: 7
    },
    followerCount: 112,
    solverCount: 23,
    discussionsCount: 29
  },
  {
    id: 'prob-3',
    slug: 'rural-diagnostic-report-bottleneck',
    title: 'Diagnostic Scan & Ultrasound Interpretation Bottleneck in Upazila Clinics',
    summary: 'Sub-district private clinics and NGO health centers in Sylhet and Rangpur wait 3 to 5 days for radiologist interpretation of ultrasound and X-ray images, delaying emergency obstetric decisions.',
    fullDescription: 'Over 70% of trained medical radiologists and sonologists in Bangladesh are located in Dhaka and Chittagong. In peripheral Upazilas like Sunamganj, Chhatak, and Kurigram, small clinics have basic X-ray and ultrasound machinery operated by junior technicians, but no resident radiologist. Scans must be burned onto CDs or photographed on smartphones to send via WhatsApp, resulting in blurred images, misdiagnoses, and dangerous delays for high-risk maternal pregnancies.',
    sector: 'Healthcare',
    location: 'Sylhet & Rangpur Divisions (Upazila level)',
    division: 'Sylhet',
    affectedCustomerType: 'Rural sub-district private diagnostic clinics, maternity centers, and general practitioners',
    frequency: 'Continuous daily bottleneck affecting 15-30 patients per clinic daily',
    existingAlternatives: 'Unofficial WhatsApp photo sharing of monitor screens; weekly visiting sonologists from divisional headquarters.',
    whyAlternativesFail: 'WhatsApp smartphone camera photos suffer from severe glare, loss of DICOM resolution, and lack HIPAA/patient privacy safeguards. Visiting sonologists only come once a week, making emergency triage impossible.',
    validationStatus: 'Validated',
    confidenceScorePercent: 88,
    opportunityType: 'Paid Challenge',
    difficulty: 'High Technical',
    estimatedStartupCostBDT: {
      min: 60000,
      max: 180000,
      displayLabel: '৳60,000 - ৳180,000 BDT'
    },
    skillsRequired: ['DICOM / Medical Imaging', 'Cloud Telemedicine / WebRTC', 'React Native / Next.js', 'Low-Bandwidth Compression'],
    timeToFirstTest: '21 days for secure DICOM gateway and triage web portal',
    featured: true,
    dateReported: '2026-09-02',
    updatedAt: '2026-10-21',
    reportedBy: {
      name: 'Dr. Nusrat Jahan',
      role: 'Public Health Physician',
      organization: 'Sylhet Maternal Care Initiative'
    },
    imageUrl: '/images/medical_diagnostic_remote_problem_1792999685240.jpg',
    imageAlt: 'Medical consultation at suburban diagnostic health clinic in Bangladesh',
    evidenceSources: [
      {
        title: 'Bangladesh Directorate General of Health Services (DGHS) Radiologist Distribution Report',
        url: 'https://dghs.gov.bd/reports/radiology-manpower',
        sourceDate: '2025-12-08',
        sourceType: 'Government Report',
        summary: 'Identified a ratio of only 1 radiologist per 145,000 rural citizens compared to 1 per 18,000 in central Dhaka.',
        verified: true
      },
      {
        title: 'Survey of 32 Upazila Diagnostic Centers in Sunamganj and Sylhet',
        sourceDate: '2026-08-10',
        sourceType: 'Field Interview',
        summary: 'Clinics reported losing an average of ৳45,000 monthly due to patients traveling to district towns because report turnaround exceeded 48 hours.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Sub-district private clinics, maternity clinics, and diagnostic labs in Tier-2 and Tier-3 towns.',
      estimatedTAMBDT: '৳1.8 Billion BDT annual tele-radiology review market across 4,500 sub-district clinics.',
      estimatedSAMBDT: '৳320 Million BDT in Sylhet and Rangpur divisions.',
      marketSizingMethodology: '4,500 clinics × 15 scans/day × ৳150 platform facilitation fee.',
      demandSignals: [
        'Clinics actively paying ৳300-৳500 per scan to informal tele-radiology freelancers',
        'Patients demanding same-day ultrasound reports for antenatal checkups',
        'High mobile 4G penetration in Upazila centers enabling lossless image transmission'
      ],
      competitorsAndSubstitutes: [
        'Informal WhatsApp/Viber groups (unsecure, no audit trail, legal liability)',
        'High-end enterprise PACS systems (GE/Siemens) costing over ৳1,500,000 (unaffordable for Upazila clinics)',
        'Physical paper printouts carried on local buses to district headquarters'
      ],
      currentPricingExamples: [
        'Current WhatsApp ad-hoc review: ৳250-৳400 paid informally via bKash per report',
        'Dhaka corporate hospital scan fee: ৳1,800 - ৳3,500'
      ],
      marketGaps: [
        'No lightweight, browser-based DICOM viewer optimized for 2G/3G edge connections',
        'Lack of automated payment escrow protecting both rural clinic and reviewing radiologist'
      ]
    },
    potentialSolutions: [
      {
        id: 'sol-301',
        title: 'Edge-Compression DICOM Tele-Triage Gateway',
        description: 'A tiny local background service installed on clinic ultrasound PCs that auto-extracts anonymized DICOM studies, applies lossless 80% compression, and uploads to a queue of verified radiologists.',
        techStackOrMethod: 'Electron / Node.js background agent, CornerstoneJS DICOM web viewer, WebRTC, Postgres',
        estimatedBuildTime: '4 weeks',
        upfrontCostEstimateBDT: '৳85,000 development & staging',
        pros: ['Zero change to technician workflow', 'Sub-minute upload even on 2Mbps mobile connection', 'Strict patient privacy'],
        cons: ['Requires onboarding accredited certified radiologists in Dhaka']
      }
    ],
    businessModels: [
      'Transaction Fee: ৳75 BDT platform fee per reviewed scan',
      'Monthly Clinic Subscription: ৳2,500 BDT/month for unlimited secure cloud storage and DICOM viewer',
      'Quality audit service for accreditation'
    ],
    validationPlan: {
      interviewQuestions: [
        'How many ultrasound and X-ray scans does your clinic perform each week?',
        'How do you currently get reports signed off, and how long does it take?',
        'If an accredited radiologist returned a signed PDF report within 60 minutes for ৳350, how many scans would you route through the system?'
      ],
      landingPageExperiment: 'Run a pilot demo with 5 clinics in Sunamganj; offer first 20 reviews with guaranteed 90-minute turnaround.',
      prototypeMVP: 'Web portal with CornerstoneJS DICOM viewer and WhatsApp alert bot for 3 on-call radiologists.',
      successCriteria: 'Average report turnaround under 45 minutes with 98% radiologist diagnostic confidence rating.',
      first30DaysSteps: [
        'Day 1-8: Interview 10 diagnostic lab owners in Sylhet and 4 radiologists in Dhaka.',
        'Day 9-18: Build zero-install web upload portal and DICOM viewer interface.',
        'Day 19-25: Conduct stress test with 50 real ultrasound anonymized files on 3G network.',
        'Day 26-30: Complete first live clinical pilot in Sunamganj.'
      ]
    },
    potentialBuyers: ['Upazila clinic directors', 'Rural maternity home owners', 'District hospital emergency wards'],
    customerAcquisitionChannels: ['Direct visits to Upazila Diagnostic Owners Association meetings', 'Medical rep network referrals'],
    risksAndDependencies: [
      'Regulatory compliance with Bangladesh Medical and Dental Council (BMDC) telemedicine guidelines',
      'Internet stability during heavy storm/flood periods in haor areas',
      'Maintaining active pool of licensed radiologists on on-call shifts'
    ],
    paidChallenge: {
      challengeId: 'chal-sylhet-health-02',
      sponsorOrganization: 'Sylhet Rural Health Trust & Telemed BD',
      sponsorWebsite: 'https://sylhet-health-trust.org/challenge',
      isVerifiedSponsor: true,
      fundingConfirmedBDT: 200000,
      currency: 'BDT',
      applicationDeadline: '2026-12-15',
      deliverables: [
        'Functional browser-based DICOM image viewer compatible with low-spec Windows 7/10 clinic PCs.',
        'Client-side lossless image compression pipeline achieving at least 60% file size reduction.',
        'SMS/WhatsApp notification webhook alerting on-call radiologists when an emergency scan is uploaded.',
        'Audit-logged report generator outputting signed BMDC-standard PDF reports.'
      ],
      selectionCriteria: [
        'Diagnostic viewer speed and image fidelity (35% weight)',
        'Data privacy and patient anonymization safeguards (25% weight)',
        'Ease of use for non-technical clinic ultrasound technicians (20% weight)',
        'System uptime and bandwidth resilience (20% weight)'
      ],
      milestones: [
        { milestoneName: 'Milestone 1: Prototype Viewer & Compression Pipeline', percentage: 30, amountBDT: 60000 },
        { milestoneName: 'Milestone 2: Security Audit & BMDC Report PDF Templating', percentage: 35, amountBDT: 70000 },
        { milestoneName: 'Milestone 3: Live Pilot with 3 Upazila Clinics in Sunamganj', percentage: 35, amountBDT: 70000 }
      ],
      intellectualPropertyTerms: 'Open source core (MIT license) with solver retaining right to commercialize enterprise maintenance and private integrations.',
      escrowStatusNote: 'Funds verified and held in escrow by Trust trustee account. Disbursed upon milestone sign-off.',
      openPositionsOrSlots: 1,
      applicationsCount: 4
    },
    followerCount: 76,
    solverCount: 16,
    discussionsCount: 19
  },
  {
    id: 'prob-4',
    slug: 'subcontractor-garment-fabric-leakage',
    title: 'Fabric Roll Scrap & Inventory Leakage in Tier-2/3 RMG Subcontractors',
    summary: 'Small apparel subcontracting factories in Gazipur and Narayanganj lose 5% to 8% of cut-piece fabric due to manual notebook cutting-floor marker planning and leftover roll mismanagement.',
    fullDescription: 'While tier-1 export garment factories in EPZs utilize automated Gerber or Lectra computerized cutting tables, thousands of tier-2 subcontracting units operate with manual chalk markers on long wooden tables. Factory managers estimate fabric consumption by visual guesswork, resulting in 6% to 9% excess end-bits, short ends, and untracked fabric shrinkage. At current raw fabric prices (৳280-৳450/yard), a small 80-machine factory loses ৳180,000 to ৳350,000 monthly in scrap fabric that is sold off as jhut at pennies on the dollar.',
    sector: 'Technology',
    location: 'Gazipur, Narayanganj & Savar',
    division: 'Dhaka',
    affectedCustomerType: 'Tier-2 and Tier-3 RMG subcontractors, washing/cutting units, and medium knitting factories',
    frequency: 'Continuous on every cutting order batch (3-4 production batches weekly)',
    existingAlternatives: 'Manual paper registers and chalk markings; standard generic Excel sheets maintained by master tailors.',
    whyAlternativesFail: 'Excel sheets are disconnected from physical rolls and updated hours after cutting is finished. Master tailors resist complex CAD software requiring expensive high-end workstations and formal technical training.',
    validationStatus: 'Evidence Supported',
    confidenceScorePercent: 78,
    opportunityType: 'Client Request',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 35000,
      max: 95000,
      displayLabel: '৳35,000 - ৳95,000 BDT'
    },
    skillsRequired: ['Web Application Development', 'QR / Barcode Scanning', 'Inventory Math', 'Bengali UI Design'],
    timeToFirstTest: '14 days for mobile camera roll-tracking MVP',
    featured: false,
    dateReported: '2026-08-30',
    updatedAt: '2026-10-15',
    reportedBy: {
      name: 'Ashfaqur Rahman',
      role: 'Operations Consultant',
      organization: 'Apparel Logistics Group'
    },
    imageUrl: '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: 'Bangladeshi engineering team analyzing logistics workflows',
    evidenceSources: [
      {
        title: 'BGMEA Subcontracting Factory Productivity Whitepaper',
        sourceDate: '2025-09-18',
        sourceType: 'Industry Survey',
        summary: 'Average material utilization efficiency in tier-3 factories is 81.4% compared to 89.2% in automated tier-1 facilities.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Factory owners and cutting masters in Gazipur, Savar, and Narayanganj with 40-150 sewing stations.',
      estimatedTAMBDT: '৳1.2 Billion BDT across 3,800 registered and unregistered subcontracting factories.',
      estimatedSAMBDT: '৳280 Million BDT in Gazipur industrial zone.',
      marketSizingMethodology: '3,800 factories × ৳75,000 annual software/tracking subscription fee.',
      demandSignals: [
        'Rising fabric procurement costs squeezing subcontracting margins below 4%',
        'Buyer audits demanding transparent material consumption certificates'
      ],
      competitorsAndSubstitutes: ['Lectra / Gerber (expensive, ৳2M+ initial license)', 'Local jhut scrap traders'],
      currentPricingExamples: ['Imported cutting software: ৳1,800,000 license fee + ৳200,000 training'],
      marketGaps: ['No Bengali-language, smartphone-based marker calculator that works right on the cutting table']
    },
    potentialSolutions: [
      {
        id: 'sol-401',
        title: 'Smartphone QR Fabric Roll Tracker & Marker Calculator',
        description: 'A rugged mobile app where cutting assistants scan roll QR codes, input cut order quantities, and receive optimal marker lengths in Bengali audio and visual layout.',
        techStackOrMethod: 'Next.js PWA, Camera QR reader, 1D bin-packing optimization algorithm',
        estimatedBuildTime: '3 weeks',
        upfrontCostEstimateBDT: '৳45,000 prototype cost',
        pros: ['Runs on affordable ৳8,000 Android phones', 'Immediate feedback in Bengali'],
        cons: ['Requires cultural change on dusty cutting floor']
      }
    ],
    businessModels: [
      'Software as a Service: ৳3,500 BDT/month per factory floor with unlimited cutting orders',
      'Gain-share: 15% of verified fabric savings over 6-month contracts'
    ],
    validationPlan: {
      interviewQuestions: [
        'How many kilograms of leftover fabric ends are sold as jhut from your cutting room each month?',
        'How much do you pay your master cutter, and how does he plan marker length for varying roll widths?'
      ],
      landingPageExperiment: 'Offer a free 1-week fabric loss calculation audit to 10 factory owners in Konabari, Gazipur.',
      prototypeMVP: 'Web-based marker roll calculator tested with 1 master cutter over 5 production runs.',
      successCriteria: 'Demonstrated reduction in scrap fabric of at least 2.5% of total order yardage.',
      first30DaysSteps: [
        'Day 1-7: Shadow 3 cutting room floors in Gazipur.',
        'Day 8-16: Program linear cutting optimization heuristic in JavaScript.',
        'Day 17-23: Test with paper markers and actual cut pieces.',
        'Day 24-30: Run parallel comparison test against master cutter estimates.'
      ]
    },
    potentialBuyers: ['Subcontracting RMG owners', 'Garment production managers'],
    customerAcquisitionChannels: ['Direct visits to Gazipur factory clusters', 'Referrals through trim and fabric suppliers'],
    risksAndDependencies: ['Worker reluctance to log data', 'Resistance from master cutters who view manual guesswork as job security'],
    followerCount: 54,
    solverCount: 11,
    discussionsCount: 8
  },
  {
    id: 'prob-5',
    slug: 'solar-irrigation-pump-idle-capacity',
    title: 'Idle Capacity & Billing Friction in Solar Irrigation Pump Schemes',
    summary: 'Northern solar irrigation pumps (SIPs) operate at only 35-45% capacity during non-paddy months, while nearby vegetable farmers still burn costly diesel for water.',
    fullDescription: 'Under IDCOL and private initiatives, over 2,800 solar irrigation pumps are installed in Dinajpur, Naogaon, and Kushtia. During the peak Boro paddy season (Jan - April), pumps run 8-10 hours daily. However, during Aman and winter vegetable seasons, the multi-million taka solar panels sit idle 60% of the day. Meanwhile, adjacent vegetable and maize growers operate noisy, polluting diesel pumps spending ৳140/liter on fuel, unable to buy water from the solar pump due to rigid payment disputes, lack of flexible hose routing, and mistrust between pump operators and marginal farmers.',
    sector: 'Environment',
    location: 'Dinajpur, Naogaon & Bogura',
    division: 'Rangpur',
    affectedCustomerType: 'Marginal tenant farmers (1-2 bigha) and solar pump utility operators',
    frequency: 'Intermittent weekly during off-peak dry spells (May - December)',
    existingAlternatives: 'Diesel shallow tube wells; manual bucket hauling; ad-hoc cash negotiations with solar operators.',
    whyAlternativesFail: 'Diesel fuel costs have doubled, eating up 35% of marginal vegetable harvest returns. Ad-hoc cash deals lead to arguments over pump hours and water theft accusations.',
    validationStatus: 'Evidence Supported',
    confidenceScorePercent: 82,
    opportunityType: 'Collaboration',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 45000,
      max: 130000,
      displayLabel: '৳45,000 - ৳130,000 BDT'
    },
    skillsRequired: ['IoT Pulse Flow Sensors', 'bKash/Nagad Payment Webhooks', 'Embedded Firmware', 'Rural Operations'],
    timeToFirstTest: '25 days for pre-paid RFID/SMS water dispensing tap',
    featured: false,
    dateReported: '2026-09-12',
    updatedAt: '2026-10-19',
    reportedBy: {
      name: 'Engr. Kamal Uddin',
      role: 'Renewable Energy Systems Researcher',
      organization: 'Green Energy Bangladesh Initiative'
    },
    imageUrl: '/images/agro_cold_chain_problem_1792999684587.jpg',
    imageAlt: 'Agricultural water management and rural farmgate in northern Bangladesh',
    evidenceSources: [
      {
        title: 'IDCOL Solar Irrigation Project Utilization Review',
        sourceDate: '2025-11-30',
        sourceType: 'Government Report',
        summary: 'Noted average system capacity factor of solar pumps outside Boro season was under 38%, creating extended loan repayment cycles for pump sponsors.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Solar pump operating companies and 80,000 surrounding tenant farming households.',
      estimatedTAMBDT: '৳840 Million BDT annual water utility billing market across 2,800 operational solar pump sites.',
      estimatedSAMBDT: '৳190 Million BDT in northern Barind tract.',
      marketSizingMethodology: '2,800 pumps × ৳300,000 annual off-season water sales potential.',
      demandSignals: [
        'Farmers complaining of diesel costs at ৳140/L',
        'Pump operators struggling with fixed debt servicing to IDCOL partner institutions'
      ],
      competitorsAndSubstitutes: ['Diesel pumps (expensive operating cost)', 'Electric grid pumps (frequent load shedding)'],
      currentPricingExamples: ['Diesel pump rental: ৳250 - ৳350 per hour of watering', 'Solar pump flat rate: ৳150 per hour (when available)'],
      marketGaps: ['No micro-metered pay-as-you-go water token system that allows a farmer to buy 20 minutes of irrigation via bKash']
    },
    potentialSolutions: [
      {
        id: 'sol-501',
        title: 'bKash/SMS Enabled Automated Smart Water Valve',
        description: 'A solenoid valve box connected to pump discharge with an GSM microcontroller; farmers send ৳50 via bKash or dial USSD to unlock water for 25 minutes automatically.',
        techStackOrMethod: 'SIM800L GSM module, pulse water flow meter, 24V latching solenoid valve, micro-controller',
        estimatedBuildTime: '4 weeks',
        upfrontCostEstimateBDT: '৳18,000 per pump retrofit cost',
        pros: ['Eliminates operator extortion and cash disputes', 'Zero manual bookkeeping required'],
        cons: ['Requires reliable 2G cellular signal at the pump shed']
      }
    ],
    businessModels: [
      'Hardware Sale + 5% transaction commission on prepaid water volume billed',
      'Leasing model to pump sponsors: ৳800 BDT/month per automated valve installation'
    ],
    validationPlan: {
      interviewQuestions: [
        'How many hours did your solar pump run yesterday?',
        'Why do neighboring vegetable farmers not buy water from your pump during November-January?'
      ],
      landingPageExperiment: 'Field demonstration in Birganj, Dinajpur with 1 pump owner and 8 neighboring farmers.',
      prototypeMVP: 'Bench test 1 GSM valve with bKash merchant webhook.',
      successCriteria: 'Successful remote activation and accurate volume cut-off across 30 test cycles.',
      first30DaysSteps: [
        'Day 1-10: Connect with 2 solar pump operators in Dinajpur.',
        'Day 11-20: Build valve controller PCB and assemble weatherproof enclosure.',
        'Day 21-30: Run 7-day live field irrigation trial with 5 local farmers.'
      ]
    },
    potentialBuyers: ['IDCOL partner organizations', 'Independent solar pump entrepreneurs', 'Water users associations'],
    customerAcquisitionChannels: ['Partnerships with renewable energy NGO operators', 'Farmer union rallies'],
    risksAndDependencies: ['Water pipe vandalism or unauthorized bypass', 'Lightning strikes in open fields during early summer'],
    followerCount: 63,
    solverCount: 14,
    discussionsCount: 11
  },
  {
    id: 'prob-6',
    slug: 'secondary-char-education-offline-access',
    title: 'Monsoon Disconnection of Secondary Learning in Riverine Char Schools',
    summary: 'Over 450 secondary schools on isolated Brahmaputra and Jamuna char islands lose teacher attendance and cellular connectivity for up to 3 months during annual flooding.',
    fullDescription: 'In riverine islands (chars) across Kurigram, Gaibandha, and Sirajganj, over 90,000 students attend schools that are isolated by swirling river waters. Qualified science and mathematics teachers often cannot travel by boat during storms, leading to teacher absentee rates above 40%. While urban students rely on YouTube tutorials and EdTech apps, char students have zero mobile network or intermittent 2G during monsoons, creating severe learning loss and secondary school dropout rates of 38% by Class 9.',
    sector: 'Education',
    location: 'Kurigram, Gaibandha & Sirajganj (River Chars)',
    division: 'Rangpur',
    affectedCustomerType: 'Char secondary school students, rural teachers, and local education NGOs',
    frequency: 'Recurring seasonal crisis lasting 90-120 days each monsoon year',
    existingAlternatives: 'Printed paper guidebooks; community radio broadcasts; visiting volunteers.',
    whyAlternativesFail: 'Paper guidebooks cannot explain complex mathematics and science concepts interactively. Community radio is broadcast at fixed hours when students are helping families with flood evacuation.',
    validationStatus: 'Evidence Supported',
    confidenceScorePercent: 79,
    opportunityType: 'Open Problem',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 50000,
      max: 150000,
      displayLabel: '৳50,000 - ৳150,000 BDT'
    },
    skillsRequired: ['Offline-First Web Apps (PWA)', 'Raspberry Pi / Micro-Server', 'Content Curation (NCTB Curriculum)', 'Low-Power Solar'],
    timeToFirstTest: '14 days for local offline Wi-Fi content box',
    featured: false,
    dateReported: '2026-08-18',
    updatedAt: '2026-10-10',
    reportedBy: {
      name: 'Shamima Akter',
      role: 'Rural Education Field Coordinator',
      organization: 'Char Development Consortium'
    },
    imageUrl: '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: 'Educational initiative collaboration in Bangladesh',
    evidenceSources: [
      {
        title: 'Campaign for Popular Education (CAMPE) Char Education Review',
        sourceDate: '2025-07-25',
        sourceType: 'NGO Audit',
        summary: 'Documented 42% learning gap between mainland and char secondary students in SSC science subjects.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Rural schools, local government education offices, and international development partners.',
      estimatedTAMBDT: '৳450 Million BDT in specialized offline educational hardware and localized content distribution.',
      estimatedSAMBDT: '৳95 Million BDT in northern riverine districts.',
      marketSizingMethodology: '1,200 char schools × ৳80,000 per school solar offline server kit.',
      demandSignals: [
        'NGOs spending heavily on printed booklets that get destroyed in floods',
        'Parents pooling money to buy mobile data that fails to connect'
      ],
      competitorsAndSubstitutes: ['Mainland coaching centers (inaccessible during floods)', '10 Minute School (requires fast internet)'],
      currentPricingExamples: ['Private mainland coaching: ৳1,500/month (plus boat transport costs)'],
      marketGaps: ['Absence of an ultra-low power local Wi-Fi hotspot box preloaded with complete NCTB video lectures and exercises']
    },
    potentialSolutions: [
      {
        id: 'sol-601',
        title: 'Solar-Powered "CharNet" Micro-Server & Offline Wi-Fi Hub',
        description: 'A sealed 10W solar box with a Raspberry Pi running an offline localized web server that broadcasts a free Wi-Fi network up to 150 meters; any student phone connects to stream NCTB lectures without internet.',
        techStackOrMethod: 'Raspberry Pi 4 / Orange Pi, 128GB high-endurance SD, Kolibri / Kiwix engine, 30W solar panel',
        estimatedBuildTime: '2 weeks',
        upfrontCostEstimateBDT: '৳14,500 per school node',
        pros: ['Zero mobile data cost for students', 'Functions completely off-grid through 3 overcast days', 'Open NCTB curriculum'],
        cons: ['Requires initial manual SD card updates once per term']
      }
    ],
    businessModels: [
      'Institutional procurement by NGOs, CSR funds, and Upazila parishads: ৳22,000 BDT per unit installed',
      'Maintenance and termly content refresh package: ৳3,000 BDT/term'
    ],
    validationPlan: {
      interviewQuestions: [
        'How many days per month do science classes get canceled during the flood season?',
        'Do students have access to at least one smartphone in their household in the evening?'
      ],
      landingPageExperiment: 'Present the offline server concept to 3 NGOs working in Chilmari, Kurigram.',
      prototypeMVP: 'Deploy 1 prototype offline box in a community shelter in Kurigram for 14 days.',
      successCriteria: 'At least 40 active student connections daily and 80%+ positive comprehension rating from students.',
      first30DaysSteps: [
        'Day 1-8: Download and curate Class 8-10 NCTB science and math video animations.',
        'Day 9-16: Configure captive portal and local Wi-Fi broadcast script on single-board computer.',
        'Day 17-24: Test simultaneous streaming to 15 smartphones.',
        'Day 25-30: Deliver pilot unit to Char Chilmari high school.'
      ]
    },
    potentialBuyers: ['Education NGOs', 'CSR arms of mobile telecom operators', 'District education offices'],
    customerAcquisitionChannels: ['Direct presentations to NGO education cluster meetings', 'Upazila education officer demos'],
    risksAndDependencies: ['Severe moisture/water damage requires IP67 waterproof enclosure', 'Theft of solar panels'],
    followerCount: 39,
    solverCount: 8,
    discussionsCount: 6
  },
  {
    id: 'prob-7',
    slug: 'freelance-remittance-fx-clearing-delays',
    title: 'High Hidden FX Spreads & 5-Day Clearing on Tech Freelance Inward Remittances',
    summary: 'Over 650,000 Bangladeshi digital freelancers and IT exporters lose 3.5% to 6.2% on international client payments through intermediary banking fees and unannounced exchange rate haircuts.',
    fullDescription: 'Bangladesh boasts one of the largest freelance developer and designer communities in South Asia. When receiving USD/EUR payments from platforms like Upwork, Fiverr, Deel, or direct overseas corporate clients, payments route through multiple correspondent banks before reaching local commercial banks. In addition to a $15-$30 SWIFT charge, local banks frequently convert funds at ৳117/$ when the interbank rate is ৳122/$, costing an average tech worker ৳12,000 to ৳35,000 per monthly payout alongside frustrating 4 to 7 business day delays.',
    sector: 'Finance',
    location: 'National / All Bangladesh',
    division: 'National',
    affectedCustomerType: 'Independent software engineers, UI/UX designers, digital marketing agencies, and remote workers',
    frequency: 'Monthly or bi-weekly payment cycles',
    existingAlternatives: 'Payoneer; direct SWIFT bank wire; crypto informal transfers (P2P); Western Union cash pickups.',
    whyAlternativesFail: 'Payoneer charges heavy withdrawal fees and applies poor FX rates. Direct bank wire takes nearly a week and requires filling paper remittance declaration forms at bank branches. Informal crypto P2P is legally precarious in Bangladesh.',
    validationStatus: 'Evidence Supported',
    confidenceScorePercent: 86,
    opportunityType: 'Marketplace',
    difficulty: 'Systemic / Capital Intensive',
    estimatedStartupCostBDT: {
      min: 150000,
      max: 500000,
      displayLabel: '৳150,000 - ৳500,000 BDT'
    },
    skillsRequired: ['Fintech API Integration', 'Regulatory Compliance (Bangladesh Bank)', 'Payment Gateway Architecture', 'Web Security'],
    timeToFirstTest: '30 days for transparent FX rate comparison and digital declaration tool',
    featured: false,
    dateReported: '2026-09-28',
    updatedAt: '2026-10-22',
    reportedBy: {
      name: 'Zahid Hossain',
      role: 'Fintech Advocate & Developer',
      organization: 'Dhaka Freelancers Council'
    },
    imageUrl: '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: 'Tech workers collaborating on financial architecture in Dhaka',
    evidenceSources: [
      {
        title: 'BASIS Freelancer Remittance & Banking Experience Survey',
        sourceDate: '2026-02-14',
        sourceType: 'Industry Survey',
        summary: 'Survey of 450 IT export freelancers revealed average real loss of 4.8% between invoice amount and money deposited in local BDT accounts.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: '650,000+ registered freelance workers and 2,500 small software export houses.',
      estimatedTAMBDT: '৳14 Billion BDT annual remittance facilitation and FX margin pool.',
      estimatedSAMBDT: '৳2.8 Billion BDT for direct tech freelancer inward wires.',
      marketSizingMethodology: '$1.2 Billion annual IT remittance inflows × 3% addressable FX spread/fee pool.',
      demandSignals: [
        'Constant community discussions on Reddit, Facebook, and Discord regarding best local bank conversion rates',
        'Frustration with manual bank verification calls and paperwork'
      ],
      competitorsAndSubstitutes: ['Payoneer', 'Wise (restricted business payouts to BD)', 'City Bank / BRAC Bank direct remits'],
      currentPricingExamples: ['Payoneer: 2% transfer fee + 2-3% spread = ~5% total fee'],
      marketGaps: ['No automated tool that allows a freelancer to pre-lock real-time Bangladesh Bank incentive rate and bypass physical branch visits']
    },
    potentialSolutions: [
      {
        id: 'sol-701',
        title: 'RemitTrack: Real-Time Bank FX Rate & Delay Benchmarker with Auto-Forms',
        description: 'A platform connecting directly with partner banks via API to compare exact today’s net BDT conversion rate across all 14 commercial banks and auto-generate Form C digital declarations.',
        techStackOrMethod: 'Next.js, Bank Open-API webhooks, PDF generation, Encrypted vault',
        estimatedBuildTime: '4 weeks',
        upfrontCostEstimateBDT: '৳120,000 MVP cost',
        pros: ['Empowers freelancers to route funds to whichever bank offers top rate on that day', 'Zero regulatory license required for informational routing'],
        cons: ['Requires ongoing scraper/API maintenance across bank websites']
      }
    ],
    businessModels: [
      'Bank referral commission: ৳300-৳600 per new high-volume freelance account opened',
      'Premium subscription for agencies: ৳1,200/mo for bulk transaction tracking and audit compliance'
    ],
    validationPlan: {
      interviewQuestions: [
        'How much did you lose in fees on your last $1,000 client withdrawal?',
        'How many days did you have to wait between client transfer and receiving the BDT SMS notification?'
      ],
      landingPageExperiment: 'Launch rate comparison calculator on Facebook developer groups and track email signups.',
      prototypeMVP: 'Build live calculator comparing net BDT received across 8 popular banks for a $500 invoice.',
      successCriteria: 'Over 1,000 active calculator queries within first 7 days.',
      first30DaysSteps: [
        'Day 1-7: Interview 20 freelancers and 3 branch remittance managers.',
        'Day 8-15: Map out fee structures and government 2.5% incentive payout conditions.',
        'Day 16-24: Build live comparison table web tool.',
        'Day 25-30: Distribute to developer communities.'
      ]
    },
    potentialBuyers: ['Freelance developers', 'BPO and digital marketing agencies'],
    customerAcquisitionChannels: ['Tech Facebook groups (BD Freelancers, Bangladesh React Community)', 'Tech university campus ambassadors'],
    risksAndDependencies: ['Changes in central bank foreign exchange circulars', 'Bank API rate limiting'],
    followerCount: 91,
    solverCount: 19,
    discussionsCount: 22
  },
  {
    id: 'prob-8',
    slug: 'municipal-waste-segregation-dhaka-north',
    title: 'Landfill Overflow from Unsegregated Waste in High-Density Residential Wards',
    summary: 'Residential wards in Dhaka North generate 3,500 tons of mixed solid waste daily; over 65% is organic biodegradable matter that rots in Matuail/Aminbazar landfills due to absent household segregation incentives.',
    fullDescription: 'In areas like Uttara, Gulshan, and Banani, municipal vans (van-walas) collect unseparated trash bags containing food scraps, toxic plastic, batteries, and paper mixed together. Because waste pickers only salvage high-value thick plastics and metals, biodegradable food waste rots, producing dangerous methane and leachate that contaminates groundwater. City corporations spend over ৳450 Million annually trucking mixed wet trash across congested roads, while potential compost and biogas value is completely wasted.',
    sector: 'Public Services',
    location: 'Dhaka North City Corporation (DNCC)',
    division: 'Dhaka',
    affectedCustomerType: 'Ward residential associations, municipal sanitation authorities, and private recycling enterprises',
    frequency: 'Daily morning household collection routines',
    existingAlternatives: 'Single mixed garbage bag collection; sporadic door-to-door municipal awareness flyers.',
    whyAlternativesFail: 'Flyers create no financial or social incentive for households or domestic helpers to separate trash. Van-walas have no time to sort dirty mixed bags on the street.',
    validationStatus: 'Researching',
    confidenceScorePercent: 68,
    opportunityType: 'Open Problem',
    difficulty: 'Moderate',
    estimatedStartupCostBDT: {
      min: 40000,
      max: 110000,
      displayLabel: '৳40,000 - ৳110,000 BDT'
    },
    skillsRequired: ['Community Operations', 'Mobile App / Gamification', 'Waste Logistics', 'SME B2B Sales'],
    timeToFirstTest: '14 days for 1 apartment building pilot with color-coded QR bags',
    featured: false,
    dateReported: '2026-10-02',
    updatedAt: '2026-10-20',
    reportedBy: {
      name: 'Nayeem Chowdhury',
      role: 'Urban Environmental Researcher',
      organization: 'Clean Dhaka Future'
    },
    imageUrl: '/images/hero_bangladesh_innovation_1792999684164.jpg',
    imageAlt: 'Urban civic initiative planning in Dhaka',
    evidenceSources: [
      {
        title: 'DNCC Solid Waste Management Baseline Study',
        sourceDate: '2025-08-10',
        sourceType: 'Government Report',
        summary: 'Identified 68% organic waste composition and projected landfill saturation within 4 years without primary sorting.',
        verified: true
      }
    ],
    marketAnalysis: {
      targetCustomerProfile: 'Residential building flat owners associations and corporate commercial food courts.',
      estimatedTAMBDT: '৳1.5 Billion BDT in compost raw materials, RDF fuel, and segregated waste collection fees.',
      estimatedSAMBDT: '৳240 Million BDT in Uttara and Gulshan residential sectors.',
      marketSizingMethodology: '120,000 apartments × ৳150/mo premium for clean segregated collection service.',
      demandSignals: [
        'Apartment committees complaining of foul dumpster odors outside buildings',
        'Compost manufacturing companies in Gazipur unable to source clean organic waste'
      ],
      competitorsAndSubstitutes: ['Informal van-walas (informal monopoly in wards)', 'DNCC municipal trucks'],
      currentPricingExamples: ['Household monthly trash fee: ৳100 - ৳250 paid to local van collectors'],
      marketGaps: ['No direct financial reward or utility rebate for households that consistently segregate wet and dry waste']
    },
    potentialSolutions: [
      {
        id: 'sol-801',
        title: 'Smart Ward Segregation System with Grocery Coupon Incentives',
        description: 'Provide households with color-coded QR biodegradable bags; when the building van collector scans a clean sorted bag, the household receives digital reward points redeemable at local neighborhood grocery stores.',
        techStackOrMethod: 'Lightweight mobile app for van collector, QR bag batch printer, retail coupon API',
        estimatedBuildTime: '3 weeks',
        upfrontCostEstimateBDT: '৳50,000 pilot cost',
        pros: ['Immediate tangible incentive for domestic workers and households', 'Van collector gets bonus per clean bag'],
        cons: ['Requires initial subsidy or sponsorship for reward points']
      }
    ],
    businessModels: [
      'Sale of clean sorted organic matter to fertilizer producers at ৳3/kg',
      'Sale of high-density clean recyclables to plastic re-processors',
      'Monthly building service premium: ৳150/apartment'
    ],
    validationPlan: {
      interviewQuestions: [
        'Would your household separate kitchen food waste from plastic if you received ৳100 monthly grocery discount vouchers?',
        'How much does your building association currently pay your neighborhood trash collector?'
      ],
      landingPageExperiment: 'Pitch to 3 apartment association leaders in Uttara Sector 4.',
      prototypeMVP: 'Run 14-day segregated trial in one 24-unit apartment building with 2 color bins.',
      successCriteria: 'Over 85% compliance rate of un-contaminated organic waste over 14 consecutive days.',
      first30DaysSteps: [
        'Day 1-7: Meet local van-wala cooperative leader in Uttara.',
        'Day 8-15: Secure agreement with 1 building management committee.',
        'Day 16-24: Distribute bins and educate domestic helpers.',
        'Day 25-30: Measure daily segregated weight and compost sample quality.'
      ]
    },
    potentialBuyers: ['Apartment building committees', 'Commercial food chains', 'City corporation sanitation contractors'],
    customerAcquisitionChannels: ['Direct outreach to Building Welfare Societies', 'Community Facebook groups in Uttara/Gulshan'],
    risksAndDependencies: ['Political friction with entrenched local waste collection cartels', 'Contamination in bags'],
    followerCount: 41,
    solverCount: 7,
    discussionsCount: 9
  }
];

export const INITIAL_PROPOSALS: SolutionProposal[] = [
  {
    id: 'prop-101',
    problemId: 'prob-2',
    problemTitle: 'Pre-Cooling Bottlenecks for Northern Vegetable Farmers at Village Arat Points',
    solverId: 'user-solver-1',
    solverName: 'Tariqul Hasan',
    solverEmail: 'tariq.dev@dhaka.io',
    solverSkills: ['React Native', 'ESP32 / IoT', 'Next.js', 'PostgreSQL'],
    title: 'Low-Power Mobile Chilled Tunnel with IoT Heat Sensors & Solar Inverter',
    approach: 'We will construct a 500kg mobile forced-air cooling trailer using locally built polyurethane sandwich panels and an energy-efficient Copeland scroll compressor. Temperature and air velocity sensors will report live metrics to an offline-first dashboard for aratdars.',
    techStack: 'ESP32 Microcontroller, Modbus RTU, React PWA, Node.js, 48V DC inverter',
    estimatedDays: 45,
    requestedBudgetBDT: 340000,
    status: 'Shortlisted',
    submittedAt: '2026-10-14T10:30:00Z',
    updatedAt: '2026-10-20T16:00:00Z',
    reviewerNotes: 'Highly promising technical architecture. Team invited for virtual technical milestone interview with Dutch-Bangla Agro Fund engineers.'
  },
  {
    id: 'prop-102',
    problemId: 'prob-3',
    problemTitle: 'Diagnostic Scan & Ultrasound Interpretation Bottleneck in Upazila Clinics',
    solverId: 'user-solver-1',
    solverName: 'Tariqul Hasan',
    solverEmail: 'tariq.dev@dhaka.io',
    solverSkills: ['Next.js', 'DICOM WebRTC', 'Low-Bandwidth Compression'],
    title: 'Edge DICOM Tele-Triage Gateway with WebRTC & SMS Alerts',
    approach: 'A lightweight Windows client that listens to local DICOM C-STORE from the clinic ultrasound machine, strips PII, compresses using custom wavelet algorithm, and streams directly to our browser viewer for Dhaka radiologists.',
    techStack: 'Electron, CornerstoneJS, WebRTC, Tailwind, PostgreSQL',
    estimatedDays: 30,
    requestedBudgetBDT: 195000,
    status: 'Under Review',
    submittedAt: '2026-10-18T14:15:00Z',
    updatedAt: '2026-10-18T14:15:00Z',
    reviewerNotes: 'Under initial compliance check by Sylhet Rural Health Trust medical officers.'
  }
];

export const INITIAL_COMMENTS: DiscussionComment[] = [
  {
    id: 'comm-1',
    problemId: 'prob-1',
    authorName: 'Mohiuddin Ahmed',
    authorEmail: 'mohi.sme@dhaka.biz',
    authorRole: 'submitter',
    comment: 'In Mirpur 12, grocers lose the most money on coriander (dhone pata) and green chilies during heavy rain spells. If a cooler handles leafy greens without wilting them into black mush, every grocer will gladly rent it.',
    createdAt: '2026-09-04T08:12:00Z'
  },
  {
    id: 'comm-2',
    problemId: 'prob-1',
    authorName: 'Tariqul Hasan',
    authorEmail: 'tariq.dev@dhaka.io',
    authorRole: 'solver',
    comment: 'We tested a 12V thermoelectric element with evaporative cooling wicks. It maintains 19°C with 88% humidity while using only 18 Watts—meaning it can run off a tiny ৳2,500 battery backup during load shedding.',
    createdAt: '2026-09-15T11:45:00Z'
  },
  {
    id: 'comm-3',
    problemId: 'prob-2',
    authorName: 'Dr. Mahbubul Alam',
    authorEmail: 'mahbub.agri@trust.bd',
    authorRole: 'organization',
    comment: 'Note to all challenge applicants: Please make sure spare parts like fans and thermostats can be purchased directly from Nawabpur road in Dhaka. We cannot deploy equipment that halts when an imported part fails.',
    createdAt: '2026-10-05T09:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-1',
    timestamp: '2026-10-24T14:30:00Z',
    actorEmail: 'admin@supplierhut.bd',
    actorRole: 'Admin',
    action: 'STATUS_UPDATE',
    targetType: 'Problem',
    targetId: 'prob-2',
    details: 'Verified field loss documentation and confirmed Dutch-Bangla Agro Fund ৳350,000 paid challenge budget.'
  },
  {
    id: 'audit-2',
    timestamp: '2026-10-22T11:15:00Z',
    actorEmail: 'admin@supplierhut.bd',
    actorRole: 'Admin',
    action: 'PROPOSAL_SHORTLIST',
    targetType: 'Proposal',
    targetId: 'prop-101',
    details: 'Shortlisted proposal by Tariqul Hasan for Northern Vegetable Pre-Cooler challenge.'
  },
  {
    id: 'audit-3',
    timestamp: '2026-10-20T08:00:00Z',
    actorEmail: 'admin@supplierhut.bd',
    actorRole: 'Admin',
    action: 'EVIDENCE_VERIFIED',
    targetType: 'Evidence',
    targetId: 'prob-1',
    details: 'Verified BBS informal retail survey citations and updated confidence score to 92%.'
  }
];

export const INITIAL_REPORTS: ProblemReport[] = [
  {
    id: 'rep-1',
    problemId: 'prob-8',
    problemTitle: 'Municipal Waste Segregation in High-Density Residential Wards',
    reporterEmail: 'user.visitor@outlook.com',
    reason: 'Duplicate Problem',
    details: 'Similar waste initiative was attempted in Gulshan-1 in 2024. Please cross-reference that pilot outcome.',
    createdAt: '2026-10-23T09:12:00Z',
    status: 'Open'
  }
];
