import type { Promisable } from "type-fest";
import { patchPlaintext } from "../modules/webpack/plaintext-patch";

import { default as experimentsPlaintext } from "../coremods/experiments/plaintextPatches";
import { default as notrackPlaintext } from "../coremods/notrack/plaintextPatches";
import { default as noDevtoolsWarningPlaintext } from "../coremods/noDevtoolsWarning/plaintextPatches";
import { default as messagePopover } from "../coremods/messagePopover/plaintextPatches";
import { default as notices } from "../coremods/notices/plaintextPatches";
import { default as contextMenu } from "../coremods/contextMenu/plaintextPatches";
import { default as languagePlaintext } from "../coremods/language/plaintextPatches";
import { default as settingsPlaintext } from "../coremods/settings/plaintextPatches";
import { default as badgesPlaintext } from "../coremods/badges/plaintextPatches";
import { default as titlebarPlaintext } from "../coremods/titlebar/plaintextPatches";
import { Logger } from "@logger";

const logger = Logger.api("Coremods");

interface Coremod {
  start?: () => Promisable<void>;
  stop?: () => Promisable<void>;
  [x: string]: unknown; // Allow coremods to export anything else they want
}

export namespace coremods {
  export let noDevtoolsWarning: Coremod;
  export let settings: Coremod;
  export let badges: Coremod;
  export let installer: Coremod;
  export let messagePopover: Coremod;
  export let notices: Coremod;
  export let contextMenu: Coremod;
  export let language: Coremod;
  export let rpc: Coremod;
  export let watcher: Coremod;
  export let commands: Coremod;
  export let welcome: Coremod;
}

export async function start(name: keyof typeof coremods): Promise<void> {
  if (!(name in coremods)) throw new Error(`Coremod ${name} does not exist`);
  await coremods[name].start?.();
}

export async function stop(name: keyof typeof coremods): Promise<void> {
  if (!(name in coremods)) throw new Error(`Coremod ${name} does not exist`);
  await coremods[name].stop?.();
}

export async function startAll(): Promise<void> {
  const startTime = performance.now();
  logger.log(`Starting coremods...`);
  coremods.noDevtoolsWarning = await import("../coremods/noDevtoolsWarning");
  coremods.settings = await import("../coremods/settings");
  coremods.badges = await import("../coremods/badges");
  coremods.installer = await import("../coremods/installer");
  coremods.messagePopover = await import("../coremods/messagePopover");
  coremods.notices = await import("../coremods/notices");
  coremods.contextMenu = await import("../coremods/contextMenu");
  coremods.language = await import("../coremods/language");
  coremods.rpc = await import("../coremods/rpc");
  coremods.watcher = await import("../coremods/watcher");
  coremods.commands = await import("../coremods/commands");
  coremods.welcome = await import("../coremods/welcome");

  await Promise.all(
    Object.entries(coremods).map(async ([name, mod]) => {
      const startTime = performance.now();
      try {
        await mod.start?.();
        logger.log(`Coremod started: ${name} in ${(performance.now() - startTime).toFixed(2)}ms`);
      } catch (e) {
        logger.error(
          `Failed to start coremod ${name}  after ${(performance.now() - startTime).toFixed(2)}ms`,
          e,
        );
      }
    }),
  );
  logger.log(`All coremods started in ${(performance.now() - startTime).toFixed(2)}ms`);
}

export async function stopAll(): Promise<void> {
  await Promise.allSettled(Object.values(coremods).map((c) => c.stop?.()));
}

export function runPlaintextPatches(): void {
  [
    { patch: experimentsPlaintext, name: "replugged.coremod.experiments" },
    { patch: notrackPlaintext, name: "replugged.coremod.noTrack" },
    { patch: noDevtoolsWarningPlaintext, name: "replugged.coremod.noDevtoolsWarning" },
    { patch: messagePopover, name: "replugged.coremod.messagePopover" },
    { patch: notices, name: "replugged.coremod.notices" },
    { patch: contextMenu, name: "replugged.coremod.contextMenu" },
    { patch: languagePlaintext, name: "replugged.coremod.language" },
    { patch: settingsPlaintext, name: "replugged.coremod.settings" },
    { patch: badgesPlaintext, name: "replugged.coremod.badges" },
    { patch: titlebarPlaintext, name: "replugged.coremod.titlebar" },
  ].forEach(({ patch, name }) => patchPlaintext(patch, name));
}
