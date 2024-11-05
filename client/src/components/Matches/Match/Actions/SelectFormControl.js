import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const SelectFormControl = ({
  label,
  value,
  onChange,
  players,
  handleIsDisabled,
}) => (
  <FormControl sx={{ m: 1, minWidth: 100 }} required>
    <InputLabel>{label}</InputLabel>
    <Select value={value || ""} onChange={onChange} autoWidth label={label}>
      {players?.length > 0
        ? players.map((player) => (
            <MenuItem
              key={player._id}
              value={player}
              disabled={handleIsDisabled(player)}
            >
              {player.name}
            </MenuItem>
          ))
        : null}
    </Select>
  </FormControl>
);

export default SelectFormControl;
