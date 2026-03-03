import type { Truck } from '@/types/warehouseTypes'

export const dummyTrucks: Truck[] = [
  {
    id: '1',
    plateNumber: 'MH-12-AB-1234',
    driverName: 'Rajesh Kumar',
    entryTime: '03-12-2024 08:15:00',
    exitTime: '03-12-2024 10:30:00',
    status: 'exit',
    warehouseZone: 'Zone A',
    cargoType: 'Rice'
  },
  {
    id: '2',
    plateNumber: 'DL-05-CD-5678',
    driverName: 'Suresh Patel',
    entryTime: '03-12-2024 09:00:00',
    exitTime: undefined,
    status: 'loading',
    warehouseZone: 'Zone B',
    cargoType: 'Rice'
  },
  {
    id: '3',
    plateNumber: 'KA-01-EF-9012',
    driverName: 'Amit Singh',
    entryTime: '03-12-2024 09:45:00',
    exitTime: undefined,
    status: 'unloading',
    warehouseZone: 'Zone C',
    cargoType: 'Wheat'
  },
  {
    id: '4',
    plateNumber: 'GJ-03-GH-3456',
    driverName: 'Vikram Sharma',
    entryTime: '03-12-2024 10:00:00',
    exitTime: undefined,
    status: 'entry',
    warehouseZone: 'Zone A',
    cargoType: 'Wheat'
  },
  {
    id: '5',
    plateNumber: 'TN-07-IJ-7890',
    driverName: 'Mohan Das',
    entryTime: '03-12-2024 10:30:00',
    exitTime: '03-12-2024 12:00:00',
    status: 'exit',
    warehouseZone: 'Zone D',
    cargoType: 'Rice'
  },
  {
    id: '6',
    plateNumber: 'UP-32-KL-2345',
    driverName: 'Ravi Verma',
    entryTime: '03-12-2024 11:00:00',
    exitTime: undefined,
    status: 'loading',
    warehouseZone: 'Zone B',
    cargoType: 'Rice'
  },
  {
    id: '7',
    plateNumber: 'RJ-14-MN-6789',
    driverName: 'Deepak Joshi',
    entryTime: '03-12-2024 11:30:00',
    exitTime: undefined,
    status: 'entry',
    warehouseZone: 'Zone C',
    cargoType: 'Rice'
  }
]
