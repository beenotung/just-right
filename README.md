# Just Right - Self-Hosted Privacy Preserving DNS Server

Inspired from NextDNS and Privacy Badger.

## Background
Modern internet services, no matter delivered as website or mobile app, often practice behaviour tracking on their users.
Even worse, most of them utilize 3rd party trackers, which can aggregate the user behaviour on the internet across multiple web services, without user consent.
This cause privacy issue on the users.

## Existing Works

[**NextDNS**](https://nextdns.io/) is a DNS-over-HTTPS service which act as a DNS proxy server but it rejects DNS requests on domains that are known to do (3rd party) tracking (and ads). Users can customize the whitelist and blacklist.
Unlike most ad blocker, NextDNS work at the network level, hence it also works for traffics in the mobile apps.

[**Pi-hole**](https://pi-hole.net/) is a open-sourced DNS server sharing similar functionality of NextDNS.

[**NoScript**](https://noscript.net/) is a browser add-on that blocks javascripts on all pages. It employs whitelist based preemptive script blocking approach. User can customize the default behaviour for scripts from unknown domain, and add domains to the whitelist and blocklist.
Unfortunately, it does not distinct whevether the scripts are loaded from the origin server or 3rd party servers. Also, as a browser add-on, it doesn't work for traffics in the mobile apps.  

[**Privacy Badger**](https://privacybadger.org/) is a browser add-on that automatically identify and block scripts from 3rd party trackers and advertisers based on the domain of the current website and the scripts.
Unfortunately, as a browser add-on, it also doesn't work for traffics in the mobile apps.

## Why re-invent the wheel

I've tried NextDNS, it works quite well, however it cannot be self-hosted;
I also tried PI-Hole but the UX on admin panel is not as good.

Then, I checkout how to develop a DNS server. Turn out it's not as hard as it may sounds. So I'm working on this project in weekend-hacking manner.
