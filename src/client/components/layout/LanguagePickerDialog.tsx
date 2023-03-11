import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import translations from "../../../translations.json";

const LANGUAGE_COUNTRY_MAPPING: Record<string, string> = {
  "en-US": "US",
  "en-GB": "GB",
  ja: "JP",
  ko: "KR",
  "zh-Hans": "CN",
  "zh-Hant": "TW",
};

export interface LanguagePickerDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
}

interface LanguageInfo {
  code: string;
  currentLocaleName: string;
  localizedName: string;
}

export default function LanguagePickerDialog({
  onClose,
  open,
}: LanguagePickerDialogProps) {
  const { i18n, t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  const languageInfos: LanguageInfo[] = useMemo(() => {
    const currentLanguage = new Intl.DisplayNames([i18n.language], {
      type: "language",
    });
    return Object.keys(translations).map((language) => {
      const localizedLanguage = new Intl.DisplayNames([language], {
        type: "language",
      });
      return {
        code: language,
        currentLocaleName: currentLanguage.of(language) ?? "",
        localizedName: localizedLanguage.of(language) ?? "",
      };
    });
  }, [i18n.language]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { minWidth: "300px" } }}
    >
      <DialogTitle>{t("languageSelect")}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {languageInfos.map((language) => (
          <ListItem disableGutters>
            <ListItemButton
              onClick={() => handleListItemClick(language.code)}
              key={language.code}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ bgcolor: "primary.main" }}
                  src={
                    language.code in LANGUAGE_COUNTRY_MAPPING
                      ? `//cdn.jsdelivr.net/npm/country-flag-icons/1x1/${
                          LANGUAGE_COUNTRY_MAPPING[language.code]
                        }.${"svg"}`
                      : undefined
                  }
                />
              </ListItemAvatar>
              <ListItemText
                primary={language.localizedName}
                secondary={language.currentLocaleName}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
