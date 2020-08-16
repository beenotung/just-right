import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await down(knex);
  await knex.schema.createTable("query", table => {
    // the primary key
    table.increments("id").primary();
    // the domain name being resolved
    table.string("domain").nullable();
    // optional client IP
    table.string("client").nullable();
    // null if allowed
    // string if not allowed: (imported) blocklist / (custom) blacklist
    table.string('blocked_by').nullable()
    table.timestamp("timestamp").notNullable().defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('setting',table=>{
    table.increments('id').primary()
    table.boolean('enable_logs').nullable()
    table.boolean('log_client_ip').nullable()
    table.boolean('log_domain').nullable()
    table.bigInteger('retention_ms').nullable()
    table.timestamps(false,true)
  })
  await knex.schema.createTable('rule',table=>{
    table.increments('id').primary()
    table.string('domain').notNullable()
    table.boolean('block').notNullable()
    table.timestamps(false,true)
  })
  await knex.schema.createTable('blocklist',table=>{
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('url').notNullable()
    table.boolean('block').notNullable()
    table.timestamps(false,true)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('blocklist')
  await knex.schema.dropTableIfExists('rule')
  await knex.schema.dropTableIfExists('setting')
  await knex.schema.dropTableIfExists("query");
}

