import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEventHandler, DragEventHandler, useState } from "react";
import { validateUrl } from "../../../shared/validation";
import MaterialSymbolIcon from "../MaterialSymbolIcon";

export interface ImagePickerProps {
  allowFiles?: boolean;
  onImageSelected: (image: string | File) => void;
}

export default function ImagePicker({
  allowFiles = true,
  onImageSelected,
}: ImagePickerProps) {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const handleValueChange: ChangeEventHandler<HTMLTextAreaElement> = ({
    currentTarget: { value: newValue },
  }) => {
    setValue(newValue);
    setIsValid(validateUrl(newValue));
  };
  const handleDone = () => {
    if (validateUrl(value)) {
      onImageSelected(value);
      setValue("");
      setIsValid(null);
    }
  };
  const handleUpload = () => {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = "image/*";
    uploadInput.click();
    uploadInput.addEventListener("change", () => {
      if (uploadInput.files && uploadInput.files.length > 0) {
        const item = uploadInput.files[0];
        onImageSelected(item);
      }
    });
  };
  const [entranceCounter, setEntranceCounter] = useState(0);
  const handleDrop: DragEventHandler = (e) => {
    e.preventDefault();
    setEntranceCounter(0);
    if (e.dataTransfer.files.length > 0) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };
  const handleDragEnter: DragEventHandler = () => {
    setEntranceCounter((x) => x + 1);
  };
  const handleDragLeave: DragEventHandler = () => {
    setEntranceCounter((x) => x - 1);
  };
  const handleDragOver: DragEventHandler = (e) => {
    e.preventDefault();
  };
  const dropping = entranceCounter > 0;
  return (
    <Stack height="400px" px={1}>
      <Collapse in={isValid === null ? false : !isValid}>
        <Alert severity="error" sx={{ m: 1 }}>
          Sorry, you can&apos;t use that image.
        </Alert>
      </Collapse>
      <Collapse in={isValid === null && value !== ""}>
        <Alert severity="error" sx={{ m: 1 }}>
          That doesn&apos;t seem to be a URL.
        </Alert>
      </Collapse>
      <TextField
        label="Image URL"
        value={value}
        onChange={handleValueChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleDone}
                disabled={isValid !== true}
                aria-label="Done"
              >
                <MaterialSymbolIcon icon="done" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Card sx={{ p: 0, flexGrow: 1, mb: 1 }} variant="elevation">
        <CardActionArea
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            bgcolor: dropping ? "primaryContainer.main" : undefined,
            transition: "background-color 300ms",
          }}
          disabled={!allowFiles}
          onClick={handleUpload}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          {isValid && value !== "" ? (
            <CardMedia component="img" image={value} alt="selected image" />
          ) : (
            <>
              <CardMedia>
                {allowFiles ? (
                  <MaterialSymbolIcon size={48} icon="cloud_upload" />
                ) : (
                  <MaterialSymbolIcon size={48} icon="link" />
                )}
              </CardMedia>
              <CardContent>
                <Typography variant="caption">
                  {allowFiles
                    ? "Drag or click to upload a file."
                    : "Enter an image URL."}
                </Typography>
              </CardContent>
            </>
          )}
        </CardActionArea>
      </Card>
    </Stack>
  );
}
