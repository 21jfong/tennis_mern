import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid2,
  Card,
  Grow,
} from "@mui/material";
import { useDispatch } from "react-redux";
import useStyles from "../styles";
import { useNavigate } from "react-router-dom";

import { joinTeam } from "../../../../actions/teams";

const CreateTeam = ({ setIsAlert, setAlertMessage }) => {
  const [teamCode, setTeamCode] = useState({ code: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const clear = () => {
    setTeamCode({ code: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(joinTeam(teamCode.code));
    checkForAlert(response);
    navigate(-1);
    clear();
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Grow in>
      <Grid2 container direction="column" sx={{ gap: 2 }}>
        <Paper
          sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
          className={classes.paper}
        >
          <form
            autoComplete="off"
            noValidate
            className={`${classes.root} ${classes.form}`}
            onSubmit={handleSubmit}
          >
            <Card sx={{ bgcolor: "primary.lighter", padding: 2 }}>
              <Grid2 container justifyContent={"center"}>
                <Typography variant="h6">Find Team</Typography>
              </Grid2>
              <Grid2 container>
                <Grid2>
                  <TextField
                    name="code"
                    sx={{ height: 56 }}
                    variant="outlined"
                    label="Team Code"
                    value={teamCode.code}
                    onChange={(e) => setTeamCode({ code: e.target.value })}
                  />
                </Grid2>
                <Grid2 alignItems="center" display="flex">
                  <Button
                    className={classes.buttonSubmit}
                    variant="contained"
                    color="secondary"
                    type="submit"
                  >
                    Join
                  </Button>
                </Grid2>
              </Grid2>
            </Card>
          </form>
        </Paper>

        <Grid2 container justifyContent="flex-end">
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Grid2>
      </Grid2>
    </Grow>
  );
};

export default CreateTeam;
