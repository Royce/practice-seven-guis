import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@material-ui/core";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Typography component="h1">Counter</Typography>
      <Box>
        <TextField
          disabled
          id="standard-disabled"
          value={count}
          variant="outlined"
          margin="normal"
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </Button>
    </div>
  );
}

export default Counter;
