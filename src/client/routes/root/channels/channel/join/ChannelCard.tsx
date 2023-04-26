import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Typography,
  Paper,
  Stack,
  CardActionArea,
  CardActions,
} from "@mui/material";
import { useState } from "react";
import CelebrationIcon from "@mui/icons-material/Celebration";
import {
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../../../../model/channel";
import useUserInfo from "../../../../../hooks/useUserInfo";
import ProfilePicture from "../../../../../components/ProfilePicture";
import useChannel from "../../../../../hooks/useChannel";
import LoadingButton from "../../../../../components/LoadingButton";
import useSnackbar from "../../../../../components/useSnackbar";

interface InviteChannelCardProps {
  invite: InvitedChannelListing;
  handleAccept(id: number): Promise<void>;
  handleReject(id: number): Promise<void>;
}

function InviteChannelCard({
  invite,
  handleAccept,
  handleReject,
}: InviteChannelCardProps) {
  const user = useUserInfo(invite.actor);
  const channel = useChannel(invite.id);
  let privacyLevel;
  if (channel?.privacyLevel === PrivacyLevel.Public) {
    privacyLevel = "Public";
  } else if (channel?.privacyLevel === PrivacyLevel.Unlisted) {
    privacyLevel = "Unlisted";
  } else if (channel?.privacyLevel === PrivacyLevel.Private) {
    privacyLevel = "Private";
  } else {
    privacyLevel = "";
  }
  const { showSnackbar } = useSnackbar();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const handleAcceptClick = () => {
    setAcceptLoading(true);
    handleAccept(invite.id)
      .then(() => {
        setAcceptLoading(false);
        showSnackbar("Accepted invite. Reload to start chatting!");
      })
      .catch(() => {
        showSnackbar("Failed to accept invite.");
      });
  };
  const [rejectLoading, setRejectLoading] = useState(false);
  const handleRejectClick = () => {
    setRejectLoading(true);
    handleReject(invite.id)
      .then(() => {
        setRejectLoading(false);
        showSnackbar("Rejected invite. It will disappear when you refresh.");
      })
      .catch(() => {
        showSnackbar("Failed to reject invite.");
      });
  };
  return (
    <Card variant="filled" sx={{ width: "min(100%, 280px)" }}>
      <CardActionArea onClick={handleAcceptClick}>
        <CardHeader
          avatar={
            user ? (
              <ProfilePicture user={user} sx={{ bgcolor: "secondary.main" }} />
            ) : (
              <Skeleton variant="circular">
                <Avatar />
              </Skeleton>
            )
          }
          title={invite.name}
          subheader={
            <>
              {privacyLevel} &middot; {channel?.members.length} members
            </>
          }
          titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
          subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
        />
        <CardContent>
          <Typography variant="body1">{invite.description}</Typography>
          <Stack direction="row" spacing={1} mt={2}>
            {user ? (
              <Avatar
                sx={{
                  width: "1.3em",
                  height: "1.3em",
                  bgcolor: "secondary.main",
                }}
                src={user.profilePicture}
                alt={user.name}
              >
                {(user.nickname ?? user.name)[0]}
              </Avatar>
            ) : (
              <Skeleton variant="circular">
                <Avatar sx={{ width: "1.3em", height: "1.3em" }} />
              </Skeleton>
            )}
            <Typography color="text.secondary">
              {user ? (
                <>
                  <b>{user.nickname}</b> said:
                </>
              ) : (
                <Skeleton width={120} />
              )}
            </Typography>
          </Stack>
          <Paper
            component="blockquote"
            elevation={3}
            sx={{
              borderLeft: "3px solid black",
              borderLeftColor: "primary.main",
              pl: 1,
              py: 0.5,
              mx: 1,
              mt: 2,
              mb: 0,
            }}
          >
            <Typography variant="body2">{invite.inviteMessage}</Typography>
          </Paper>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <LoadingButton onClick={handleRejectClick} loading={rejectLoading}>
          Reject
        </LoadingButton>
        <LoadingButton onClick={handleAcceptClick} loading={acceptLoading}>
          Accept
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

interface PublicChannelCardProps {
  invite: PublicChannelListing;
  handleAccept(id: number): Promise<void>;
}

function PublicChannelCard({
  invite,
  handleAccept: _handleAccept,
}: PublicChannelCardProps) {
  const { showSnackbar } = useSnackbar();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const handleAcceptClick = () => {
    setAcceptLoading(true);
    showSnackbar("You can't join public channels yet. Keep your eyes peeled!");
    /*
    handleAccept(invite.id)
      .then(() => {
        setAcceptLoading(false);
        showSnackbar("Accepted invite. Reload to start chatting!");
      })
      .catch(() => {
        showSnackbar("Failed to accept invite.");
      }); */
  };
  return (
    <Card variant="filled" sx={{ width: "min(100%, 280px)" }}>
      <CardActionArea onClick={handleAcceptClick}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <CelebrationIcon />
            </Avatar>
          }
          title={invite.name}
          subheader="Public"
          titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
          subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
        />
        <CardContent>
          <Typography variant="body1">{invite.description}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <LoadingButton onClick={handleAcceptClick} loading={acceptLoading}>
          Join channel
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

export interface ChannelCardProps {
  invite?: InvitedChannelListing | PublicChannelListing;
  handleAccept?(id: number): Promise<void>;
  handleReject?(id: number): Promise<void>;
}

export default function ChannelCard({
  invite,
  handleAccept,
  handleReject,
}: ChannelCardProps) {
  if (invite && handleAccept && handleReject && "inviteMessage" in invite) {
    return (
      <InviteChannelCard
        invite={invite}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    );
  }
  if (invite && handleAccept) {
    return <PublicChannelCard invite={invite} handleAccept={handleAccept} />;
  }
  return (
    <Card variant="filled" sx={{ width: "min(100%, 280px)" }}>
      <CardHeader
        avatar={
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        }
        title={<Skeleton />}
        subheader={<Skeleton />}
        titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
        subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
      />
      <CardContent>
        <Typography variant="body1">
          <Skeleton />
        </Typography>
      </CardContent>
      <CardActions>
        <Skeleton variant="rounded" width={80} sx={{ ml: 1, mb: 1 }} />
      </CardActions>
    </Card>
  );
}
