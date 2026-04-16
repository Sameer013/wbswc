// 'use client'

// import { useState, useEffect } from 'react'

// import {
//   Card,
//   CardContent,
//   Button,
//   Typography,
//   TextField,
//   Box,
//   CircularProgress,
//   IconButton,
//   Stack
// } from '@mui/material'
// import { CheckCircle, Cancel, CameraAlt, DirectionsCar, Refresh } from '@mui/icons-material'

// // import { triggerCapture, saveVehicleLog, getLastEntry } from '@/app/server/action'
// import { formatTimestamp } from '@/utils/functions'

// const VehiclePunchMobile = () => {
//   // UI States: 'idle' | 'review'
//   const [view, setView] = useState<'idle' | 'review'>('idle')
//   const [loading, setLoading] = useState(false)

//   // Data States
//   const [lastRecord, setLastRecord] = useState<any>(null)

//   const [currentCapture, setCurrentCapture] = useState<{
//     id: number
//     vehicleNo: string
//     imgUrl: string
//     movement: string
//   } | null>(null)

//   const [editableVehicleNo, setEditableVehicleNo] = useState('')

//   // Load last activity on mount
//   // useEffect(() => {
//   //   refreshLastActivity()
//   // }, [])

//   // const refreshLastActivity = async () => {
//   //   const data = await getLastEntry()

//   //   setLastRecord(data)
//   // }

//   // Step 1: Trigger Camera
//   const handleTrigger = async (mode: '1' | '2') => {
//     setLoading(true)

//     try {
//       // triggerCapture should trigger the camera and return the ANPR result + image
//       const result = await triggerCapture(mode)

//       setCurrentCapture({ ...result, movement: mode })
//       setEditableVehicleNo(result.vehicleNo)
//       setView('review')
//     } catch (error) {
//       alert('Camera trigger failed. Please check connection.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Step 2: Confirm and Save
//   const handleSave = async () => {
//     if (!editableVehicleNo) return
//     setLoading(true)

//     try {
//       await saveVehicleLog({
//         id: currentCapture?.id,
//         finalVehicleNo: editableVehicleNo,
//         movement: currentCapture?.movement
//       })
//       setView('idle')
//       refreshLastActivity()
//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (view === 'review') {
//     return (
//       <Box sx={{ p: 2, maxWidth: 450, mx: 'auto' }}>
//         <Typography variant='h6' gutterBottom fontWeight='bold'>
//           Verify Detection
//         </Typography>

//         <Card sx={{ mb: 2, overflow: 'hidden' }}>
//           {/* Image captured from camera */}
//           <Box
//             component='img'
//             src={currentCapture?.imgUrl}
//             sx={{ width: '100%', height: 200, objectFit: 'cover', bgcolor: '#000' }}
//           />
//           <CardContent>
//             <Typography variant='subtitle2' color='textSecondary'>
//               Edit Plate if incorrect:
//             </Typography>
//             <TextField
//               fullWidth
//               variant='filled'
//               value={editableVehicleNo}
//               onChange={e => setEditableVehicleNo(e.target.value.toUpperCase())}
//               inputProps={{ style: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' } }}
//               sx={{ mt: 1, bgcolor: '#fffbed' }}
//             />
//           </CardContent>
//         </Card>

//         <Stack direction='row' spacing={2}>
//           <Button
//             fullWidth
//             variant='outlined'
//             color='error'
//             startIcon={<Cancel />}
//             onClick={() => setView('idle')}
//             sx={{ height: 60 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             fullWidth
//             variant='contained'
//             color='success'
//             startIcon={<CheckCircle />}
//             onClick={handleSave}
//             disabled={loading}
//             sx={{ height: 60, fontWeight: 'bold' }}
//           >
//             {loading ? <CircularProgress size={24} /> : 'SAVE'}
//           </Button>
//         </Stack>
//       </Box>
//     )
//   }

//   return (
//     <Box sx={{ p: 2, maxWidth: 450, mx: 'auto' }}>
//       {/* Top Section: Last Entry */}
//       <Card sx={{ mb: 4, bgcolor: '#e3f2fd', borderLeft: '5px solid #1976d2' }}>
//         <CardContent>
//           <Stack direction='row' justifyContent='space-between'>
//             <Typography variant='overline'>Last Record</Typography>
//             <IconButton size='small' onClick={refreshLastActivity}>
//               <Refresh fontSize='inherit' />
//             </IconButton>
//           </Stack>
//           {lastRecord ? (
//             <Box>
//               <Typography variant='h5' fontWeight='bold'>
//                 {lastRecord.vehicleNo}
//               </Typography>
//               <Typography variant='caption' color='textSecondary'>
//                 {lastRecord.movement === '1' ? 'Entered' : 'Exited'} at{' '}
//                 {formatTimestamp(new Date(lastRecord.timestamp))}
//               </Typography>
//             </Box>
//           ) : (
//             <Typography variant='body2'>No entries today</Typography>
//           )}
//         </CardContent>
//       </Card>

//       {/* Main Buttons */}
//       <Typography variant='h6' align='center' sx={{ mb: 2, fontWeight: 'bold' }}>
//         Trigger Gate Capture
//       </Typography>

//       <Stack spacing={2}>
//         <Button
//           variant='contained'
//           color='success'
//           onClick={() => handleTrigger('1')}
//           disabled={loading}
//           sx={{ height: 120, fontSize: '1.5rem', fontWeight: 'bold', borderRadius: 4 }}
//           startIcon={<CameraAlt sx={{ fontSize: 40 }} />}
//         >
//           {loading ? <CircularProgress color='inherit' /> : 'ENTRY'}
//         </Button>

//         <Button
//           variant='contained'
//           color='primary'
//           onClick={() => handleTrigger('2')}
//           disabled={loading}
//           sx={{ height: 120, fontSize: '1.5rem', fontWeight: 'bold', borderRadius: 4 }}
//           startIcon={<CameraAlt sx={{ fontSize: 40 }} />}
//         >
//           {loading ? <CircularProgress color='inherit' /> : 'EXIT'}
//         </Button>
//       </Stack>
//     </Box>
//   )
// }

// export default VehiclePunchMobile

export default function Page() {
  return <>Hello</>
}
