import { describe, expect, it } from "@jest/globals";
import { Value } from "@sinclair/typebox/value";
import { Logs } from "@ubiquity-os/ubiquity-os-logger";
import { DataPurgeModule } from "../src/parser/data-purge-module";
import { ContextPlugin, pluginSettingsSchema } from "../src/types/plugin-input";

describe("DataPurgeModule multiline slash command removal (#242)", () => {
  const config = Value.Default(pluginSettingsSchema, {
    incentives: {
      dataPurge: {},
    },
  });
  const module = new DataPurgeModule({
    config,
    logger: new Logs("debug"),
  } as unknown as ContextPlugin);

  it("removes single-line slash commands completely", () => {
    expect(module["_cleanCommentBody"]("/start")).toBe("");
  });

  it("removes multiline slash commands (e.g. /ask across multiple lines) completely", () => {
    const multilineCommand = "/ask Can you explain how the scoring works?\nAlso check why my second line was evaluated.\nThanks!";
    expect(module["_cleanCommentBody"](multilineCommand)).toBe("");
  });

  it("preserves normal comments preceding a trailing slash command", () => {
    const commentWithTrailingCommand = "Here is my analysis of the issue.\n/ask follow up question\nspanning two lines";
    expect(module["_cleanCommentBody"](commentWithTrailingCommand)).toBe("Here is my analysis of the issue.");
  });
});
