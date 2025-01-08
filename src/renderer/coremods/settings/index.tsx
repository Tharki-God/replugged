import { i18n } from "@common";
import { Text } from "@components";
import { Injector } from "@replugged";
import { t } from "src/renderer/modules/i18n";
import { Divider, Header, Section, insertSections, settingsTools } from "./lib";
import { ConnectedQuickCSS, General, Plugins, Themes, Updater } from "./pages";

const { t: discordT, intl } = i18n;

const injector = new Injector();

export { insertSections };

export function VersionInfo(): React.ReactElement {
  return (
    <Text variant="text-xs/normal" color="text-muted" tag="span" style={{ textTransform: "none" }}>
      {intl.format(t.REPLUGGED_VERSION, { version: window.RepluggedNative.getVersion() })}
    </Text>
  );
}

export function start(): void {
  settingsTools.addAfter("Billing", [
    Divider(),
    Header("Replugged"),
    Section({
      name: "rp-general",
      label: () => intl.string(discordT.SETTINGS_GENERAL),
      elem: General,
      predicate: (query) => (query !== "" ? query.toLowerCase().includes("general") : true),
    }),
    Section({
      name: "rp-quickcss",
      label: () => intl.string(t.REPLUGGED_QUICKCSS),
      elem: ConnectedQuickCSS,
      predicate: (query) => (query !== "" ? query.toLowerCase().includes("quickcss") : true),
    }),
    Section({
      name: "rp-plugins",
      label: () => intl.string(t.REPLUGGED_PLUGINS),
      elem: Plugins,
      predicate: (query) => (query !== "" ? query.toLowerCase().includes("plugins") : true),
    }),
    Section({
      name: "rp-themes",
      label: () => intl.string(t.REPLUGGED_THEMES),
      elem: Themes,
      predicate: (query) => (query !== "" ? query.toLowerCase().includes("themes") : true),
    }),
    Section({
      name: "rp-updater",
      label: () => intl.string(t.REPLUGGED_UPDATES_UPDATER),
      elem: Updater,
      predicate: (query) => (query !== "" ? query.toLowerCase().includes("updater") : true),
    }),
  ]);
}

export function stop(): void {
  settingsTools.removeAfter("Billing");
  injector.uninjectAll();
}
