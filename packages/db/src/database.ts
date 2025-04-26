import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { PgClient } from "@effect/sql-pg";
import { Cause, Config, Console, Layer } from "effect";

const PgLive = PgClient.layerConfig({
  url: Config.redacted("POSTGRES_URL"),
  ssl: Config.succeed(true),
}).pipe(Layer.tapErrorCause((cause) => Console.log(Cause.pretty(cause))));

const DrizzleLive = PgDrizzle.layer.pipe(Layer.provide(PgLive));

export const DatabaseLive = Layer.mergeAll(PgLive, DrizzleLive);
