import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  Collapse,
  Fade,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  darken,
  lighten,
  useTheme,
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
  const [isLoading, setIsLoading] = useState(false);
  const handleDmTargetSelect = (event: SyntheticEvent, target: User | null) => {
    if (target) {
      setIsLoading(true);
      backend.openDM(target.id).finally(() => {
        setIsLoading(false);
      });
      setAutocompleteInputValue("");
    }
  };
  const [autocompleteOpen, setAutoCompleteOpen] = useState(false);
  const theme = useTheme();
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
            value={null}
            onChange={handleDmTargetSelect}
            renderInput={(props) => (
              <InputBase
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props.InputProps}
                fullWidth={props.fullWidth}
                inputProps={props.inputProps}
                sx={{
                  borderRadius: 7,
                  borderBottomLeftRadius: autocompleteOpen ? 0 : undefined,
                  borderBottomRightRadius: autocompleteOpen ? 0 : undefined,
                  height: 56,
                  paddingLeft: 2,
                  paddingRight: "16px !important",
                  background:
                    theme.palette.mode === "dark"
                      ? darken(theme.palette.primary.main, 0.8)
                      : lighten(theme.palette.primary.main, 0.9),
                }}
                startAdornment={
                  <Collapse
                    in={!autocompleteOpen}
                    orientation="horizontal"
                    sx={{ height: 24 }}
                  >
                    <MaterialSymbolIcon
                      icon="search"
                      size={24}
                      sx={{ color: theme.palette.onSurfaceVariant.main, mr: 2 }}
                    />
                  </Collapse>
                }
                endAdornment={
                  options[0] !== autocompleteInputValue || isLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ ml: 2 }}
                    />
                  ) : null
                }
                placeholder="Find or create a DM"
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
            componentsProps={{
              paper: {
                sx: {
                  borderTop: `1px solid ${theme.palette.divider}`,
                  borderRadius: "0 0 28px 28px",
                },
              },
            }}
            filterOptions={(x) => x}
            onInputChange={(_e, newInputValue, reason) => {
              if (reason !== "reset") setAutocompleteInputValue(newInputValue);
            }}
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
