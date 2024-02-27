/**
 * @description Demo Contacts for the user
 */
let demoContacts = [
    { id: generateId(), avatarid: rollDice(), name: 'Anton Mayer', email: 'antom@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM"},
    { id: generateId(), avatarid: rollDice(), name: 'Anja Schulz', email: 'schulz@hotmail.com', phone: '+49123456789', imagePath:"http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS"},
    { id: generateId(), avatarid: rollDice(), name: 'Benedikt Ziegler', email: 'benedikt@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ"},
    { id: generateId(), avatarid: rollDice(), name: 'David Eisenberg', email: 'davidberg@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "DE",},
    { id: generateId(), avatarid: rollDice(), name: 'Eva Fischer', email: 'eva@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "EF"},
    { id: generateId(), avatarid: rollDice(), name: 'Emmanuel Mauer', email: 'emmanuelma@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "EM"},
    { id: generateId(), avatarid: rollDice(), name: 'Marcel Bauer', email: 'bauer@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "MB"},
    { id: generateId(), avatarid: rollDice(), name: 'Tatjana Wolf', email: 'wolf@gmail.com', phone: '+49123456789', imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "TW"},
];

/** generate the demo contacts for a user when you sign up
 * 
 * @returns demo contacts in a json
 */

function generateDemoTasks() {
    return [
        {
            content: {
                title: 'Kochwelt Page & Recipe Recommender',
                description: 'Build start page with recipe recommendation...',
                date: '2024-12-31',
                category: 'User Story',
                subtasks: 2,
                subtasksData: [
                    { description: 'Implement Recipe Recommendation', checked: true },
                    { description: 'Start Page Layout', checked: false }
                ],
                selectedContacts: [
                    { id: demoContacts[0].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM", name: "Anton Mayer"  },
                    { id: demoContacts[5].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "EM", name: "Emmanuel Mauer"},
                    { id: demoContacts[6].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "MB", name: "Marcel Bauer" }
                ],
                priority: 'medium',
                boardColumn: 'progress-column',
            },
            id: 'task0',
        },
        {
            content: {
                title: 'HTML Base Template Creation',
                description: 'Create reusable HTML base templates...',
                date: '2024-12-31',
                category: 'Technical task',
                subtasks: 0,
                subtasksData: [],
                selectedContacts: [
                    { id: demoContacts[3].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-1.svg", initials: "DE", name: "David Eisenberg" },
                    { id: demoContacts[2].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ", name: "Benedikt Ziegler" },
                    { id: demoContacts[1].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS", name: "Anja Schulz" }
                ],
                priority: 'low',
                boardColumn: 'await-column',
            },
            id: 'task1',
        },
        {
            content: {
                title: 'Daily Kochwelt Recipe',
                description: 'Implement daily recipe and portion calculator....',
                date: '2024-08-05',
                category: 'User Story',
                subtasks: 0,
                subtasksData: [],
                selectedContacts: [
                    { id: demoContacts[4].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "EF", name: "Eva Fischer" },
                    { id: demoContacts[1].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-3.svg", initials: "AS", name: "Anja Schulz" },
                    { id: demoContacts[7].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-2.svg", initials: "TW", name: "Tatjana Wolf" }
                ],
                priority: 'medium',
                boardColumn: 'await-column',
            },
            id: 'task2',
        },
        {
            content: {
                title: 'CSS Architecture Planning',
                description: 'Define CSS naming conventions and structure...',
                date: '2024-12-31',
                category: 'Technical task',
                subtasks: 2,
                subtasksData: [
                    { description: 'Establish CSS Methodology', checked: true },
                    { description: 'Setup Base Styles', checked: true }
                ],
                selectedContacts: [
                    { id: demoContacts[0].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-0.svg", initials: "AM", name: "Anton Mayer" },
                    { id: demoContacts[2].id, imagePath: "http://127.0.0.1:5501/img/Ellipse5-4.svg", initials: "BZ", name: "Benedikt Ziegler" }
                ],
                priority: 'urgent',
                boardColumn: 'done-column',
            },
            id: 'task3',
        },
    ]
}
