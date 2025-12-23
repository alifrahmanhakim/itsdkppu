export const mockInspectors = [
    {
        id: 'INS-001',
        name: 'ALIF RAHMAN HAKIM',
        role: 'PENGEVALUASI PENERBANGAN',
        domain: 'Flight Operations',
        group: 'Air Carrier Operations',
        subdirectorate: 'Operations',
        workingUnit: 'DKPPU',
        avatar: 'https://ik.imagekit.io/avmxsiusm/WhatsApp%20Image%202025-12-02%20at%2015.30.46.webp',
        stats: {
            formal: 85,
            ojt: 92
        },
        trainingLog: {
            mandatory: {
                current: [
                    { code: 'OPS-RECUR-01', fcnName: 'B737 RECURRENT TRAINING', training: 'Boeing Training Specialist', expired: '2025-12-31', status: 'Valid' },
                    { code: 'SMS-02', fcnName: 'SAFETY MANAGEMENT SYSTEM', training: 'ICAO Regional', expired: '2024-06-15', status: 'Expired' },
                ],
                outstanding: [
                    { code: 'ETOPS-01', fcnName: 'ETOPS CERTIFICATION', type: 'Mandatory', lastDueDate: '2024-01-30' }
                ]
            },
            nonMandatory: [
                { course: 'Advanced CRM', provider: 'Emirates Academy', date: '2023-05-10', status: 'Completed' }
            ],
            ojt: [
                { id: 1, task: 'RAMP INSPECTION B787', supervisor: 'Sr. Insp. Budi', date: '2023-11-02', status: 'Completed' },
                { id: 2, task: 'SIMULATOR EVALUATION A320', supervisor: 'Capt. Sarah', date: '2023-12-10', status: 'Pending' },
            ],
            authorization: [
                { type: 'A320 SFI', number: 'DGCA-AUTH-2023-001', validUntil: '2026-12-31' }
            ]
        }
    },
    {
        id: 'INS-002',
        name: 'SITI AMINAH',
        role: 'MAINTENANCE INSPECTOR',
        domain: 'Airworthiness',
        group: 'Maintenance Org Surveillance',
        subdirectorate: 'Airworthiness',
        workingUnit: 'DKPPU',
        avatar: 'https://i.pravatar.cc/150?u=siti',
        stats: {
            formal: 78,
            ojt: 88
        },
        trainingLog: {
            mandatory: {
                current: [
                    { code: 'AIR-01', fcnName: 'PART 145 REGULATION', training: 'DGCA Center', expired: '2025-08-12', status: 'Valid' },
                ],
                outstanding: []
            },
            nonMandatory: [],
            ojt: [
                { id: 3, task: 'C-CHECK OVERSIGHT', supervisor: 'Ir. Agus', date: '2023-11-20', status: 'Completed' },
            ],
            authorization: [
                { type: 'PART 145 AUDITOR', number: 'DGCA-AUTH-2023-055', validUntil: '2025-01-01' }
            ]
        }
    },
    {
        id: 'INS-003',
        name: 'BUDI SANTOSO',
        role: 'AVIONICS SPECIALIST',
        domain: 'Airworthiness',
        group: 'Technical Standard',
        subdirectorate: 'Engineering',
        workingUnit: 'DKPPU',
        avatar: 'https://i.pravatar.cc/150?u=budi',
        stats: {
            formal: 90,
            ojt: 95
        },
        trainingLog: {
            mandatory: {
                current: [
                    { code: 'AV-04', fcnName: 'NEXT-GEN AVIONICS', training: 'Airbus Training', expired: '2026-09-05', status: 'Valid' },
                ],
                outstanding: []
            },
            nonMandatory: [],
            ojt: [
                { id: 4, task: 'GLASS COCKPIT INTEGRATION', supervisor: 'Capt. Hendra', date: '2023-12-01', status: 'Completed' },
            ],
            authorization: [
                { type: 'AVIONICS LVL-III', number: 'DGCA-AUTH-2023-102', validUntil: '2027-05-15' }
            ]
        }
    }
];

export const subdirectorates = ['Operations', 'Airworthiness', 'Engineering', 'Security'];
export const domains = ['Airworthiness', 'Personnel Licensing', 'Flight Operations'];
