import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  Fade,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatches, useOutlet } from "react-router-dom";
import { SwitchTransition } from "react-transition-group";
import { useDebounce } from "use-debounce";
import User from "../../../../model/user";
import MaterialSymbolIcon from "../../../components/MaterialSymbolIcon";
import ProfilePicture from "../../../components/ProfilePicture";
import { searchCache } from "../../../components/chat/PeopleMenu";
import { ConversationNavigationDrawer } from "../../../components/layout";
import ChannelList from "../../../components/main/ChannelList";
import DrawerHeader from "../../../components/main/DrawerHeader";
import useSnackbar from "../../../components/useSnackbar";
import useBackend from "../../../hooks/useBackend";
import useDMs from "../../../hooks/useDMs";
import useUser from "../../../hooks/useUser";

export default function DmListRoute() {
  const match = useMatches()[2];
  const currentOutlet = useOutlet();
  const { t } = useTranslation("channel");

  const [autocompleteInputValue, setAutocompleteInputValue] = useState("");
  const [options, setOptions] = useState<[string, User[]]>(["", []]);
  const [debouncedAutocompleteInputValue, { flush: flushInputValue }] =
    useDebounce(autocompleteInputValue, 1500);
  const backend = useBackend();
  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    if (Object.hasOwn(searchCache, debouncedAutocompleteInputValue)) {
      setOptions([
        debouncedAutocompleteInputValue,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        searchCache[debouncedAutocompleteInputValue]!,
      ]);
    } else if (debouncedAutocompleteInputValue !== "") {
      backend
        .searchUsers(debouncedAutocompleteInputValue)
        .then((users) => {
          searchCache[debouncedAutocompleteInputValue] = users;
          setOptions([debouncedAutocompleteInputValue, users]);
        })
        .catch(() => {
          showSnackbar(t("people.autocompleteError", { namespace: "channel" }));
        });
    } else {
      // Input is blank
      setOptions(["", []]);
    }
  }, [debouncedAutocompleteInputValue, backend, showSnackbar, t]);
  useEffect(() => {
    if (
      autocompleteInputValue === "" ||
      Object.hasOwn(searchCache, autocompleteInputValue)
    ) {
      flushInputValue();
    }
  }, [autocompleteInputValue, flushInputValue]);
  const dms = useDMs();
  const user = useUser();
  const handleDmTargetSelect = (event: SyntheticEvent, target: User | null) => {
    if (target) {
      console.log(target);
      event.preventDefault();
      setAutocompleteInputValue("");
    }
  };
  const [autocompleteOpen, setAutoCompleteOpen] = useState(false);
  return (
    <ConversationNavigationDrawer
      drawerHeader={<DrawerHeader user={user} />}
      drawerItems={
        <>
          <Autocomplete
            sx={{
              mx: 1,
            }}
            options={options[1]}
            inputValue={autocompleteInputValue}
            onChange={handleDmTargetSelect}
            renderInput={(props) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                variant="filled"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    borderRadius: 3,
                    borderBottomLeftRadius: autocompleteOpen ? 0 : undefined,
                    borderBottomRightRadius: autocompleteOpen ? 0 : undefined,
                  },
                  ...props.InputProps,
                }}
                label="Find or create a DM"
                placeholder={t("people.searchUsers", { namespace: "channel" })}
              />
            )}
            open={autocompleteOpen}
            onOpen={() => setAutoCompleteOpen(true)}
            onClose={() => setAutoCompleteOpen(false)}
            noOptionsText={
              // eslint-disable-next-line no-nested-ternary
              autocompleteInputValue === "" ? (
                t("people.searchUsers", { namespace: "channel" })
              ) : options[0] !== autocompleteInputValue ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                t("people.noUsersFound", { namespace: "channel" })
              )
            }
            filterOptions={(x) => x}
            onInputChange={(_e, newInputValue, reason) => {
              if (reason !== "reset") setAutocompleteInputValue(newInputValue);
            }}
            popupIcon={null}
            getOptionLabel={(option) => option.name}
            renderOption={(props, targetOption, state) => (
              <ListItem
                disablePadding
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                sx={{
                  opacity:
                    debouncedAutocompleteInputValue !== autocompleteInputValue
                      ? 0.6
                      : 1,
                }}
              >
                <ListItemAvatar>
                  {state.selected ? (
                    <Avatar>
                      <MaterialSymbolIcon icon="check_circle" />
                    </Avatar>
                  ) : (
                    <ProfilePicture user={targetOption} />
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={targetOption.name}
                  secondary={targetOption.nickname}
                />
              </ListItem>
            )}
          />
          <List sx={{ mx: 1 }}>
            <ChannelList channels={dms} />
          </List>
        </>
      }
    >
      <SwitchTransition>
        <Fade key={match?.pathname} timeout={200} unmountOnExit>
          <Box>{currentOutlet}</Box>
        </Fade>
      </SwitchTransition>
    </ConversationNavigationDrawer>
  );
}
