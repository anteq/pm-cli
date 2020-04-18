module.exports = {
    reporter: 'antek',
    defaults: {
        issueType: 'bug',
        priority: 'major'
    },
    projects: [
        {
            key: 'pt',
            name: 'Tagger Product',
            jiraId: 10500,
            jiraRapidViewId: 15,
            baseUrl: 'https://scalaric.atlassian.net'
        },
        {
            key: 'tm',
            name: 'Tagger',
            jiraId: 10200,
            jiraRapidViewId: 8,
            baseUrl: 'https://scalaric.atlassian.net'
        }
    ],
    people: [
        {
            key: 'ania',
            name: 'Ania Oruba',
            nicknames: ['anna'],
            jiraId: '5d92f3a91d47a50c34d4c073'
        },
        {
            key: 'antek',
            name: 'Antek Grzanka',
            jiraId: '5a299213301ed0381f22a9a1'
        },
        {
            key: 'bartek',
            name: 'Bartek Radziszewski',
            jiraId: '557058:512b8678-e90f-43b9-a143-ee74268ae31a'
        },
        {
            key: 'kacper',
            name: 'Kacper Bieda',
            jiraId: '5bfbd8d2c22785142f67d695'
        },
        {
            key: 'konrad',
            name: 'Konrad Dzikowski',
            jiraId: '5da4173b5f18bb0c40fec013'
        },
        {
            key: 'krzysiek',
            name: 'Krzysztof Kardaś',
            triggers: ['krz', 'krzysztof'],
            jiraId: '5c53f2c261740840d4e6cc8f'
        },
        {
            key: 'matt',
            name: 'Matt Ginn',
            jiraId: '5bfbd8e2a391f63e5a27de05'
        },
        {
            key: 'marnik',
            name: 'Piotr Marnik',
            triggers: ['pm'],
            jiraId: '5bfbd8eddda509509754a751'
        },
        {
            key: 'mlody',
            name: 'Piotr Radziszewski',
            triggers: ['młody', 'pr'],
            jiraId: '5bfbd8e85e2eee35d79f573e'
        },
        {
            key: 'wos',
            name: 'Piotr Woś',
            triggers: ['pw', 'woś'],
            jiraId: '5c8768de677d763daafa494b'
        },
        {
            key: 'tomek',
            name: 'Tomasz Bogusiak',
            triggers: ['tom', 'tomasz'],
            jiraId: '5c53f2c00e5b0669d85a3967'
        },
        {
            key: 'wojtek',
            name: 'Wojciech Janoszek',
            triggers: ['woj', 'wojciech'],
            jiraId: '5da4173a260e4d0c422332f9'
        }
    ]
};