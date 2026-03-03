export type Truck = {
  id: string
  plateNumber: string
  driverName: string
  entryTime: string
  exitTime?: string
  status: 'entry' | 'exit' | 'loading' | 'unloading'
  warehouseZone: string
  cargoType: string
}
