import {
  Avatar,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode, useState } from "react";
import {
  InvitedChannelListing,
  PrivacyLevel,
  PublicChannelListing,
} from "../../../../../../model/channel";
import LoadingButton from "../../../../../components/LoadingButton";
import MaterialSymbolIcon from "../../../../../components/MaterialSymbolIcon";
import ProfilePicture from "../../../../../components/ProfilePicture";
import useSnackbar from "../../../../../components/useSnackbar";
import useChannel from "../../../../../hooks/useChannel";
import useUserInfo from "../../../../../hooks/useUserInfo";

interface BaseChannelCardProps {
  invite: PublicChannelListing;
  icon?: ReactNode;
  subheader: ReactNode;
  content?: ReactNode;
  handleAccept(id: number): Promise<void>;
  handleReject?(id: number): Promise<void>;
}

function BaseChannelCard({
  invite,
  handleAccept,
  handleReject,
  content,
  subheader,
  icon,
}: BaseChannelCardProps) {
  const { showSnackbar } = useSnackbar();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const handleAcceptClick = () => {
    setAcceptLoading(true);
    handleAccept(invite.id)
      .then(() => {
        setAcceptLoading(false);
        showSnackbar("Accepted invite.");
      })
      .catch(() => {
        showSnackbar("Failed to accept invite.");
      });
  };
  const [rejectLoading, setRejectLoading] = useState(false);
  const handleRejectClick = () => {
    if (!handleReject) throw new Error("Must be rejectable to reject");
    setRejectLoading(true);
    handleReject(invite.id)
      .then(() => {
        setRejectLoading(false);
        showSnackbar("Rejected invite.");
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
            icon ?? (
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <MaterialSymbolIcon icon="celebration" />
              </Avatar>
            )
          }
          title={invite.name}
          subheader={subheader}
          titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
          subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
        />
        <CardContent>
          <Typography variant="body1">{invite.description}</Typography>
          {content}
        </CardContent>
      </CardActionArea>
      <CardActions>
        {handleReject ? (
          <LoadingButton onClick={handleRejectClick} loading={rejectLoading}>
            Reject
          </LoadingButton>
        ) : null}
        <LoadingButton onClick={handleAcceptClick} loading={acceptLoading}>
          {/* TODO: Translate */}
          {handleReject ? "Accept" : "Join channel"}
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

interface InviteChannelCardProps {
  invite: InvitedChannelListing;
  actor: NonNullable<InvitedChannelListing["actor"]>;
  handleAccept(id: number): Promise<void>;
  handleReject(id: number): Promise<void>;
}

function InviteChannelCard({
  invite,
  actor,
  handleAccept,
  handleReject,
}: InviteChannelCardProps) {
  const user = useUserInfo(actor);
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
  return (
    <BaseChannelCard
      handleAccept={handleAccept}
      handleReject={handleReject}
      invite={invite}
      subheader={
        <>
          {privacyLevel} &middot; {channel?.members.length} members
        </>
      }
      content={
        <>
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
        </>
      }
      icon={
        user ? (
          <ProfilePicture user={user} sx={{ bgcolor: "secondary.main" }} />
        ) : (
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        )
      }
    />
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
    if (invite.actor) {
      return (
        <InviteChannelCard
          invite={invite}
          handleAccept={handleAccept}
          handleReject={handleReject}
          actor={invite.actor}
        />
      );
    }
    return (
      <BaseChannelCard
        invite={invite}
        handleAccept={handleAccept}
        handleReject={handleReject}
        subheader="Unknown inviter"
      />
    );
  }
  if (invite && handleAccept) {
    return (
      <BaseChannelCard
        invite={invite}
        handleAccept={handleAccept}
        subheader="Public"
      />
    );
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
