import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

const SOPTooltip = () => (
  <Tooltip title='Data pending or SOP Mismatch' arrow>
    <Typography component='span' color='text.secondary' sx={{ fontWeight: 'bold', cursor: 'help', ml: 1 }}>
      *
    </Typography>
  </Tooltip>
)

export default SOPTooltip
