import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'

type EventRecord = {
  id: number
  eventType: string
  eventTimestamp: Date
  vehicleNo: string
  vehicleWt: number | null
}

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const VehicleReport = ({ record }: { record: EventRecord }) => {
  const generatedAt = new Date()

  return (
    <Document title={`Vehicle Event #${String(record.id).padStart(6, '0')} Report`} producer='sigma' author='WBSWC'>
      <Page size='A4' style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} /> {/* Logo Icon */}
            <Image style={styles.logoText} src={'/images/logo2.png'} /> {/* Logo Text */}
          </View>
          <View>
            <Text style={styles.reportLabel}>VEHICLE EVENT REPORT</Text>
            <Text style={styles.reportId}>#{String(record.id).padStart(6, '0')}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryBand}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>EVENT DATE</Text>
            <Text style={styles.summaryValue}>{formatDate(record.eventTimestamp)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ENTRY TIME</Text>
            <Text style={styles.summaryValue}>{formatTime(record.eventTimestamp)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>VEHICLE NO.</Text>
            <Text style={styles.summaryValue}>{record.vehicleNo}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>WEIGHT (TONS)</Text>
            <Text style={styles.summaryValue}>{record.vehicleWt != null ? record.vehicleWt.toFixed(2) : '--'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>EVENT DETAILS</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Event ID</Text>
              <Text style={styles.tableCellValue}>#{record.id}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Event Type</Text>
              <Text style={styles.tableCellValue}>{record.eventType}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Date</Text>
              <Text style={styles.tableCellValue}>{formatDate(record.eventTimestamp)}</Text>
            </View>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Vehicle Number</Text>
              <Text style={styles.tableCellValue}>{record.vehicleNo}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Gross Weight</Text>
              <Text style={styles.tableCellValue}>
                {record.vehicleWt != null ? `${record.vehicleWt.toFixed(2)} KGS` : '--'}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Entry Time</Text>
              <Text style={styles.tableCellValue}>{formatTime(record.eventTimestamp)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>STATUS</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PROCESSED</Text>
          </View>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>REMARKS</Text>
          <Text style={styles.notesText}>
            This document serves as an official weighbridge record for vehicle {record.vehicleNo}. The recorded weight
            and timestamps are captured automatically by the ANPR system.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>WB State Warehousing Corporation</Text>

          <Text style={styles.footerText}>
            Generated: {formatDate(generatedAt)} {formatTime(generatedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default VehicleReport
