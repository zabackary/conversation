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
  title: ReactNode;
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
  title,
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
    <Card
      variant="filled"
      sx={{
        minWidth: "min(100%, 280px)",
        backgroundColor:
          invite.name === "Main Channel" ? "primaryContainer.main" : undefined,
        color:
          invite.name === "Main Channel"
            ? "onPrimaryContainer.main"
            : undefined,
      }}
    >
      <CardActionArea onClick={handleAcceptClick}>
        <CardHeader
          avatar={
            icon ?? (
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <MaterialSymbolIcon icon="celebration" />
              </Avatar>
            )
          }
          title={title}
          subheader={subheader}
          titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
          subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
        />
        {invite.description !== "" || content ? (
          <CardContent>
            <Typography variant="body1">{invite.description}</Typography>
            {content}
          </CardContent>
        ) : null}
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
  if (channel?.privacyLevel === PrivacyLevel.PUBLIC) {
    privacyLevel = "Public";
  } else if (channel?.privacyLevel === PrivacyLevel.UNLISTED) {
    privacyLevel = "Unlisted";
  } else if (channel?.privacyLevel === PrivacyLevel.PRIVATE) {
    privacyLevel = "Private";
  } else {
    privacyLevel = "";
  }
  return (
    <BaseChannelCard
      handleAccept={handleAccept}
      handleReject={handleReject}
      invite={invite}
      title={invite.name}
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

interface DmChannelCardProps {
  invite: InvitedChannelListing;
  actor: NonNullable<InvitedChannelListing["actor"]>;
  handleAccept(id: number): Promise<void>;
  handleReject(id: number): Promise<void>;
}

function DmChannelCard({
  invite,
  actor,
  handleAccept,
  handleReject,
}: DmChannelCardProps) {
  const user = useUserInfo(actor);
  return (
    <BaseChannelCard
      handleAccept={handleAccept}
      handleReject={handleReject}
      invite={invite}
      title={user?.name}
      subheader={<>aka {user?.nickname}</>}
      content={null}
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
  disablePulse?: boolean;
}

export default function ChannelCard({
  invite,
  handleAccept,
  handleReject,
  disablePulse,
}: ChannelCardProps) {
  if (invite && handleAccept && handleReject && "inviteMessage" in invite) {
    if (invite.actor && invite.dm) {
      return (
        <DmChannelCard
          invite={invite}
          handleAccept={handleAccept}
          handleReject={handleReject}
          actor={invite.actor}
        />
      );
    }
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
        title={invite.name}
        handleAccept={handleAccept}
        handleReject={handleReject}
        subheader="Unknown inviter"
      />
    );
  }
  if (invite && handleAccept) {
    return (
      <BaseChannelCard
        title={invite.name}
        invite={invite}
        handleAccept={handleAccept}
        subheader="Public"
      />
    );
  }
  return (
    <Card variant="filled" sx={{ minWidth: "min(100%, 280px)" }}>
      <CardHeader
        avatar={
          <Skeleton
            variant="circular"
            animation={disablePulse ? false : undefined}
          >
            <Avatar />
          </Skeleton>
        }
        title={<Skeleton animation={disablePulse ? false : undefined} />}
        subheader={<Skeleton animation={disablePulse ? false : undefined} />}
        titleTypographyProps={{ sx: { wordBreak: "break-word" } }}
        subheaderTypographyProps={{ sx: { wordBreak: "break-word" } }}
      />
      <CardContent>
        <Typography variant="body1">
          <Skeleton animation={disablePulse ? false : undefined} />
        </Typography>
      </CardContent>
      <CardActions>
        <Skeleton
          variant="rounded"
          width={80}
          sx={{ ml: 1, mb: 1, borderRadius: 9999, height: "30px" }}
          animation={disablePulse ? false : undefined}
        />
      </CardActions>
    </Card>
  );
}
