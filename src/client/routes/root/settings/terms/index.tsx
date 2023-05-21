import { useTranslation } from "react-i18next";
import { ConversationAppBar } from "../../../../components/layout";

import Document from "../../../../components/Document";
import { DocumentType } from "../../../../network/NetworkBackend";

export default function TermsSettingsRoute() {
  const { t } = useTranslation("settings");

  return (
    <>
      <ConversationAppBar title={t("terms.title")} />
      <Document documentType={DocumentType.TERMS_OF_SERVICE} />
    </>
  );
}
