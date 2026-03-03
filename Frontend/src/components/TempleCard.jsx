import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TempleCard({ temple }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h6">{temple.name}</Typography>
        <Typography>{temple.location}</Typography>
        <Typography>
          {temple.darshanStartTime} - {temple.darshanEndTime}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/temples/${temple.id}/slots`)}
        >
          View Slots
        </Button>
      </CardContent>
    </Card>
  );
}