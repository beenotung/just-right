document.body.style.outline = "blue solid 5px";

function main() {
  forEach(document.scripts, scanElement);
  forEach(document.querySelectorAll("iframe"), scanElement);
  forEach(document.querySelectorAll("div"), (e) => {
    if (e.id.startsWith("ad_footerbanner")) {
      e.remove();
    }
  });
}

function scanElement(e) {
  if (!e.src) {
    return;
  }
  let url = new URL(e.src);
  let names = url.hostname.split(".");
  if (
    shouldSkipHostname(url.hostname) ||
    shouldSkipPathname(url.pathname) ||
    names.some((s) => s.startsWith("ad"))
  ) {
    console.log("remove", e.src);
    e.remove();
    return;
  }
  if (
    location.hostname == url.hostname ||
    domainName(location.hostname) == domainName(url.hostname)
  ) {
    return;
  }
  console.log("?", url);
}

let pathnameSkipList = toLines(`
advertisement
`);

function shouldSkipPathname(pathname) {
  return pathnameSkipList.some((s) => pathname.includes(s));
}

let hostnameSkipList = `
googletagmanager
google-analytics
s.yimg.com
`;
function shouldSkipHostname(hostname) {
  return (
    hostnameSkipList.includes(hostname) ||
    hostname.split(".").some((s) => hostnameSkipList.includes(s))
  );
}

function domainName(hostname) {
  let names = hostname.split(".");
  let acc = [];
  acc.push(names.pop());
  acc.push(names.pop());
  return acc.reverse().join(".");
}

function forEach(list, fn) {
  for (let i = list.length - 1; i >= 0; i--) {
    fn(list.item(i));
  }
}
function toLines(string) {
  return string
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s);
}

main();
