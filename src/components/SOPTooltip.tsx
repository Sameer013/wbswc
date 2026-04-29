import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const SOPTooltip = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <Typography component='span' color='text.secondary'>
      SOP Mismatch
    </Typography>
    <Tooltip title='Not recorded due to SOP Mismatch' arrow>
      <Box
        component='span'
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
          cursor: 'default',
          fontSize: '10px',
          fontWeight: 500,
          color: 'text.secondary',
          userSelect: 'none',
          flexShrink: 0
        }}
      >
        i
      </Box>
    </Tooltip>
  </div>
)

export default SOPTooltip
