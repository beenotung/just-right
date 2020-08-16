import * as Knex from "knex";
import { BlockList, Setting } from "../src/types";
import { DAY } from "@beenotung/tslib/time";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("setting").del();
  await knex("blocklist").del();

  let list: [string, string[]][] = [
    ["goodbye-ads", [
      "https://raw.githubusercontent.com/jerryn70/GoodbyeAds/master/Hosts/GoodbyeAds.txt"]],
    ["notracking", [
      "https://raw.githubusercontent.com/notracking/hosts-blocklists/master/hostnames.txt"]],
    ["nextdns-recommended", [
      "https://raw.githubusercontent.com/nextdns/metadata/master/privacy/blocklists/nextdns-recommended.json"]],
    ["adguard-dns-filter", [
      "https://github.com/justdomains/blocklists/blob/master/lists/adguarddns-justdomains.txt",
      "https://github.com/justdomains/blocklists/blob/master/lists/easylist-justdomains.txt",
      "https://github.com/justdomains/blocklists/blob/master/lists/easyprivacy-justdomains.txt"]],
    ["disconnect-tracking", [
      "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/entities.json",
      "https://github.com/disconnectme/disconnect-tracking-protection/blob/master/services.json"]]
  ];


  // Inserts seed entries
  let rows: Partial<BlockList>[] = [];
  list.forEach(([name, urls]) => urls.forEach(url => rows.push({ name, url, block: true })));
  await knex<BlockList>("blocklist").insert(rows);

  let setting: Setting = {
    enable_logs: true,
    log_client_ip: true,
    log_domain: true,
    retention_ms: 30 * DAY
  };
  await knex("setting").insert(setting);
};
