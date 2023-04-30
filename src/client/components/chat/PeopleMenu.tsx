import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  SxProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import User from "../../../model/user";
import Channel from "../../../model/channel";
import { SideSheetToolbar } from "./Chat";
import LoadingButton from "../LoadingButton";
import useBackend from "../../hooks/useBackend";
import useSnackbar from "../useSnackbar";
import UserTooltip from "../UserTooltip";
import ProfilePicture from "../ProfilePicture";

export interface PeopleMenuListItemProps {
  user: User;
}

export function PeopleMenuListItem({ user }: PeopleMenuListItemProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        "&:not(:hover, :focus-within) .MuiListItemSecondaryAction-root": {
          display: "none",
        },
      }}
      secondaryAction={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
    >
      <Tooltip title={<UserTooltip user={user} />} placement="left">
        <ListItemButton>
          <ListItemAvatar>
            <ProfilePicture user={user} />
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.nickname} />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
}

function renderAutocompleteTags(
  value: User[],
  getTagProps: AutocompleteRenderGetTagProps
) {
  return value.map((user, index) => (
    <Tooltip title={<UserTooltip user={user} />} key={user.id}>
      <Chip
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getTagProps({ index })}
        variant="outlined"
        avatar={<ProfilePicture user={user} />}
        label={user.nickname}
        sx={{ my: "6px !important" }}
      />
    </Tooltip>
  ));
}

export interface PeopleMenuProps {
  channel: Channel;
  sx?: SxProps;
  handleSidebarClose(): void;
}

const searchCache: Record<string, User[]> = {};

export default function PeopleMenu({
  channel,
  sx,
  handleSidebarClose,
}: PeopleMenuProps) {
  const [inviteValue, setInviteValue] = useState<User[]>([]);
  const handleInviteChange = (_event: SyntheticEvent, newValue: User[]) => {
    setInviteValue(newValue);
  };
  const [isInviting, setIsInviting] = useState(false);
  const { t } = useTranslation("channel");
  const [searchText, setSearchText] = useState("");
  const filteredMembers = useMemo(
    () =>
      channel.members.filter(
        (member) =>
          (member.email ?? "")
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (member.nickname ?? "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
      ),
    [searchText, channel.members]
  );
  const [autocompleteInputValue, setAutocompleteInputValue] = useState("");
  const [options, setOptions] = useState<[string, User[]]>(["", []]);
  const [debouncedAutocompleteInputValue, { flush: flushInputValue }] =
    useDebounce(autocompleteInputValue, 1500);
  const backend = useBackend();
  const { showSnackbar } = useSnackbar();
  const memberIds = useMemo(
    () => channel.members.map((member) => member.id),
    [channel.members]
  );
  useEffect(() => {
    if (Object.hasOwn(searchCache, debouncedAutocompleteInputValue)) {
      setOptions([
        debouncedAutocompleteInputValue,
        searchCache[debouncedAutocompleteInputValue].filter(
          (user) => !memberIds.includes(user.id)
        ),
      ]);
    } else if (debouncedAutocompleteInputValue !== "") {
      backend
        .searchUsers(debouncedAutocompleteInputValue)
        .then((users) => {
          searchCache[debouncedAutocompleteInputValue] = users;
          setOptions([
            debouncedAutocompleteInputValue,
            users.filter((user) => !memberIds.includes(user.id)),
          ]);
        })
        .catch(() => {
          showSnackbar(t("people.autocompleteError"));
        });
    } else {
      // Input is blank
      setOptions(["", []]);
    }
  }, [debouncedAutocompleteInputValue, backend, showSnackbar, memberIds, t]);
  useEffect(() => {
    if (
      autocompleteInputValue === "" ||
      Object.hasOwn(searchCache, autocompleteInputValue)
    ) {
      flushInputValue();
    }
  }, [autocompleteInputValue, flushInputValue]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [invitePending, setInvitePending] = useState(false);
  const handleSendInvite = () => {
    setInvitePending(true);
    backend
      .addMembers(
        channel.id,
        inviteValue.map((user) => user.id),
        inviteMessage
      )
      .then(() => {
        setInvitePending(false);
        setIsInviting(false);
        showSnackbar(t("people.inviteSuccess"));
      })
      .catch(() => {
        setInvitePending(false);
        showSnackbar(t("people.inviteFailed"));
      });
  };
  return (
    <>
      <SideSheetToolbar>
        <Collapse in={isInviting} orientation="horizontal">
          <IconButton
            sx={{ mr: 1 }}
            edge="start"
            onClick={() => setIsInviting(false)}
            disableRipple={!isInviting}
          >
            <ArrowBackIcon />
          </IconButton>
        </Collapse>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {!isInviting ? t("people.title") : t("people.add.action")}
        </Typography>
        <IconButton onClick={handleSidebarClose} edge="end">
          <CloseIcon />
        </IconButton>
      </SideSheetToolbar>
      <Stack sx={sx} spacing={isInviting ? 1 : 2}>
        <Collapse in={!isInviting}>
          <Stack spacing={2}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Box>
                {t("people.memberCount", { count: channel.members.length })}
              </Box>
              <AvatarGroup max={4}>
                {channel.members.map((member) => (
                  <Avatar
                    src={member.profilePicture}
                    alt={member.name}
                    key={member.id}
                  />
                ))}
              </AvatarGroup>
            </Stack>
            <ButtonGroup
              variant="outlined"
              sx={{ "& .MuiButtonGroup-grouped": { flexGrow: 1 } }}
            >
              <Button>{t("people.leave.action")}</Button>
              <Button onClick={() => setIsInviting(true)}>
                {t("people.add.action")}
              </Button>
            </ButtonGroup>
          </Stack>
        </Collapse>
        {isInviting ? (
          <Autocomplete
            multiple
            options={options[1]}
            value={inviteValue}
            onChange={handleInviteChange}
            renderInput={(props) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                variant="filled"
                label={t("people.addMembers")}
                placeholder={t("people.searchUsers")}
              />
            )}
            noOptionsText={
              // eslint-disable-next-line no-nested-ternary
              autocompleteInputValue === "" ? (
                t("people.invitePrompt")
              ) : options[0] !== autocompleteInputValue ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                t("people.noUsersFound")
              )
            }
            filterOptions={(x) => x}
            onInputChange={(_e, newInputValue) =>
              setAutocompleteInputValue(newInputValue)
            }
            renderOption={(props, user, state) => (
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
                      <CheckIcon />
                    </Avatar>
                  ) : (
                    <ProfilePicture user={user} />
                  )}
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.nickname} />
              </ListItem>
            )}
            renderTags={renderAutocompleteTags}
            disableCloseOnSelect
            getOptionLabel={(option) => option.nickname ?? option.name}
            fullWidth
          />
        ) : (
          <TextField
            variant="filled"
            label={t("people.filter")}
            placeholder={t("people.add.search")}
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
        )}
        <Collapse in={!isInviting}>
          <List>
            {filteredMembers.map((member) => (
              <PeopleMenuListItem user={member} key={member.id} />
            ))}
          </List>
        </Collapse>
        <Collapse in={isInviting}>
          <TextField
            variant="outlined"
            label={t("people.inviteMessage")}
            multiline
            fullWidth
            minRows={3}
            maxRows={8}
            value={inviteMessage}
            onChange={(event) => setInviteMessage(event.currentTarget.value)}
          />
          <Stack spacing={1} direction="row" justifyContent="right" mt={1}>
            <Button onClick={() => setIsInviting(false)}>
              {t("people.cancel")}
            </Button>
            <LoadingButton
              variant="filled"
              disabled={inviteValue.length < 1}
              loading={invitePending}
              onClick={handleSendInvite}
            >
              {t("people.inviteFinished", { count: inviteValue.length })}
            </LoadingButton>
          </Stack>
        </Collapse>
      </Stack>
    </>
  );
}
