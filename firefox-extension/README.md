# just-right Firefox Extension

To block 3rd party scripts and iFrame.

## Why
NoScript is great, but:
1. it impact the Firefox startup time
2. it is too extreme, scripts from the original site is usually useful and non-evil

## How it works
It check the domain name of each resources (script and iframe) and the current site.
If the resources is hosted on the same domain, it will be allowed.

## Remark
This extension is not completed.
To maximize the privacy performance, you're suggested to also use Privacy Badger.

## Installation
This extension is not published yet.
Follow the steps in the website to install it locally:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing

## Todo
- [ ] add UI of popup page
- [ ] add UI of options page
- [ ] use extension storage to store custom whitelist / blacklist
- [ ] use proxy API `onRequest` to block request to 3rd party server

## Reference
storage and proxy API:
https://github.com/mdn/webextensions-examples/tree/master/proxy-blocker