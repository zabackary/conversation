import { Chip, List, MenuItem, Select } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConversationAppBar } from "../../../../components/layout";
import { BaseItem } from "../../../../components/settings";

import LanguagePickerDialog from "../../../../components/layout/LanguagePickerDialog";
import MaterialSymbolIcon from "../../../../components/MaterialSymbolIcon";

export default function GeneralSettingsRoute() {
  const { t, i18n } = useTranslation("settings");
  const currentLanguage =
    useMemo(
      () =>
        new Intl.DisplayNames([i18n.language], {
          type: "language",
        }).of(i18n.language),
      [i18n.language]
    ) ?? "";
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const handleClickOpen = () => {
    setLanguagePickerOpen(true);
  };
  const handleClose = (value?: string) => {
    setLanguagePickerOpen(false);
    if (value) void i18n.changeLanguage(value);
  };

  return (
    <>
      <ConversationAppBar title={t("general.title")} />
      <List>
        <BaseItem
          label={t("general.language.label")}
          description={t("general.language.description")}
          control={
            <Select value={i18n.language} onOpen={handleClickOpen} open={false}>
              <MenuItem value={i18n.language}>{currentLanguage}</MenuItem>
            </Select>
          }
        >
          <Chip
            icon={<MaterialSymbolIcon icon="restart_alt" size={18} />}
            label={t("reset")}
            onClick={() => {
              void i18n.changeLanguage("en-US");
            }}
            variant="outlined"
          />
        </BaseItem>
      </List>
      <LanguagePickerDialog open={languagePickerOpen} onClose={handleClose} />
    </>
  );
}
