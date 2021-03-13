module.exports = {
    issueTypes: [
        {
            key: 'bug',
            name: 'Bug',
            jiraId: 1
        },
        {
            key: 'feature',
            name: 'New Feature',
            jiraId: 2
        },
        {
            key: 'task',
            name: 'Task',
            jiraId: 3
        },
        {
            key: 'improvement',
            name: 'Improvement',
            triggers: ['impr'],
            jiraId: 4
        }
    ],
    priorities: [
        {
            key: 'blocker',
            name: 'Blocker',
            jiraId: 1
        },
        {
            key: 'critical',
            name: 'Critical',
            jiraId: 2
        },
        {
            key: 'major',
            name: 'Major',
            jiraId: 3
        },
        {
            key: 'minor',
            name: 'Minor',
            jiraId: 4
        },
        {
            key: 'trivial',
            name: 'Trivial',
            jiraId: 5
        }
    ],
    resolutionCategories: {
        "TO_DO": "To Do",
        "IN_PROGRESS": "In Progress",
        "DONE": "Done"
    }
};
