const { remote, shell } = require('electron');

function buildAddUrl(projectId, val) {

  var props = [];

  const descRegex = /\"(.*)\"/gim;
  var values, desc;
  const match = val.match(descRegex);
  if (match) {
      const index = val.indexOf(match);
      values = val.slice(0, index);
      desc = match;
  } else {
      values = val.toLowerCase().split(" ");
  }
  
  
  props.push("pid=" + projectId);
  props.push("reporter=5a299213301ed0381f22a9a1");

  if (values.includes("bug")) {
      props.push("issuetype=1");
  } else if (values.includes("feature")){
      props.push("issuetype=2");
  } else if (values.includes("task")){
      props.push("issuetype=3");
  } else if (values.includes("impr") || values.includes("improvement")){
      props.push("issuetype=4");
  } else {
      props.push("issuetype=3");
  }
  
  if (values.includes("blocker")) {
      props.push("priority=1");
  } else if (values.includes("critical")){
      props.push("priority=2");
  } else if (values.includes("minor")){
      props.push("priority=4");
  } else {
      props.push("priority=3");
  }

  if (values.includes("anna") || values.includes("ania")) {
      props.push("assignee=5d92f3a91d47a50c34d4c073");
  } else if (values.includes("antek")) {
      props.push("assignee=5a299213301ed0381f22a9a1");
  } else if (values.includes("bartek")) {
      props.push("assignee=557058:512b8678-e90f-43b9-a143-ee74268ae31a");
  } else if (values.includes("kacper")) {
      props.push("assignee=5bfbd8d2c22785142f67d695");
  } else if (values.includes("konrad")) {
      props.push("assignee=5da4173b5f18bb0c40fec013");
  } else if (values.includes("krzysiek") || values.includes("krz")) {
      props.push("assignee=5c53f2c261740840d4e6cc8f");
  } else if (values.includes("matt")) {
      props.push("assignee=5bfbd8e2a391f63e5a27de05");
  } else if (values.includes("marnik") || values.includes("pm")) {
      props.push("assignee=5bfbd8eddda509509754a751");
  } else if (values.includes("mlody") || values.includes("młody") || values.includes("pr")) {
      props.push("assignee=5bfbd8e85e2eee35d79f573e");
  } else if (values.includes("pw") || values.includes("wos") || values.includes("woś")) {
      props.push("assignee=5c8768de677d763daafa494b");
  } else if (values.includes("tom") || values.includes("tomek") || values.includes("tomasz")) {
      props.push("assignee=5c53f2c00e5b0669d85a3967");
  } else if (values.includes("wojtek") || values.includes("woj")) {
      props.push("assignee=5da4173a260e4d0c422332f9");
  }

  if (desc) {
      props.push("summary=" + desc);
  }

  return "secure/CreateIssueDetails!init.jspa?" + props.join("&");
}

function parseInput(val) {
  url = "https:\/\/scalaric.atlassian.net\/";
  const issueRegex = /[pt|tm]{2}-[0-9]*/gmi;
  const ptNewRegex = /pt new .*/gmi;
  const tmNewRegex = /tm new .*/gmi;
  const ptAddRegex = /pt add .*/gmi;
  const tmAddRegex = /tm add .*/gmi;
  const ptSearchRegex = /pt .*/gmi;
  const tmSearchRegex = /tm .*/gmi;
  const ptBacklogRegex = /pt backlog.*/gmi;
  const tmBacklogRegex = /tm backlog.*/gmi;
  if (issueRegex.test(val)) {
      url += "browse\/" + val;
  } else if (ptAddRegex.test(val) || ptNewRegex.test(val)) {
      url += buildAddUrl(10500, val.slice(7));
  } else if (tmAddRegex.test(val) || tmNewRegex.test(val)) {
      url += buildAddUrl(10200, val.slice(7));
  } else if (ptBacklogRegex.test(val)) {
      url += "secure/RapidBoard.jspa?rapidView=15&projectKey=PT&view=planning";
  } else if (tmBacklogRegex.test(val)) {
      url += "secure/RapidBoard.jspa?rapidView=8&projectKey=TM&view=planning";
  } else if (ptSearchRegex.test(val)) {
      url += "issues/?jql=project%20=%20%22PT%22%20and%20text%20~%20%22" + escape(val.slice(3)) + "%22" + escape(" ORDER BY created DESC");
  } else if (tmSearchRegex.test(val)) {
      url += "issues/?jql=project%20=%20%22TM%22%20and%20text%20~%20%22" + escape(val.slice(3)) + "%22" + escape(" ORDER BY created DESC");
  } else {
      url += "issues/?jql=text%20~%20%22" + escape(val) + "%22" + escape(" ORDER BY created DESC");
  }
  return url;
}


function main() {
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('spotlight-input').focus();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const url = parseInput(document.getElementById('spotlight-input').value)
      shell.openExternal(url, { activate: true });
    }
    if (e.keyCode == '27') {
      remote.getCurrentWindow().close();
    }
  });
}

main();