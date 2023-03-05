import { useTranslation } from "react-i18next";
import { ConversationAppBar } from "../../../../components/layout";

export default function GeneralSettingsRoute() {
  const { t } = useTranslation("settings");
  return (
    <>
      <ConversationAppBar title={t("general.title")} />
      {t("general.placeholder")}
    </>
  );
}
