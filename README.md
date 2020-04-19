# Project Manager CLI (pm-cli)

Spotlight-like launcher for some of common daily actions of a Project Manager. Built using Electron and VanillaJS.

![pm-cli demo](demo.gif)

## Download

[here](https://github.com/anteq/pm-cli/releases/latest)

## Usage

Press *⌃ + ⌘ + Space* to open GUI.

Create new JIRA issue: `{project} (new|create|add) {assignee?} {type?} {priority?} "{summary?}"`
e.g. `sp new impr antek` or `sp create blocker bug "something is off"`.

Browse JIRA issue: `{project}-{code}`
e.g. `sp-220`

Open JIRA backlog: `{project} backlog`
e.g. `sp backlog`

Open custom URL: `{custom}`
e.g. `jenkins` or `google`

## Configuration 

See schema.json for description of required/optional fields.

## Development

```bash
git clone https://github.com/anteq/pm-cli
cd pm-cli
npm install
npm start
# Build
npm run dist
```

## Todo

- [x] move basic functionality from BTT to electron
- [x] move basic CSS
- [x] refactor actions
- [ ] clean CSS
- [ ] add live search in Safari history
- [x] add descriptions
- [x] format description
- [x] add icons
- [x] settings support with yaml file 
- [ ] GitHub support
- [x] custom URLs config
- [x] dark mode support

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
