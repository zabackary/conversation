import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Alert,
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
  Link,
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
    <Tooltip title={<UserTooltip user={user} />}>
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
          showSnackbar("Failed to fetch users.");
        });
    } else {
      // Input is blank
      setOptions(["", []]);
    }
  }, [debouncedAutocompleteInputValue, backend, showSnackbar, memberIds]);
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
        showSnackbar("Invite sent.");
      })
      .catch(() => {
        setInvitePending(false);
        showSnackbar("Failed to send invite.");
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
          {!isInviting ? t("channelInfo.title") : "Invite users"}
        </Typography>
        <IconButton onClick={handleSidebarClose} edge="end">
          <CloseIcon />
        </IconButton>
      </SideSheetToolbar>
      <Stack sx={sx} spacing={isInviting ? 1 : 2}>
        <Alert severity="warning">
          Apologies that I haven&apos;t translated this section yet. Check out{" "}
          <Link href="https://docs.google.com/spreadsheets/d/1vw35q2Ps8Qb1onNiaVHhAmyc4_6VR2Cl2ECSt0B2ZqM/edit">
            the translation spreadsheet
          </Link>{" "}
          if you&apos;re interested in helping.
        </Alert>
        <Collapse in={!isInviting}>
          <Stack spacing={2}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Box>{channel.members.length} members</Box>
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
              <Button>Leave channel</Button>
              <Button onClick={() => setIsInviting(true)}>
                Invite members
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
                label="Add members"
                placeholder="Search users..."
              />
            )}
            noOptionsText={
              // eslint-disable-next-line no-nested-ternary
              autocompleteInputValue === "" ? (
                "Type to start searching."
              ) : options[0] !== autocompleteInputValue ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                "No users found."
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
            label="Filter members"
            placeholder="Search by email, name..."
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
            label="Invite message"
            multiline
            fullWidth
            minRows={3}
            maxRows={8}
            value={inviteMessage}
            onChange={(event) => setInviteMessage(event.currentTarget.value)}
          />
          <Stack spacing={1} direction="row" justifyContent="right" mt={1}>
            <Button onClick={() => setIsInviting(false)}>Cancel</Button>
            <LoadingButton
              variant="filled"
              disabled={inviteValue.length < 1}
              loading={invitePending}
              onClick={handleSendInvite}
            >
              Invite {inviteValue.length} members
            </LoadingButton>
          </Stack>
        </Collapse>
      </Stack>
    </>
  );
}
