import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  SxProps,
  Typography,
} from "@mui/material";

interface ListItemSkeletonProps {
  header?: boolean;
  image?: boolean;
  width: number;
}

function ListItemSkeleton({ header, image, width }: ListItemSkeletonProps) {
  return (
    <ListItem
      alignItems="flex-start"
      disablePadding
      sx={{ overflow: "hidden", px: 3 }}
    >
      <ListItemAvatar>
        <Skeleton width={40} height={40} variant="circular" />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Skeleton width={100} sx={{ display: "inline-block" }} />{" "}
            <Typography variant="body2" component="span" sx={{ opacity: 0.5 }}>
              <Skeleton width={70} sx={{ display: "inline-block" }} />
            </Typography>
          </>
        }
        secondary={
          <>
            {header ? <Skeleton width={180} height={60} /> : null}
            <Skeleton width={width} />
            {image ? <Skeleton width={200} height={200} /> : null}
          </>
        }
        secondaryTypographyProps={{ component: "div" }}
      />
    </ListItem>
  );
}

interface ChatListSkeletonProps {
  sx: SxProps;
}

export default function ChatListSkeleton({ sx }: ChatListSkeletonProps) {
  return (
    <List sx={{ ...sx }}>
      <ListItemSkeleton width={300} />
      <ListItemSkeleton width={350} image />
      <ListItemSkeleton width={200} header />
      <ListItemSkeleton width={420} />
      <ListItemSkeleton width={310} />
      <ListItemSkeleton width={350} header />
      <ListItemSkeleton width={300} image />
      <ListItemSkeleton width={350} />
      <ListItemSkeleton width={300} />
      <ListItemSkeleton width={350} />
    </List>
  );
}
